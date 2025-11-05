import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:5000") + "/api";

type StudentLite = {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  semester: number;
  batch: string;
};

const ManageStudents = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<any>(null);
  const [students, setStudents] = useState<StudentLite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [editing, setEditing] = useState<Record<string, Partial<StudentLite>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const staffStr = localStorage.getItem("staff");
    const token = localStorage.getItem("staffToken");
    if (!staffStr || !token) {
      setError("You are not logged in as staff.");
      setLoading(false);
      return;
    }
    const s = JSON.parse(staffStr);
    setStaff(s);
    setDepartment(s.department);
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("staffToken");
      const url = new URL(`${API_BASE}/staff/students`);
      if (department) url.searchParams.set("department", department);
      if (query) url.searchParams.set("q", query);
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch students");
      setStudents(data);
      setError(null);
    } catch (err: any) {
      console.error("Fetch students error:", err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!staff) return;
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff]);

  const filtered = useMemo(() => students, [students]);

  const startEdit = (s: StudentLite) => {
    setEditing((prev) => ({ ...prev, [s._id]: { ...s } }));
  };

  const cancelEdit = (id: string) => {
    setEditing((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const changeField = (id: string, field: keyof StudentLite, value: any) => {
    setEditing((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const saveEdit = async (id: string) => {
    try {
      setSavingId(id);
      const token = localStorage.getItem("staffToken");
      const payload = editing[id];
      const res = await fetch(`${API_BASE}/staff/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");
      setStudents((prev) => prev.map((s) => (s._id === id ? (data.student as StudentLite) : s)));
      cancelEdit(id);
    } catch (err: any) {
      alert(err.message || "Failed to update student");
    } finally {
      setSavingId(null);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/staff-login"><Button>Go to Staff Login</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Manage Students</h1>
          <p className="text-sm text-muted-foreground">View and edit student details</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>Filter and update essentials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 mb-4">
            <div>
              <Label htmlFor="dept">Department</Label>
              <Input id="dept" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Computer Science" />
            </div>
            <div>
              <Label htmlFor="q">Search</Label>
              <Input id="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email or student ID" />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchStudents} disabled={loading}>{loading ? "Loading..." : "Refresh"}</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => {
                  const isEditing = !!editing[s._id];
                  const row = editing[s._id] || s;
                  return (
                    <TableRow key={s._id}>
                      <TableCell className="font-medium">{s.studentId}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input value={row.name || ""} onChange={(e) => changeField(s._id, 'name', e.target.value)} />
                        ) : (
                          s.name
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input value={row.email || ""} onChange={(e) => changeField(s._id, 'email', e.target.value)} />
                        ) : (
                          s.email
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input value={row.department || ""} onChange={(e) => changeField(s._id, 'department', e.target.value)} />
                        ) : (
                          s.department
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input type="number" value={String(row.semester ?? "")} onChange={(e) => changeField(s._id, 'semester', Number(e.target.value))} />
                        ) : (
                          s.semester
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input value={row.batch || ""} onChange={(e) => changeField(s._id, 'batch', e.target.value)} />
                        ) : (
                          s.batch
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {isEditing ? (
                          <>
                            <Button size="sm" variant="secondary" onClick={() => cancelEdit(s._id)} disabled={savingId === s._id}>Cancel</Button>
                            <Button size="sm" onClick={() => saveEdit(s._id)} disabled={savingId === s._id}>{savingId === s._id ? 'Saving...' : 'Save'}</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEdit(s)}>Edit</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">No students found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageStudents;