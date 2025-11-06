import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collegeInfo } from "@/data/mockData";
import { apiUrl } from "@/lib/api";

// Use centralized API helper

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [semester, setSemester] = useState("1");
  const [batch, setBatch] = useState("2023");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Submitting registration with data:", {
        name: fullName,
        email,
        department,
        semester,
        batch
      });
      
      const response = await fetch(apiUrl('/auth/register'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          department,
          semester: parseInt(semester, 10),
          batch
        })
      });
      
      console.log("Registration response status:", response.status);
      
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let data: any = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log("Parsed response data:", data);
        } catch (e) {
          console.error("Failed to parse response as JSON:", e);
        }
      }
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || "Registration failed";
        throw new Error(errorMessage);
      }
      
      // Success case
      toast({
        title: "Success",
        description: "Account created successfully! Please login.",
      });
      
      // Navigate to login after successful registration
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      toast({
        title: "Registration Error",
        description: (err as Error).message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-secondary rounded-full">
              <GraduationCap className="h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Join {collegeInfo.shortName}</CardTitle>
          <CardDescription>
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@msec.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Computer Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  max="8"
                  placeholder="1"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch Year</Label>
                <Input
                  id="batch"
                  placeholder="2023"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" variant="default">
              Create Account
            </Button>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
              <Link to="/" className="text-sm text-primary hover:underline block">
                Back to Home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
