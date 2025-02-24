import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BriefcaseBusinessIcon, CodeIcon, Award, User, Github, Linkedin, Mail, Code, Smile, Database, Laptop, ChartNetwork, DatabaseIcon, SendIcon, Instagram, SmartphoneNfc, Smartphone, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingScreen from '@/components/LoadingScreen';
import { getAbout, getSkills, getCertifications, getExperiences } from '../api/Portf_api';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const { data: aboutData } = useQuery({
    queryKey: ['about'],
    queryFn: () => getAbout().then(res => res.data?.[0]),
  });

  const { data: skillsData } = useQuery({
    queryKey: ['skills'],
    queryFn: () => getSkills().then(res => res.data),
  });

  const { data: certificationsData } = useQuery({
    queryKey: ['certifications'],
    queryFn: () => getCertifications().then(res => res.data),
  });

  const { data: experiencesData } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => getExperiences().then(res => res.data),
  });

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    setIsFirstLoad(!hasLoaded);
    sessionStorage.setItem('hasLoaded', 'true');

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      heroRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(20px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isFirstLoad) {
    return <LoadingScreen onLoadingComplete={() => setIsFirstLoad(false)} />;
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Laptop, Database, ChartNetwork, Smartphone, DatabaseIcon, SmartphoneNfc, CodeIcon
    };
    return iconMap[iconName] || CodeIcon;
  };

  return (
    <div className="min-h-screen">
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),rgba(0,0,0,0))]" />
        
        <div className="container mx-auto px-4 pt-20">
          <div ref={heroRef} className="transition-transform duration-300 ease-out">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <span className="inline-block px-3 py-1 text-sm rounded-full glass animate-fade-in">
                <Code className="inline-block mr-2" size={16} />
                Welcome to my portfolio
              </span>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-slide-up">
                Hi, I'm Nahom Merga<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                  &lt;ናሆም መርጋ 👨🏿‍💻 &gt;
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                {"Known as Nahomer, I'm an Ethiopian developer passionate about crafting innovative web solutions that bridge technology with cultural creativity"}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
                <Link
                  to="/projects"
                  className="px-6 py-3 rounded-lg glass hover:bg-primary/20 transition-all duration-300 flex items-center gap-2"
                >
                  View Projects <ArrowRight size={20} />
                </Link>
                
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-lg border border-primary/50 hover:bg-primary/10 transition-all duration-300"
                >
                  Get in Touch
                </Link>
              </div>
              
              <div className="flex justify-center gap-6 pt-8 animate-fade-in">
                <a href="https://github.com/nahuMerga/" className="hover:text-primary transition-colors duration-300">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/nahom-merga-8069a4294/" className="hover:text-primary transition-colors duration-300">
                  <Linkedin size={24} />
                </a>
                <a href="nahumyne@gmail.com" className="hover:text-primary transition-colors duration-300">
                  <Mail size={24} />
                </a>
                <a href="https://t.me/nahum_yne" className="hover:text-primary transition-colors duration-300">
  < SendIcon size={24} />
</a>

<a href="https://www.instagram.com/" className="hover:text-primary transition-colors duration-300">
  < Instagram size={24} />
</a>
                <Link to="/memes" className="hover:text-primary transition-colors duration-300">
                  <Smile size={24} className="animate-bounce" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen py-20 px-4 relative">
        <div className="container mx-auto">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4">
              <TabsTrigger value="about">
                <User size={24} className="mr-2" /> About Me
              </TabsTrigger>
              <TabsTrigger value="skills">
                <CodeIcon size={24} className="mr-2" /> Skills
              </TabsTrigger>
              <TabsTrigger value="certifications">
                <Award size={24} className="mr-2" /> Certifications
              </TabsTrigger>
              <TabsTrigger value="experience">
                <BriefcaseBusinessIcon size={24} className="mr-2" /> Experience
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-48 h-48 rounded-full overflow-hidden glass animate-fade-in">
                  <img
                    src={aboutData?.image || "/images/nahom.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-3xl font-bold">About Nahom Merga</h2>
                  <p className="text-muted-foreground">{aboutData?.about_text}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              {(skillsData || []).map((skill, index) => {
                const Icon = getIconComponent(skill.icon);
                return (
                  <div key={index} className="p-4 border rounded-lg shadow-lg flex items-center gap-4">
                    <Icon className="text-primary" size={40} />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{skill.name}</h3>
                      <Progress value={skill.progress || 0} className="h-2 mt-2" />
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="certifications" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(certificationsData || []).map((cert, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-full aspect-video rounded-lg bg-muted mb-4">
                      <img
                        src={cert.cert_image}
                        alt={cert.cert_title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <CardTitle>{cert.cert_title}</CardTitle>
                    <CardDescription>Issued: {cert.cert_date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{cert.cert_description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="experience" className="space-y-8">
              <br></br>
              <div className="relative space-y-8">
                {(experiencesData || []).map((exp, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-none">
                      <div className="w-16 h-16 rounded-lg glass flex items-center justify-center">
                        <Briefcase className="text-primary" size={24} />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold">{exp.experience_title}</h3>
                      <p className="text-sm text-muted-foreground">{exp.experience_date}</p>
                      <p className="text-muted-foreground">{exp.experience_description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Index;