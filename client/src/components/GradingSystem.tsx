import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

// Grade configuration based on university standards
export const GRADE_CONFIG = [
  { grade: 'O', description: 'Outstanding', minMarks: 91, maxMarks: 100, points: 10, color: 'bg-green-600' },
  { grade: 'A+', description: 'Excellent', minMarks: 81, maxMarks: 90, points: 9, color: 'bg-green-500' },
  { grade: 'A', description: 'Very Good', minMarks: 71, maxMarks: 80, points: 8, color: 'bg-blue-500' },
  { grade: 'B+', description: 'Good', minMarks: 61, maxMarks: 70, points: 7, color: 'bg-blue-400' },
  { grade: 'B', description: 'Average', minMarks: 50, maxMarks: 60, points: 6, color: 'bg-yellow-500' },
  { grade: 'C', description: 'Satisfactory', minMarks: 45, maxMarks: 49, points: 5, color: 'bg-orange-500' },
  { grade: 'U', description: 'Fail', minMarks: 0, maxMarks: 44, points: 0, color: 'bg-red-500' },
  { grade: 'SA', description: 'Shortage of Attendance', minMarks: 0, maxMarks: 0, points: 0, color: 'bg-gray-500' },
  { grade: 'W', description: 'Withdrawn', minMarks: 0, maxMarks: 0, points: 0, color: 'bg-gray-400' }
];

// Calculate grade based on total marks
export const calculateGrade = (totalMarks: number, hasAttendanceShortage: boolean = false, isWithdrawn: boolean = false): string => {
  if (isWithdrawn) return 'W';
  if (hasAttendanceShortage) return 'SA';
  
  for (const config of GRADE_CONFIG) {
    if (config.grade === 'SA' || config.grade === 'W') continue;
    if (totalMarks >= config.minMarks && totalMarks <= config.maxMarks) {
      return config.grade;
    }
  }
  return 'U';
};

// Calculate total marks from IAT and external
export const calculateTotalMarks = (iat1: number, iat2: number, external: number): number => {
  // Internal: 40% of 200 marks (IAT1 + IAT2)
  const internalMarks = ((iat1 + iat2) / 200) * 40;
  
  // External: 60% of 100 marks
  const externalMarks = (external / 100) * 60;
  
  // Total out of 100
  return Math.round(internalMarks + externalMarks);
};

// Get grade points for a grade
export const getGradePoints = (grade: string): number => {
  const config = GRADE_CONFIG.find(g => g.grade === grade);
  return config ? config.points : 0;
};

// Get grade color
export const getGradeColor = (grade: string): string => {
  const config = GRADE_CONFIG.find(g => g.grade === grade);
  return config ? config.color : 'bg-gray-500';
};

interface GradingSystemProps {
  showCalculator?: boolean;
}

const GradingSystem: React.FC<GradingSystemProps> = ({ showCalculator = false }) => {
  const [iat1, setIat1] = React.useState<number>(0);
  const [iat2, setIat2] = React.useState<number>(0);
  const [external, setExternal] = React.useState<number>(0);

  const totalMarks = calculateTotalMarks(iat1, iat2, external);
  const grade = calculateGrade(totalMarks);
  const gradePoints = getGradePoints(grade);

  return (
    <div className="space-y-6">
      {/* Grade Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">University Grading System</CardTitle>
          <p className="text-sm text-muted-foreground">
            Internal Assessment: 40% of 200 marks (IAT 1 + IAT 2) | External Exam: 60% of 100 marks
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Grade</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Mark Range</TableHead>
                <TableHead className="w-24">Grade Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GRADE_CONFIG.map((config) => (
                <TableRow key={config.grade}>
                  <TableCell>
                    <Badge className={`${config.color} text-white font-bold`}>
                      {config.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{config.description}</TableCell>
                  <TableCell>
                    {config.grade === 'SA' || config.grade === 'W' 
                      ? '-' 
                      : config.grade === 'U' 
                        ? 'Below 45'
                        : `${config.minMarks}-${config.maxMarks}`
                    }
                  </TableCell>
                  <TableCell className="font-bold">{config.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Grade Calculator */}
      {showCalculator && (
        <Card>
          <CardHeader>
            <CardTitle>Grade Calculator</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your IAT and external marks to calculate your grade
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">IAT 1 (out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={iat1}
                  onChange={(e) => setIat1(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">IAT 2 (out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={iat2}
                  onChange={(e) => setIat2(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">External (out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={external}
                  onChange={(e) => setExternal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Calculation Result:</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Internal Marks</p>
                  <p className="text-lg font-bold">{Math.round(((iat1 + iat2) / 200) * 40)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">External Marks</p>
                  <p className="text-lg font-bold">{Math.round((external / 100) * 60)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Marks</p>
                  <p className="text-lg font-bold">{totalMarks}/100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade</p>
                  <Badge className={`${getGradeColor(grade)} text-white font-bold text-lg`}>
                    {grade} ({gradePoints} points)
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Minimum 75% attendance is required to be eligible for examinations
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Students with less than 75% attendance will receive SA (Shortage of Attendance) grade
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Internal Assessment contributes 40% (based on IAT 1 & IAT 2 out of 100 each, total 200)
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              External Examination contributes 60% (out of 100 marks)
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Final grade is calculated on a total of 100 marks
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradingSystem;