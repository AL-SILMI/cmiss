import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Users, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const StaffPortal = () => {
  const [staff, setStaff] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ studentId: "", courseId: "", internal: "", external: "", semester: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("staff");
    if (!stored) {
      setError("You are not logged in. Please login as staff.");
      return;
    }
    setStaff(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staff");
    navigate("/staff-login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("staffToken");
    if (!token) {
      toast({ title: "Not authenticated", description: "Please login as staff." });
      return;
    }
    if (!form.studentId || !form.courseId || !form.semester) {
      toast({ title: "Missing fields", description: "studentId, courseId and semester are required." });
      return;
    }
    setSubmitting(true);
    try {
      const apiBase = (import.meta.env.VITE_API_URL ?? "http://localhost:5000");
      const res = await fetch(`${apiBase}/api/staff/marks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: form.studentId,
          courseId: form.courseId,
          internal: Number(form.internal || 0),
          external: Number(form.external || 0),
          semester: form.semester,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.message) || `Request failed (${res.status})`);
      toast({ title: data.message || "Saved", description: `Total: ${data.mark.total}, Grade: ${data.mark.grade}` });
      setForm({ studentId: "", courseId: "", internal: "", external: "", semester: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <Card className="w-full max-w-md p-6 text-center">
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

  if (!staff) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6" />
          <div>
            <p className="font-semibold">{staff.name}</p>
            <p className="text-sm text-muted-foreground">{staff.department} · {staff.role}</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout}><LogOut className="h-4 w-4 mr-1" /> Logout</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Enter/Update Marks</CardTitle>
            <CardDescription>Record marks for your department’s students</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" name="studentId" value={form.studentId} onChange={handleChange} placeholder="e.g., S2021CSE001" />
                </div>
                <div>
                  <Label htmlFor="courseId">Course ID</Label>
                  <Input id="courseId" name="courseId" value={form.courseId} onChange={handleChange} placeholder="e.g., CS301" />
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input id="semester" name="semester" value={form.semester} onChange={handleChange} placeholder="e.g., 3" />
                </div>
                <div>
                  <Label htmlFor="internal">Internal (50)</Label>
                  <Input id="internal" name="internal" type="number" value={form.internal} onChange={handleChange} placeholder="e.g., 42" />
                </div>
                <div>
                  <Label htmlFor="external">External (100)</Label>
                  <Input id="external" name="external" type="number" value={form.external} onChange={handleChange} placeholder="e.g., 78" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Marks"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Students</CardTitle>
            <CardDescription>View and edit student details</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/staff/manage-students"><Button variant="secondary">Open</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Summary for courses and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/staff/department-overview"><Button variant="secondary">Open</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Student Fees</CardTitle>
            <CardDescription>Update fee structure for students</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/staff/manage-fees"><Button variant="secondary">Open</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffPortal;