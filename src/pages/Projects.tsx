import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/Portf_api";
import { useToast } from "@/hooks/use-toast";

interface Project {
  proj_image: string;
  proj_title: string;
  proj_date: string;
  proj_description: string;
  github_link: string;
  live_view_link: string;
  number_of_stars: number;
}

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const filteredProjects = projects.filter((project) =>
    project.proj_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        {/* Search Bar */}
<div className="flex justify-end mb-6">
  <div className="relative w-1/4"> 
    <input
      type="text"
      className="w-full px-4 py-2 text-white bg-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-sm placeholder-gray-400 text-sm"
      placeholder="🔍 Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>


        <h1 className="text-4xl font-bold mb-8 text-center">Projects</h1>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
            >
              {/* Project Image */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={project.proj_image}
                  alt={project.proj_title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold">{project.proj_title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {new Date(project.proj_date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4">
                <p className="text-white-700">{project.proj_description}</p>
              </CardContent>

              <CardFooter className="p-4 flex justify-between items-center border-t">
                <a 
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href={project.live_view_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Live Preview →
                </a>
                {/* Star Rating */}
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 ${project.number_of_stars >= star ? "text-yellow-500" : "text-gray-400"}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;