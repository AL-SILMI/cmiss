import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Award, Users, BookOpen, Building, Globe, Star, Trophy } from "lucide-react";
import { collegeInfo } from "@/data/mockData";

const About = () => {
  const milestones = [
    { year: "1996", event: "Establishment of the college" },
    { year: "1998", event: "Moved to the current 230-acre campus" },
    { year: "2001", event: "Started School of Advanced Software Engineering" },
    { year: "2005", event: "Received first NAAC accreditation" },
    { year: "2010", event: "Established Research Centers of Excellence" },
    { year: "2015", event: "Ranked among top 50 engineering colleges in India" },
    { year: "2020", event: "Expanded international collaborations" },
    { year: "2023", event: "Launched new cutting-edge programs" }
  ];

  const achievements = [
    "Accredited with Grade A++ by NAAC",
    "Ranked in NIRF top 50 engineering colleges",
    "600+ scholarships awarded annually",
    "91% placement record with 800+ recruiters",
    "State-of-the-art research facilities",
    "International academic collaborations",
    "Platinum category institute by AICTE",
    "Tier-1 accreditation by NBA"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 drop-shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">{collegeInfo.shortName}</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Excellence in education, innovation in research, and commitment to societal development
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Our History</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {collegeInfo.name} was established in {collegeInfo.established} with a vision to provide world-class technical education. 
                Founded by our visionary chairman, the college started in a temporary location and moved to our current 
                sprawling 230-acre campus in 1998.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Over the years, we have grown from a small engineering college to one of the premier technical 
                institutions in the region, known for academic excellence, innovative research, and producing 
                industry-ready graduates who contribute significantly to the technological advancement of our nation.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, {collegeInfo.shortName} stands as a testament to our commitment to quality education, 
                cutting-edge research, and holistic development of students.
              </p>
            </div>
            <div className="space-y-4 bg-muted/30 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-secondary">Key Milestones</h3>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-bold shadow-sm">
                      {milestone.year}
                    </div>
                    <div className="flex-1 pt-1">{milestone.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vision & Mission</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary/20">
              <CardHeader className="text-center pb-2">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Star className="h-6 w-6 text-primary" />
                  <span>Our Vision</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <p className="text-lg">
                  To be a leading institution of higher learning, offering quality education of global standards 
                  and to create engineering professionals with technical expertise, innovative skills, and ethical values.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardHeader className="text-center pb-2">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <p className="text-lg">
                  To develop competent and socially responsible engineers by providing excellent infrastructure, 
                  outstanding faculty, and fostering an environment conducive to learning and research for the benefit of society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">Our Achievements</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {collegeInfo.shortName} has consistently maintained high standards of excellence in academics, 
              research, and infrastructure, earning numerous accolades and recognitions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border border-border/50">
                <CardContent className="pt-6">
                  <Award className="h-10 w-10 text-secondary mx-auto mb-4" />
                  <p className="font-medium">{achievement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary">Campus Life</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              At {collegeInfo.shortName}, we believe in the holistic development of students through a vibrant campus life 
              that extends beyond academics.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-secondary" />
                  <span>Modern Infrastructure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Our sprawling campus features state-of-the-art classrooms, well-equipped laboratories, 
                  comfortable hostels, sports facilities, and recreational areas designed to provide an 
                  optimal learning and living environment.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  <span>Academic Excellence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Our curriculum is regularly updated to reflect industry needs, and our teaching methodology 
                  combines theoretical knowledge with practical applications, ensuring students are well-prepared 
                  for their professional careers.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-secondary" />
                  <span>Student Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Students participate in various technical, cultural, and sports events throughout the year. 
                  Our active student clubs and associations provide platforms for students to showcase their 
                  talents and develop leadership skills.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Global Connections */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Global Connections</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We have established collaborations with leading universities and industries worldwide to provide 
              our students with global exposure and opportunities.
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-6">
                <Globe className="h-16 w-16 text-primary" />
              </div>
              <p className="text-center text-lg max-w-3xl mx-auto">
                Our international partnerships facilitate student exchange programs, joint research projects, 
                faculty development initiatives, and global internship opportunities. These collaborations 
                enhance the academic experience and broaden the perspectives of our students and faculty.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;