import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/login";
import Register from "./pages/register";
import Departments from "./pages/departments";
import DepartmentDetail from "./pages/department-detail";
import Courses from "./pages/courses";
import CourseDetails from "./pages/course-details";
import StudentPortal from "./pages/student-portal";
import StaffLogin from "./pages/staff-login";
import StaffPortal from "./pages/staff-portal";
import ManageStudents from "./pages/manage-students";
import DepartmentOverview from "./pages/department-overview";
import StudentMarks from "./pages/student-marks";
import FeeDetails from "./pages/fee-details";
import ManageFees from "./pages/manage-fees";
import About from "./pages/about";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route guards
const RequireStudentAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const student = localStorage.getItem("student");
  if (!token || !student) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

const RequireStaffAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const token = localStorage.getItem("staffToken");
  const staff = localStorage.getItem("staff");
  if (!token || !staff) {
    return <Navigate to="/staff-login" replace state={{ from: location }} />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/:id" element={<DepartmentDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/student-portal" element={<RequireStudentAuth><StudentPortal /></RequireStudentAuth>} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/staff-portal" element={<RequireStaffAuth><StaffPortal /></RequireStaffAuth>} />
          <Route path="/staff/manage-students" element={<RequireStaffAuth><ManageStudents /></RequireStaffAuth>} />
          <Route path="/staff/department-overview" element={<RequireStaffAuth><DepartmentOverview /></RequireStaffAuth>} />
          <Route path="/staff/manage-fees" element={<RequireStaffAuth><ManageFees /></RequireStaffAuth>} />
          <Route path="/student-marks" element={<StudentMarks />} />
          <Route path="/fee-details" element={<FeeDetails />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
