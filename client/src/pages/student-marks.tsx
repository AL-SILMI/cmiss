import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import GradingSystem, { calculateGrade, calculateTotalMarks, getGradeColor, getGradePoints } from "../components/GradingSystem";

interface Mark {
  _id: string;
  subject: string;
  code: string;
  internal: number;
  external: number;
  total: number;
  maxTotal: number;
  grade: string;
  semester: number;
  iat1?: number;
  iat2?: number;
  attendancePercentage?: number;
  isWithdrawn?: boolean;
}

const StudentMarks: React.FC = () => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [filteredMarks, setFilteredMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/students/marks');
        setMarks(response.data);
        setFilteredMarks(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load marks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMarks(marks);
    } else {
      const filtered = marks.filter(mark => 
        mark.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mark.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mark.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMarks(filtered);
    }
  }, [searchTerm, marks]);

  // Calculate overall performance using 40% internal (of 200) and 60% external (of 100)
  const totalMarks = marks.reduce((sum, mark) => {
    if (typeof mark.iat1 === 'number' && typeof mark.iat2 === 'number' && typeof mark.external === 'number') {
      return sum + calculateTotalMarks(mark.iat1, mark.iat2, mark.external);
    }
    return sum + (typeof mark.total === 'number' ? mark.total : 0);
  }, 0);
  const maxMarks = marks.length * 100; // each subject totals to 100
  const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
  
  // Calculate GPA using new grading system
  const totalGradePoints = marks.reduce((sum, mark) => {
    const recalculatedGrade = mark.iat1 && mark.iat2 && mark.external 
      ? calculateGrade(
          calculateTotalMarks(mark.iat1, mark.iat2, mark.external),
          (mark.attendancePercentage || 100) < 75,
          mark.isWithdrawn || false
        )
      : mark.grade;
    return sum + getGradePoints(recalculatedGrade);
  }, 0);
  const gpa = marks.length > 0 ? (totalGradePoints / marks.length).toFixed(2) : '0.00';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Student Academic Portal</h1>
      
      <Tabs defaultValue="marks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="marks">My Marks</TabsTrigger>
          <TabsTrigger value="grading">Grading System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="marks" className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalMarks} / {maxMarks}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{percentage.toFixed(2)}%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{gpa} / 10.0</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{marks.length}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Search by subject, code or grade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
            </CardContent>
          </Card>
          
          {/* Marks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Marks Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>IAT 1 (100)</TableHead>
                    <TableHead>IAT 2 (100)</TableHead>
                    <TableHead>External (100)</TableHead>
                    <TableHead>Total (100)</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarks.length > 0 ? (
                    filteredMarks.map((mark) => {
                      const recalculatedTotal = mark.iat1 && mark.iat2 && mark.external 
                        ? calculateTotalMarks(mark.iat1, mark.iat2, mark.external)
                        : mark.total;
                      const recalculatedGrade = mark.iat1 && mark.iat2 && mark.external 
                        ? calculateGrade(
                            recalculatedTotal,
                            (mark.attendancePercentage || 100) < 75,
                            mark.isWithdrawn || false
                          )
                        : mark.grade;
                      const gradePoints = getGradePoints(recalculatedGrade);
                      
                      return (
                        <TableRow key={mark._id}>
                          <TableCell className="font-medium">{mark.subject}</TableCell>
                          <TableCell>{mark.code}</TableCell>
                          <TableCell>{mark.iat1 || '-'}</TableCell>
                          <TableCell>{mark.iat2 || '-'}</TableCell>
                          <TableCell>{mark.external || '-'}</TableCell>
                          <TableCell className="font-bold">{recalculatedTotal}</TableCell>
                          <TableCell>
                            <Badge className={`${getGradeColor(recalculatedGrade)} text-white font-bold`}>
                              {recalculatedGrade}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold">{gradePoints}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">No marks found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grading">
          <GradingSystem showCalculator={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentMarks;