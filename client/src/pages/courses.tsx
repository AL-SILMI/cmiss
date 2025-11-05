import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { courses, collegeInfo } from "@/data/mockData";

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-16 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Course Catalog</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Comprehensive curriculum designed to meet industry standards at {collegeInfo.shortName}
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="secondary" className="font-semibold">
                          {course.code}
                        </Badge>
                        <Badge variant="outline">
                          {course.department}
                        </Badge>
                        <Badge variant="outline">
                          Semester {course.semester}
                        </Badge>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {course.credits} Credits
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl mb-2">{course.name}</CardTitle>
                      <CardDescription className="text-base">
                        {course.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">{course.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Instructor</p>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Department</p>
                        <p className="text-sm text-muted-foreground">{course.department}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
