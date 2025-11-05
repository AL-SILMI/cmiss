import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap, LogOut, User, FileText, DollarSign, BarChart3, CheckCircle2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { calculateTotalMarks, calculateGrade, getGradeColor } from "../components/GradingSystem";

const API_URL = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:5000/api");

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Try to get student data from localStorage first
        const storedStudent = localStorage.getItem("student");
        const storedToken = localStorage.getItem("token");
        
        if (!storedStudent) {
          setError("You are not logged in. Please log in to view your portal.");
          setLoading(false);
          return;
        }
        
        // Use the stored student data
        const parsedStudent = JSON.parse(storedStudent);
        setStudent(parsedStudent);
        // Default semester filter to current student semester
        setSelectedSemester(String(parsedStudent.semester));

        if (!storedToken) {
          setError("Missing auth token. Please login again.");
          setLoading(false);
          return;
        }
        setToken(storedToken);

        // Fetch marks and fees from API
        const headers = { Authorization: `Bearer ${storedToken}` };
        const [marksRes, feesRes] = await Promise.all([
          axios.get(`${API_URL}/students/marks?semester=${String(parsedStudent.semester)}` , { headers }).catch(async (err) => {
            console.error("Marks fetch error", err);
            // Fallback to empty list if not found
            return { data: [] } as any;
          }),
          axios.get(`${API_URL}/students/fees`, { headers }).catch(async (err) => {
            console.error("Fees fetch error", err);
            return { data: [] } as any;
          }),
        ]);

        setMarks(marksRes.data || []);
        setFees(feesRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load student data. Please try again later.");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Refetch marks when semester filter changes
  useEffect(() => {
    const refetchMarks = async () => {
      try {
        if (!token || !selectedSemester) return;
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_URL}/students/marks?semester=${selectedSemester}`, { headers });
        setMarks(res.data || []);
      } catch (err) {
        console.error("Marks refetch error", err);
      }
    };
    refetchMarks();
  }, [selectedSemester, token]);

  // Recalculate totals based on new scheme: 40% internal (of 200) and 60% external (of 100)
  const totalMarks = marks.reduce((sum, mark: any) => {
    if (typeof mark.iat1 === 'number' && typeof mark.iat2 === 'number' && typeof mark.external === 'number') {
      return sum + calculateTotalMarks(mark.iat1, mark.iat2, mark.external);
    }
    const internal40 = typeof mark.internal === 'number' ? (mark.internal / 50) * 40 : 0;
    const external60 = typeof mark.external === 'number' ? (mark.external / 100) * 60 : 0;
    return sum + Math.round(internal40 + external60);
  }, 0);
  const maxMarks = marks.length * 100;
  const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : "0.00";
  
  // Calculate CGPA based on marks (assuming a 10-point scale)
  const cgpa = maxMarks > 0 ? (totalMarks / maxMarks * 10).toFixed(2) : "0.00";
  // Update student object with calculated CGPA
  if (student) {
    student.cgpa = cgpa;
  }

  const totalFees = fees.reduce((sum, fee) => sum + (fee.totalAmount || 0), 0);
  const totalPaid = fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
  const totalBalance = fees.reduce((sum, fee) => sum + (fee.balance || 0), 0);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <Card className="w-full max-w-md p-6 text-center">
          <CardHeader>
            <CardTitle>Loading Student Data</CardTitle>
            <CardDescription>Please wait while we fetch your information...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <Card className="w-full max-w-md p-6 text-center">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <Card className="w-full max-w-md p-6 text-center">
          <CardHeader>
            <CardTitle>No Student Data</CardTitle>
            <CardDescription>Please log in to view your student portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Student Portal</h1>
                <p className="text-sm text-muted-foreground">{student.department}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                try {
                  localStorage.removeItem("token");
                  localStorage.removeItem("student");
                } catch {}
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-gradient-hero text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24 border-4 border-primary-foreground/20">
                  <AvatarFallback className="text-2xl font-bold bg-primary-foreground/10">
                    {student.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2">{student.name}</h2>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                      {student.studentId}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                      {student.department}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                      Semester {student.semester}
                    </Badge>
                  </div>
                  <p className="mt-3 text-primary-foreground/90">{student.email}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-primary-foreground/80 mb-1">CGPA</p>
                  <p className="text-4xl font-bold">{student.cgpa}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="marks" className="space-x-2">
              <FileText className="h-4 w-4" />
              <span>Marks</span>
            </TabsTrigger>
            <TabsTrigger value="fees" className="space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Fees</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Academic Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{percentage}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Current Semester</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Fees Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">₹{totalBalance.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Pending Balance</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Grades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No marks found for the selected semester.</p>
                    ) : (
                      marks.slice(0, 3).map((mark: any) => {
                        const total100 = typeof mark.iat1 === 'number' && typeof mark.iat2 === 'number' && typeof mark.external === 'number'
                          ? calculateTotalMarks(mark.iat1, mark.iat2, mark.external)
                          : Math.round(((mark.internal || 0) / 50) * 40 + ((mark.external || 0) / 100) * 60);
                        const displayGrade = calculateGrade(total100);
                        return (
                          <div key={mark.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{mark.subject}</p>
                              <p className="text-sm text-muted-foreground">{mark.code}</p>
                            </div>
                            <Badge variant="secondary" className={`${getGradeColor(displayGrade)} text-white`}>
                              {displayGrade}
                            </Badge>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Semester {selectedSemester || student.semester} Results</CardTitle>
                    <CardDescription>View your exam scores and internal assessments</CardDescription>
                  </div>
                  <div className="w-40">
                    <Select value={selectedSemester ?? undefined} onValueChange={(v) => setSelectedSemester(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Semester ${student.semester}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 8 }).map((_, i) => {
                          const sem = String(i + 1);
                          return (
                            <SelectItem key={sem} value={sem}>
                              Semester {sem}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">Internal (40)</TableHead>
                        <TableHead className="text-center">External (60)</TableHead>
                        <TableHead className="text-center">Total (100)</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No marks found for Semester {selectedSemester || student.semester}.
                          </TableCell>
                        </TableRow>
                      ) : (
                        marks.map((mark: any) => {
                          const internal40 = typeof mark.iat1 === 'number' && typeof mark.iat2 === 'number'
                            ? ((mark.iat1 + mark.iat2) / 200) * 40
                            : typeof mark.internal === 'number' ? (mark.internal / 50) * 40 : 0;
                          const external60 = typeof mark.external === 'number' ? (mark.external / 100) * 60 : 0;
                          const total100 = Math.round(internal40 + external60);
                          const displayGrade = calculateGrade(total100);
                          return (
                          <TableRow key={mark.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{mark.subject}</p>
                                <p className="text-sm text-muted-foreground">{mark.code}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{Math.round(internal40)}</TableCell>
                            <TableCell className="text-center">{Math.round(external60)}</TableCell>
                            <TableCell className="text-center font-semibold">{total100}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className={`${getGradeColor(displayGrade)} text-white`}>
                                {displayGrade}
                              </Badge>
                            </TableCell>
                          </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Marks</p>
                      <p className="text-2xl font-bold">{totalMarks}/{maxMarks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Percentage</p>
                      <p className="text-2xl font-bold">{percentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CGPA</p>
                      <p className="text-2xl font-bold">{student.cgpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Grade</p>
                      <p className="text-2xl font-bold text-success">A</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalFees?.toLocaleString() || '0'}</div>
                </CardContent>
              </Card>
              <Card className="border-success">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Amount Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">₹{totalPaid?.toLocaleString() || '0'}</div>
                </CardContent>
              </Card>
              <Card className="border-accent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Balance Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">₹{totalBalance?.toLocaleString() || '0'}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track your semester fee payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Semester</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        <TableHead className="text-right">Paid Amount</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fees.map((fee) => (
                        <TableRow key={fee.id || fee._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{fee.semesterLabel || (typeof fee.semester === 'number' ? `Semester ${fee.semester}` : fee.semester)}</p>
                              <p className="text-sm text-muted-foreground">{fee.academicYear}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">₹{fee.totalAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-success">₹{fee.paidAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {fee.balance > 0 ? (
                              <span className="text-accent">₹{fee.balance.toLocaleString()}</span>
                            ) : (
                              <span className="text-success">₹0</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {fee.status === "Paid" ? (
                              <Badge variant="secondary" className="bg-success/10 text-success">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-accent/10 text-accent">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalBalance > 0 && (
                  <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-accent">Payment Reminder</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(() => {
                            const pendingFees = fees.filter((f: any) => (f.balance || 0) > 0 && f.dueDate);
                            const dueDates = pendingFees
                              .map((f: any) => new Date(f.dueDate))
                              .filter((d: Date) => !isNaN(d.getTime()) && d > new Date())
                              .sort((a: Date, b: Date) => a.getTime() - b.getTime());
                            
                            const nextDue = dueDates.length ? dueDates[0] : null;
                            const dueText = nextDue ? ` before ${nextDue.toLocaleDateString()}` : '';
                            return `You have an outstanding balance of ₹${totalBalance.toLocaleString()}. Please make the payment${dueText}.`;
                          })()}
                        </p>
                        <Button size="sm" className="mt-3">
                          Make Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your student profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                    <p className="text-lg font-semibold mt-1">{student.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg font-semibold mt-1">{student.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg font-semibold mt-1">{student.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-lg font-semibold mt-1">{student.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Semester</label>
                    <p className="text-lg font-semibold mt-1">Semester {student.semester}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Batch</label>
                    <p className="text-lg font-semibold mt-1">{student.batch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CGPA</label>
                    <p className="text-lg font-semibold mt-1">{student.cgpa}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentPortal;
