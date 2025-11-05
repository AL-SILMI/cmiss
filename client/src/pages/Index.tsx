import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Users, Award, Microscope, Trophy, Lightbulb, Library, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { collegeInfo, stats, departments, facilities, testimonials } from "@/data/mockData";
import heroCampusImg from "@/assets/hero-campus.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={heroCampusImg} 
            alt="MSEC Campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4 shadow-sm">
              Established {collegeInfo.established}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-primary drop-shadow-sm">
              {collegeInfo.name}
            </h1>
            <p className="text-2xl text-muted-foreground mb-2">
              {collegeInfo.tagline}
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Affiliated to {collegeInfo.affiliation} • {collegeInfo.location}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow">
                  Apply Now
                </Button>
              </Link>
              <Link to="/departments">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary/10 shadow-sm">
                  Explore Departments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 backdrop-blur-sm bg-white/5 rounded-lg shadow-md">
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-primary-foreground/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-primary">About MSEC</h2>
            <p className="text-lg text-muted-foreground">
              Madras School of Engineering & Computing has been at the forefront of technical education in Chennai 
              since 1995. We offer world-class engineering programs across seven specialized departments, preparing 
              students for successful careers in technology and innovation.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center hover:shadow-lg transition-shadow border border-border/50">
              <CardHeader>
                <div className="mx-auto p-3 bg-gradient-primary rounded-full w-fit mb-4 shadow-md">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-primary">Excellence in Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Consistently ranked among the top engineering colleges in Tamil Nadu with NAAC A+ accreditation.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow border border-border/50">
              <CardHeader>
                <div className="mx-auto p-3 bg-gradient-secondary rounded-full w-fit mb-4 shadow-md">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-secondary">Industry Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Strong partnerships with leading tech companies ensuring excellent placement opportunities.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow border border-border/50">
              <CardHeader>
                <div className="mx-auto p-3 bg-gradient-to-br from-accent to-accent/80 rounded-full w-fit mb-4 shadow-md">
                  <Microscope className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-accent-foreground">Research Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cutting-edge research facilities and collaborations with international universities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Departments Preview */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Departments</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seven specialized departments offering comprehensive engineering programs
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {departments.slice(0, 4).map((dept) => (
              <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">{dept.code}</Badge>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Students:</span>
                      <span className="font-semibold">{dept.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Faculty:</span>
                      <span className="font-semibold">{dept.faculty}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/departments">
              <Button size="lg" variant="outline">
                View All Departments
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">World-Class Facilities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              State-of-the-art infrastructure supporting academic and extracurricular excellence
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {facilities.map((facility) => {
              const icons: Record<string, any> = {
                library: Library,
                microscope: Microscope,
                trophy: Trophy,
                lightbulb: Lightbulb,
              };
              const Icon = icons[facility.icon];
              return (
                <Card key={facility.name} className="text-center">
                  <CardHeader>
                    <div className="mx-auto p-3 bg-muted rounded-lg w-fit mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{facility.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Student Testimonials</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our successful alumni about their MSEC experience
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.program}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <GraduationCap className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of students building their future at MSEC
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Student Login
              </Button>
            </Link>
            <Link to="/staff-login">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">{collegeInfo.shortName}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {collegeInfo.name}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/departments" className="hover:text-foreground">Departments</Link></li>
                <li><Link to="/courses" className="hover:text-foreground">Courses</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{collegeInfo.location}</li>
                <li>info@msec.edu.in</li>
                <li>+91 44 1234 5678</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <p className="text-sm text-muted-foreground">
                Connect with us on social media for updates and news.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 {collegeInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
