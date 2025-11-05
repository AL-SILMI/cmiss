import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { departments, departmentCourses, departmentDetails } from "@/data/mockData";
import { BookOpen, Award, FlaskConical, Users, GraduationCap, School } from "lucide-react";
import deptCseImg from "@/assets/dept-cse.jpg";
import deptAiImg from "@/assets/dept-ai.jpg";
import deptEceImg from "@/assets/dept-ece.jpg";
import deptEeeImg from "@/assets/dept-eee.jpg";
import deptItImg from "@/assets/dept-it.jpg";
import deptMechImg from "@/assets/dept-mech.jpg";
import deptCivilImg from "@/assets/dept-civil.jpg";

const deptImages: Record<string, string> = {
  "cse": deptCseImg,
  "ai-ds": deptAiImg,
  "ece": deptEceImg,
  "eee": deptEeeImg,
  "it": deptItImg,
  "mech": deptMechImg,
  "civil": deptCivilImg,
};

const DepartmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the department by ID
  const department = departments.find(dept => dept.id === id);
  
  // Get department courses and details
  const courses = id ? departmentCourses[id as keyof typeof departmentCourses] || [] : [];
  const details = id ? departmentDetails[id as keyof typeof departmentDetails] || null : null;
  
  if (!department) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Department Not Found</h1>
          <p>The department you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-64 md:h-80">
        <div className="absolute inset-0">
          <img 
            src={deptImages[department.id]} 
            alt={department.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-background/70" />
        </div>
        <div className="relative container mx-auto h-full flex items-center px-4">
          <div>
            <Badge variant="secondary" className="mb-2 shadow-sm">
              {department.code}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary drop-shadow-sm">
              {department.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {department.description}
            </p>
          </div>
        </div>
      </section>
      
      {/* Department Info */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">About the Department</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {details && (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center text-secondary">
                        <School className="h-5 w-5 mr-2" /> Vision
                      </h3>
                      <p className="text-muted-foreground">{details.vision}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center text-secondary">
                        <Award className="h-5 w-5 mr-2" /> Mission
                      </h3>
                      <p className="text-muted-foreground">{details.mission}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center text-secondary">
                        <FlaskConical className="h-5 w-5 mr-2" /> Facilities
                      </h3>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {details.facilities.map((facility, index) => (
                          <li key={index}>{facility}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center text-secondary">
                        <Award className="h-5 w-5 mr-2" /> Achievements
                      </h3>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {details.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Department Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Users className="h-5 w-5 text-secondary" />
                      <span>Head of Department</span>
                    </div>
                    <span className="font-semibold">{department.hod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <GraduationCap className="h-5 w-5 text-secondary" />
                      <span>Students</span>
                    </div>
                    <span className="font-semibold">{department.students}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Users className="h-5 w-5 text-secondary" />
                      <span>Faculty</span>
                    </div>
                    <span className="font-semibold">{department.faculty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <FlaskConical className="h-5 w-5 text-secondary" />
                      <span>Labs</span>
                    </div>
                    <span className="font-semibold">{department.labs}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Courses Section */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Course Structure</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            The curriculum is designed as per Anna University guidelines to provide comprehensive knowledge and practical skills in {department.name}.
          </p>
          
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-8">
              {courses.map((semester) => (
                <TabsTrigger 
                  key={semester.semester} 
                  value={semester.semester.toString()}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Sem {semester.semester}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {courses.map((semester) => (
              <TabsContent key={semester.semester} value={semester.semester.toString()}>
                <Card className="shadow-md border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-secondary" />
                      Semester {semester.semester} Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {semester.courses.map((course, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-secondary text-secondary-foreground w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 shadow-sm">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground">{course}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default DepartmentDetail;