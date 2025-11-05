import { ArrowRight, FlaskConical, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { departments } from "@/data/mockData";
import { cn } from "@/lib/utils";

import deptCseImg from "@/assets/dept-cse.jpg";
import deptAiImg from "@/assets/dept-ai.jpg";
import deptEceImg from "@/assets/dept-ece.jpg";
import deptEeeImg from "@/assets/dept-eee.jpg";
import deptItImg from "@/assets/dept-it.jpg";
import deptMechImg from "@/assets/dept-mech.jpg";
import deptCivilImg from "@/assets/dept-civil.jpg";

// Department-specific color schemes
const deptColors: Record<string, { primary: string, secondary: string, gradient: string, shadow: string }> = {
  "cse": { 
    primary: "from-blue-600 to-blue-900", 
    secondary: "bg-blue-600",
    gradient: "linear-gradient(135deg, rgba(0, 123, 255, 0.15), rgba(0, 255, 255, 0.25))",
    shadow: "rgba(0, 123, 255, 0.4)"
  },
  "ai-ds": { 
    primary: "from-purple-600 to-purple-900", 
    secondary: "bg-purple-600",
    gradient: "linear-gradient(135deg, rgba(232, 14, 83, 0.15), rgba(255, 80, 120, 0.25))",
    shadow: "rgba(232, 14, 83, 0.4)"
  },
  "ece": { 
    primary: "from-orange-600 to-orange-900", 
    secondary: "bg-orange-600",
    gradient: "linear-gradient(135deg, rgba(255, 140, 0, 0.15), rgba(255, 200, 100, 0.25))",
    shadow: "rgba(255, 140, 0, 0.4)"
  },
  "eee": { 
    primary: "from-yellow-600 to-yellow-900", 
    secondary: "bg-yellow-600",
    gradient: "linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 235, 59, 0.25))",
    shadow: "rgba(255, 193, 7, 0.4)"
  },
  "it": { 
    primary: "from-green-600 to-green-900", 
    secondary: "bg-green-600",
    gradient: "linear-gradient(135deg, rgba(40, 167, 69, 0.15), rgba(0, 255, 127, 0.25))",
    shadow: "rgba(40, 167, 69, 0.4)"
  },
  "mech": { 
    primary: "from-red-600 to-red-900", 
    secondary: "bg-red-600",
    gradient: "linear-gradient(135deg, rgba(220, 53, 69, 0.15), rgba(255, 99, 71, 0.25))",
    shadow: "rgba(220, 53, 69, 0.4)"
  },
  "civil": { 
    primary: "from-teal-600 to-teal-900", 
    secondary: "bg-teal-600",
    gradient: "linear-gradient(135deg, rgba(32, 201, 151, 0.15), rgba(0, 255, 255, 0.25))",
    shadow: "rgba(32, 201, 151, 0.4)"
  },
};

/* Gradient animation keyframes */
const gradientAnimation = `
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

// Add the keyframes to the document
const styleElement = document.createElement('style');
styleElement.textContent = gradientAnimation;
document.head.appendChild(styleElement);

const deptImages: Record<string, string> = {
  "cse": deptCseImg,
  "ai-ds": deptAiImg,
  "ece": deptEceImg,
  "eee": deptEeeImg,
  "it": deptItImg,
  "mech": deptMechImg,
  "civil": deptCivilImg
};

const Departments = () => {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-16 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Departments</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Seven specialized departments offering cutting-edge engineering programs
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Card 
                key={dept.id} 
                className={cn(
                  "rounded-lg text-card-foreground shadow-sm overflow-hidden group relative transition-all duration-500 transform hover:-translate-y-2 border-2 hover:shadow-xl border-opacity-30 border-border",
                )}
                style={{
                  background: dept.id === 'cse' ? 'rgba(0, 123, 255, 0.15)' : 
                             dept.id === 'ai-ds' ? 'rgba(232, 14, 83, 0.15)' : 
                             dept.id === 'ece' ? 'rgba(255, 140, 0, 0.15)' : 
                             dept.id === 'eee' ? 'rgba(255, 193, 7, 0.15)' : 
                             dept.id === 'it' ? 'rgba(40, 167, 69, 0.15)' : 
                             dept.id === 'mech' ? 'rgba(220, 53, 69, 0.15)' : 
                             'rgba(32, 201, 151, 0.15)',
                  borderLeftColor: dept.id === 'cse' ? 'rgba(0, 123, 255, 0.3)' : 
                                  dept.id === 'ai-ds' ? 'rgba(232, 14, 83, 0.3)' : 
                                  dept.id === 'ece' ? 'rgba(255, 140, 0, 0.3)' : 
                                  dept.id === 'eee' ? 'rgba(255, 193, 7, 0.3)' : 
                                  dept.id === 'it' ? 'rgba(40, 167, 69, 0.3)' : 
                                  dept.id === 'mech' ? 'rgba(220, 53, 69, 0.3)' : 
                                  'rgba(32, 201, 151, 0.3)',
                  ...(hoveredDept === dept.id && {
                    background: deptColors[dept.id].gradient,
                    backgroundSize: '200% 200%',
                    animation: 'gradientMove 3s ease infinite',
                    boxShadow: `0 10px 25px ${deptColors[dept.id].shadow}`,
                    borderTopColor: dept.id === 'cse' ? '#007bff' : 
                                   dept.id === 'ai-ds' ? '#e80e53' : 
                                   dept.id === 'ece' ? '#ff8c00' : 
                                   dept.id === 'eee' ? '#ffc107' : 
                                   dept.id === 'it' ? '#28a745' : 
                                   dept.id === 'mech' ? '#dc3545' : '#20c997',
                    borderTopWidth: '5px'
                  })
                }}
                onMouseEnter={() => setHoveredDept(dept.id)}
                onMouseLeave={() => setHoveredDept(null)}
              >
                {/* Colored overlay that appears on hover */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10 pointer-events-none",
                  `bg-gradient-to-br ${deptColors[dept.id].primary}`
                )} />
                
                <Link to={`/departments/${dept.id}`} className="block relative">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={deptImages[dept.id]} 
                      alt={dept.name}
                      className="w-full h-full object-cover transition-all duration-700 
                        group-hover:scale-115 group-hover:rotate-2 group-hover:brightness-115 group-hover:shadow-lg"
                    />
                    {/* Colored bar that slides in from bottom on hover */}
                    <div className={cn(
                      "absolute bottom-0 left-0 w-full h-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500",
                      deptColors[dept.id].secondary
                    )} />
                  </div>
                </Link>
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-sm font-semibold transition-all duration-500",
                        hoveredDept === dept.id ? `bg-${dept.id === 'cse' ? 'blue' : dept.id === 'ai-ds' ? 'purple' : dept.id === 'ece' ? 'orange' : dept.id === 'eee' ? 'yellow' : dept.id === 'it' ? 'green' : dept.id === 'mech' ? 'red' : 'teal'}-600 text-white` : ""
                      )}
                    >
                      {dept.code}
                    </Badge>
                  </div>
                  <CardTitle className={cn(
                    "text-xl transition-colors duration-500",
                    hoveredDept === dept.id ? `text-${dept.id === 'cse' ? 'blue' : dept.id === 'ai-ds' ? 'purple' : dept.id === 'ece' ? 'orange' : dept.id === 'eee' ? 'yellow' : dept.id === 'it' ? 'green' : dept.id === 'mech' ? 'red' : 'teal'}-700` : ""
                  )}>
                    {dept.name}
                  </CardTitle>
                  <CardDescription className="text-base mt-2 group-hover:text-foreground transition-colors duration-500">
                    {dept.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <GraduationCap className={cn(
                          "h-4 w-4 transition-transform duration-500",
                          hoveredDept === dept.id ? "scale-125" : ""
                        )} />
                        <span>Students</span>
                      </div>
                      <span className="font-semibold">{dept.students}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Users className={cn(
                          "h-4 w-4 transition-transform duration-500",
                          hoveredDept === dept.id ? "scale-125" : ""
                        )} />
                        <span>Faculty</span>
                      </div>
                      <span className="font-semibold">{dept.faculty}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <FlaskConical className={cn(
                          "h-4 w-4 transition-transform duration-500",
                          hoveredDept === dept.id ? "scale-125" : ""
                        )} />
                        <span>Labs</span>
                      </div>
                      <span className="font-semibold">{dept.labs}</span>
                    </div>
                    <div className="pt-2 border-t mt-3 flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Head: <span className="font-medium text-foreground">{dept.hod}</span>
                      </p>
                      <Link to={`/departments/${dept.id}`}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={cn(
                            "transition-all duration-500 group-hover:translate-x-1",
                            hoveredDept === dept.id ? `text-${dept.id === 'cse' ? 'blue' : dept.id === 'ai-ds' ? 'purple' : dept.id === 'ece' ? 'orange' : dept.id === 'eee' ? 'yellow' : dept.id === 'it' ? 'green' : dept.id === 'mech' ? 'red' : 'teal'}-600` : "text-primary"
                          )}
                        >
                          View Details <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                        </Button>
                      </Link>
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

export default Departments;
