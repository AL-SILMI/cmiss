import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:5000") + "/api";

const ManageFees = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [studentFees, setStudentFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feeForm, setFeeForm] = useState({
    semester: "",
    academicYear: "",
    totalAmount: "",
    paidAmount: "",
    dueDate: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentFees(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("staffToken");
      if (!token) {
        toast({ title: "Not authenticated", description: "Please login as staff." });
        return;
      }

      const response = await axios.get(`${API_BASE}/staff/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch students. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const fetchStudentFees = async (studentId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("staffToken");
      if (!token) {
        toast({ title: "Not authenticated", description: "Please login as staff." });
        return;
      }

      const response = await axios.get(`${API_BASE}/staff/students/${studentId}/fees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentFees(response.data);
    } catch (error: any) {
      console.error("Error fetching student fees:", error);
      if (error.response?.status === 404) {
        setStudentFees([]);
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to fetch student fees. Please try again.", 
          variant: "destructive" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFeeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFeeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSemesterChange = (value: string) => {
    setFeeForm((prev) => ({ ...prev, semester: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast({ title: "Error", description: "Please select a student first." });
      return;
    }

    if (!feeForm.semester || !feeForm.academicYear || !feeForm.totalAmount) {
      toast({ title: "Missing fields", description: "Semester, academic year, and total amount are required." });
      return;
    }

    try {
      const token = localStorage.getItem("staffToken");
      if (!token) {
        toast({ title: "Not authenticated", description: "Please login as staff." });
        return;
      }

      const payload = {
        semester: parseInt(feeForm.semester),
        academicYear: feeForm.academicYear,
        totalAmount: parseFloat(feeForm.totalAmount),
        paidAmount: feeForm.paidAmount ? parseFloat(feeForm.paidAmount) : 0,
        dueDate: feeForm.dueDate || undefined
      };

      await axios.post(`${API_BASE}/staff/students/${selectedStudent}/fees`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({ title: "Success", description: "Fee record has been saved successfully." });
      fetchStudentFees(selectedStudent);
      
      // Reset form
      setFeeForm({
        semester: "",
        academicYear: "",
        totalAmount: "",
        paidAmount: "",
        dueDate: ""
      });
    } catch (error) {
      console.error("Error saving fee record:", error);
      toast({ 
        title: "Error", 
        description: "Failed to save fee record. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Student Fees</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Select Student</CardTitle>
            <CardDescription>Choose a student to manage their fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="student">Student</Label>
                <Select onValueChange={setSelectedStudent} value={selectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student._id} value={student._id}>
                        {student.name} ({student.studentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Add/Update Fee Record</CardTitle>
            <CardDescription>Create or update fee records for the selected student</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="semester">Semester</Label>
                  <Select onValueChange={handleSemesterChange} value={feeForm.semester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    name="academicYear"
                    placeholder="e.g., 2023-2024"
                    value={feeForm.academicYear}
                    onChange={handleFeeFormChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    placeholder="e.g., 25000"
                    value={feeForm.totalAmount}
                    onChange={handleFeeFormChange}
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="paidAmount">Paid Amount</Label>
                  <Input
                    id="paidAmount"
                    name="paidAmount"
                    type="number"
                    placeholder="e.g., 15000"
                    value={feeForm.paidAmount}
                    onChange={handleFeeFormChange}
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={feeForm.dueDate}
                  onChange={handleFeeFormChange}
                />
              </div>

              <Button type="submit" disabled={!selectedStudent}>
                Save Fee Record
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {selectedStudent && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Fee History</CardTitle>
            <CardDescription>
              {loading ? "Loading..." : studentFees.length === 0 ? "No fee records found" : "Fee records for the selected student"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentFees.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentFees.map((fee) => (
                    <TableRow key={fee._id}>
                      <TableCell>Semester {fee.semester}</TableCell>
                      <TableCell>{fee.academicYear}</TableCell>
                      <TableCell>₹{fee.totalAmount}</TableCell>
                      <TableCell>₹{fee.paidAmount}</TableCell>
                      <TableCell>₹{fee.balance}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          fee.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          fee.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {fee.status}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(fee.dueDate)}</TableCell>
                      <TableCell>{formatDate(fee.paidDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                {loading ? "Loading..." : "No fee records found for this student"}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageFees;