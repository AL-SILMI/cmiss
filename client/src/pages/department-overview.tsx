import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:5000") + "/api";

type CourseLite = {
  _id: string;
  courseId: string;
  name: string;
  semester: number;
  credits: number;
  instructor?: string;
};

type OverviewResp = {
  department: string;
  courseCount: number;
  studentCount: number;
  averages: { internal: number; external: number; total: number };
  courses: CourseLite[];
};

const DepartmentOverview = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<OverviewResp | null>(null);

  useEffect(() => {
    const staffStr = localStorage.getItem("staff");
    const token = localStorage.getItem("staffToken");
    if (!staffStr || !token) {
      setError("You are not logged in as staff.");
      setLoading(false);
      return;
    }
    const s = JSON.parse(staffStr);
    setDepartment(s.department || "");
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("staffToken");
      const url = new URL(`${API_BASE}/staff/department/overview`);
      if (department) url.searchParams.set("department", department);
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch overview");
      setOverview(data);
      setError(null);
    } catch (err: any) {
      console.error("Fetch overview error:", err);
      setError(err.message || "Failed to load overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!department) return;
    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Department Overview</h1>
          <p className="text-sm text-muted-foreground">Summary for courses and performance</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Select department to view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Department</label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Computer Science" />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchOverview} disabled={loading}>{loading ? "Loading..." : "Refresh"}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {overview && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Totals</CardTitle>
              <CardDescription>Department-wide coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Courses</span><span className="font-semibold">{overview.courseCount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Students</span><span className="font-semibold">{overview.studentCount}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance (Avg)</CardTitle>
              <CardDescription>Across recorded marks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Internal</span><span className="font-semibold">{overview.averages.internal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">External</span><span className="font-semibold">{overview.averages.external}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-semibold">{overview.averages.total}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Top Courses</CardTitle>
              <CardDescription>From department catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Sem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overview.courses.slice(0, 8).map((c) => (
                      <TableRow key={c._id}>
                        <TableCell className="font-medium">{c.courseId}</TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.semester}</TableCell>
                      </TableRow>
                    ))}
                    {overview.courses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">No courses found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DepartmentOverview;