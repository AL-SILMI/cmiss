/*
  Imports/upserts courses into CMIS Course collection from JSON.

  Usage:
    node server/scripts/importCourses.js [path_to_json]

  Defaults:
    JSON path: server/scripts/data/courses.json
*/

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cmis';

async function connectDB() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

function resolveJsonPath() {
  const argPath = process.argv[2];
  const defaultPath = path.join(__dirname, 'data', 'courses.json');
  return path.resolve(argPath || defaultPath);
}

function normalizeDepartmentKey(depKey) {
  // Keep the provided key as department display string if name absent
  return depKey;
}

async function upsertCourse(c, department, semester) {
  const filter = { courseId: c.courseId };
  const update = {
    courseId: c.courseId,
    name: c.name,
    department: department,
    credits: c.credits ?? 0,
    description: c.description ?? '',
    semester: Number(semester),
    instructor: c.instructor ?? 'TBD',
  };

  const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
  return Course.findOneAndUpdate(filter, update, opts);
}

async function importCourses(jsonPath) {
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON file not found: ${jsonPath}`);
  }
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);

  const departments = data.departments || {};
  let inserted = 0;
  let updated = 0;
  const results = [];

  for (const depKey of Object.keys(departments)) {
    const dep = departments[depKey];
    const departmentName = dep.name || normalizeDepartmentKey(depKey);
    const semesters = dep.semesters || {};

    for (const semKey of Object.keys(semesters)) {
      const courses = semesters[semKey] || [];
      for (const c of courses) {
        const existing = await Course.findOne({ courseId: c.courseId });
        const doc = await upsertCourse(c, departmentName, semKey);
        if (existing) updated += 1; else inserted += 1;
        results.push({ courseId: doc.courseId, name: doc.name, department: doc.department, semester: doc.semester });
      }
    }
  }

  return { inserted, updated, results };
}

(async () => {
  try {
    const jsonPath = resolveJsonPath();
    console.log(`[importCourses] Connecting to DB: ${MONGO_URI}`);
    await connectDB();
    console.log(`[importCourses] Using JSON: ${jsonPath}`);

    const { inserted, updated, results } = await importCourses(jsonPath);
    console.log(`[importCourses] Upsert complete. Inserted: ${inserted}, Updated: ${updated}`);
    for (const r of results) {
      console.log(`- ${r.courseId} | ${r.name} | ${r.department} | Sem ${r.semester}`);
    }
  } catch (err) {
    console.error('[importCourses] Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();