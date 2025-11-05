import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { collegeInfo } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Departments", path: "/departments" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-[#00366d] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <GraduationCap className="h-6 w-6 text-[#00366d]" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-white">{collegeInfo.shortName}</h1>
              <p className="text-xs text-blue-100">{collegeInfo.location}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    isActive(link.path) 
                      ? "bg-white text-[#00366d] font-medium shadow-md hover:bg-gray-100" 
                      : "text-white hover:bg-[#004a94] font-medium hover:text-white",
                    "transition-all duration-300"
                  )}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#007fff] hover:bg-[#004a94] font-medium"
                >
                  Login
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[14rem]">
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/staff-login" className="flex items-center gap-2 w-full">
                    <Users className="h-4 w-4" />
                    Staff Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/login" className="flex items-center gap-2 w-full">
                    <GraduationCap className="h-4 w-4" />
                    Student Login
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/register">
              <Button 
                size="sm" 
                className="bg-white hover:bg-gray-100 text-[#00366d] font-medium shadow-md"
              >
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-[#004a94]"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gradient-to-br from-[#00366d] to-[#002347]">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path}>
                    <Button
                      variant={isActive(link.path) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive(link.path) 
                          ? "bg-white text-[#00366d] font-medium" 
                          : "text-white hover:bg-[#004a94] font-medium"
                      )}
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
                <div className="pt-4 space-y-2 border-t border-blue-800">
                  <Link to="/staff-login" className="block">
                    <Button 
                      variant="outline"
                      className="w-full border-white/20 hover:bg-[#004a94] text-[#7fbaff]"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Staff Login
                    </Button>
                  </Link>
                  <Link to="/login" className="block">
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 hover:bg-[#004a94] text-[#007fff]"
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Student Login
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button 
                      className="w-full bg-white hover:bg-gray-100 text-[#00366d] font-medium"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
