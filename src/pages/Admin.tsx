import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  X, Edit, Plus, Star, ThumbsUp, Heart, MessageCircle, Users, BookOpen, 
  Image as ImageIcon, Layout, BarChart3, LineChart, PieChart, Trash2,
  Menu, ChevronRight, LogOut, User, Reply
} from "lucide-react";
import {
  LineChart as ReChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";
import * as api from "../api/Portf_api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Updated interfaces to match backend expectations
interface AboutData {
  id?: number;
  about_text: string;
  image: string;
}

interface MessageData {
  id?: number;
  name: string;
  email: string;
  message: string;
}

interface SkillData {
  id?: number;
  name: string;
  icon: string;
  progress: number;
}

interface CertificationData {
  id?: number;
  cert_image: string;
  cert_title: string;
  cert_date: string;
  cert_description: string;
}

interface ExperienceData {
  id?: number;
  experience_title: string;
  experience_date: string;
  experience_description: string;
}

interface ProjectData {
  id?: number;
  proj_image: string;
  proj_title: string;
  proj_date: string;
  proj_description: string;
  github_link: string;
  live_view_link: string;
  number_of_stars: number;
}

interface BlogData {
  id?: number;
  blog_image: string;
  blog_title: string;
  blog_date: string;
  blog_text: string;
  like_count: number;
  love_count: number;
  laugh_count: number;
}

interface MemeData {
  id?: number;
  meme_img: string;
  like_count: number;
  love_count: number;
  laugh_count: number;
  comments: Array<{ id: number; text: string; user: string }>;
}



type SectionData = AboutData | SkillData | CertificationData | ExperienceData | ProjectData | BlogData | MemeData;

const Admin = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("stats");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<SectionData>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const queryClient = useQueryClient();


  // Updated queries with proper typing
  const queries = {
    about: useQuery({ 
      queryKey: ['about'], 
      queryFn: async () => {
        const response = await api.getAbout();
        return response.data;
      }
    }),
    skills: useQuery({ 
      queryKey: ['skills'], 
      queryFn: async () => {
        const response = await api.getSkills();
        return response.data;
      }
    }),
    certifications: useQuery({ 
      queryKey: ['certifications'], 
      queryFn: async () => {
        const response = await api.getCertifications();
        return response.data;
      }
    }),
    experiences: useQuery({ 
      queryKey: ['experiences'], 
      queryFn: async () => {
        const response = await api.getExperiences();
        return response.data;
      }
    }),
    projects: useQuery({ 
      queryKey: ['projects'], 
      queryFn: async () => {
        const response = await api.getProjects();
        return response.data;
      }
    }),

    messages: useQuery({ 
      queryKey: ['messages'], 
      queryFn: async () => {
        const response = await api.getContactMe();
        return response.data;
      }
    }),

    blogs: useQuery({ 
      queryKey: ['blogs'], 
      queryFn: async () => {
        const response = await api.getBlogs();
        return response.data;
      }
    }),
    memes: useQuery({ 
      queryKey: ['memes'], 
      queryFn: async () => {
        const response = await api.getMemes();
        return response.data;
      }
    })
  };

  const createMutation = useMutation({
    mutationFn: async ({ section, data }: { section: string; data: any }) => {
      switch (section) {
        case 'skills':
          return api.createSkill(data);
        case 'certifications':
          return api.createCertification(data);
        case 'experiences':
          return api.createExperience(data);
        case 'projects':
          return api.createProject(data);
        case 'blogs':
          return api.createBlog(data);
        case 'memes':
          return api.createMeme(data);
        default:
          throw new Error('Invalid section');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.section] });
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      setFormData({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    }
  });

  // Update mutation with fix for duplicate skills and proper section handling
  const updateMutation = useMutation({
    mutationFn: async ({ section, id, data }: { section: string; id: number; data: any }) => {
      if (!id) throw new Error('ID is required for update');
      
      switch (section) {
        case 'about':
          return api.updateAbout(id, data);
        case 'skills':
          return api.updateSkill(id, data);
        case 'certifications':
          return api.updateCertification(id, data);
        case 'experiences':
          return api.updateExperience(id, data);
        case 'projects':
          return api.updateProject(id, data);
        case 'blogs':
          return api.updateBlog(id, data);
        case 'memes':
          return api.updateMeme(id, data); // Add memes update
        default:
          throw new Error('Invalid section');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.section] });
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setFormData({});
      setEditingId(null); // Clear editing state after successful update
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  });

   // Update delete mutation with proper memes handling
   const deleteMutation = useMutation({
    mutationFn: async ({ section, id }: { section: string; id: number }) => {
      if (!id) throw new Error('ID is required for deletion');
      
      switch (section) {
        case 'about':
          return api.deleteAbout(id);
        case 'skills':
          return api.deleteSkill(id);
        case 'certifications':
          return api.deleteCertification(id);
        case 'experiences':
          return api.deleteExperience(id);
        case 'projects':
          return api.deleteProject(id);
        case 'blogs':
          return api.deleteBlog(id);
        case 'memes':
          return api.deleteMeme(id); // Add memes deletion
        default:
          throw new Error('Invalid section');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.section] });
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      setEditingId(null); // Clear editing state after successful deletion
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  });

  const handleAdd = (section: string) => {
    if (!formData || Object.keys(formData).length === 0) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    // For about section, use update if exists
    if (section === 'about' && queries.about.data?.[0]) {
      const aboutData = queries.about.data[0];
      updateMutation.mutate({ section, id: aboutData.id, data: formData });
      return;
    }

    createMutation.mutate({ section, data: formData });
  };

  const handleEdit = (section: string, id?: number) => {
    if (!id) return;
    
    const data = queries[section as keyof typeof queries].data;
    if (Array.isArray(data)) {
      const item = data.find((item: any) => item.id === id);
      if (item) {
        setFormData(item);
        setEditingId(id);
      }
    } else if (section === 'about' && data) {
      setFormData(data);
      setEditingId(id);
    }
  };

  const handleUpdate = (section: string) => {
    if (!editingId) return;
    updateMutation.mutate({ section, id: editingId, data: formData });
  };

  const handleDelete = (section: string, id?: number) => {
    if (!id) return;
    deleteMutation.mutate({ section, id });
  };

  // Stats data calculation from API data
  const statsData = {
    content: [
      { name: 'Blogs', value: Array.isArray(queries.blogs.data) ? queries.blogs.data.length : 0 },
      { name: 'Memes', value: Array.isArray(queries.memes.data) ? queries.memes.data.length : 0 },
      { name: 'Projects', value: Array.isArray(queries.projects.data) ? queries.projects.data.length : 0 },
    ],
    engagement: [
      { month: 'Jan', blogs: 45, memes: 65, projects: 32 },
      { month: 'Feb', blogs: 52, memes: 78, projects: 38 },
      { month: 'Mar', blogs: 61, memes: 85, projects: 45 },
      { month: 'Apr', blogs: 75, memes: 92, projects: 51 },
    ]
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  // Sidebar items configuration remains the same
  const sidebarItems = [
    { id: "stats", icon: BarChart3, label: "Statistics" },
    { id: "messages", icon: MessageCircle, label: "Messages" },
    { id: "about", icon: Users, label: "About" },
    { id: "skills", icon: Layout, label: "Skills" },
    { id: "certifications", icon: Star, label: "Certifications" },
    { id: "experiences", icon: LineChart, label: "Experience" },
    { id: "projects", icon: Layout, label: "Projects" },
    { id: "blogs", icon: BookOpen, label: "Blogs" },
    { id: "memes", icon: ImageIcon, label: "Memes" },
  ];

  const renderStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-white-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5" /> Content Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={statsData.content}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statsData.content.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-white-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5" /> Engagement Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ReChart data={statsData.engagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="blogs" stroke="#8884d8" />
              <Line type="monotone" dataKey="memes" stroke="#82ca9d" />
              <Line type="monotone" dataKey="projects" stroke="#ffc658" />
            </ReChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderForm = (section: string) => {
    const fields = {
      about: [
        { name: "image", type: "text", placeholder: "Profile Image URL" },
        { name: "about_text", type: "text", placeholder: "About Text" },
      ],
      skills: [
        { name: "name", type: "text", placeholder: "Skill Name" },
        { name: "icon", type: "text", placeholder: "Icon Name" },
        { name: "progress", type: "number", placeholder: "Progress (0-100)" },
      ],
      certifications: [
        { name: "cert_image", type: "text", placeholder: "Certificate Image URL" },
        { name: "cert_title", type: "text", placeholder: "Title" },
        { name: "cert_date", type: "date", placeholder: "Date" },
        { name: "cert_description", type: "text", placeholder: "Description" },
      ],
      experiences: [
        { name: "experience_title", type: "text", placeholder: "Title" },
        { name: "experience_date", type: "date", placeholder: "Date" },
        { name: "experience_description", type: "text", placeholder: "Description" },
      ],
      projects: [
        { name: "proj_image", type: "text", placeholder: "Project Image URL" },
        { name: "proj_title", type: "text", placeholder: "Title" },
        { name: "proj_date", type: "date", placeholder: "Date" },
        { name: "proj_description", type: "text", placeholder: "Description" },
        { name: "github_link", type: "text", placeholder: "GitHub Link" },
        { name: "live_view_link", type: "text", placeholder: "Live Preview Link" },
        { name: "number_of_stars", type: "number", placeholder: "Number of Stars" },
      ],
      blogs: [
        { name: "blog_image", type: "text", placeholder: "Blog Image URL" },
        { name: "blog_title", type: "text", placeholder: "Title" },
        { name: "blog_date", type: "date", placeholder: "Date" },
        { name: "blog_text", type: "text", placeholder: "Blog Text" },
      ],

      messages: [
        { name: "name", type: "text", placeholder: "Name" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "message", type: "textarea", placeholder: "Message" },
      ], 

      memes: [
        { name: "meme_img", type: "textarea", placeholder: "Meme Image URL" },
      ],
    };

    return (
      <div className="space-y-4">
        {fields[section as keyof typeof fields]?.map((field) => (
          <Input
            key={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name as keyof typeof formData] || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
            className="hover:scale-[1.01] transition-transform dark:bg-gray-800"
          />
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (activeSection === "stats") {
      return renderStats();
    }

    const query = queries[activeSection as keyof typeof queries];
    
    if (!query) {
      return <div>Section not found</div>;
    }

    if (query.isLoading) {
      return <div className="flex justify-center items-center p-8">Loading...</div>;
    }

    if (query.isError) {
      console.error('Query error:', query.error); // Debug log
      return (
        <div className="flex justify-center items-center p-8 text-red-500">
          Error loading data. Please try again.
        </div>
      );
    }

    // Handle the about section specifically
    if (activeSection === "about" && query.data?.length > 0) {
      const aboutData = query.data[0];
      return (
        <div className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
          <div className="relative flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10">
              <img 
                src={aboutData.image} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-black/50 backdrop-blur-sm"
                onClick={() => handleEdit("about", aboutData.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h3 className="font-medium text-lg">About Me</h3>
            <p className="text-gray-300 mt-2">{aboutData.about_text}</p>
          </div>
        </div>
      );
    }

      // For experience section
  if (activeSection === "experiences" && Array.isArray(query.data)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {query.data.map((item: ExperienceData) => (
          <div 
            key={item.id}
            className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{item.experience_title}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit("experiences", item.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete("experiences", item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-400">
                {new Date(item.experience_date).toLocaleDateString()}
              </p>
              
              <p className="text-gray-300 whitespace-pre-wrap">
                {item.experience_description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

 // Special handling for messages section
 if (activeSection === "messages" && Array.isArray(query.data)) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Messages
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {query.data.map((item: MessageData) => (
          <div 
            key={item.id}
            className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {item.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReply(item.email)}
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50/10"
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {item.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

  // Update memes section rendering with correct comment text field
  if (activeSection === "memes" && Array.isArray(query.data)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {query.data.map((item: MemeData) => (
          <div 
            key={item.id}
            className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
          >
            <img 
              src={item.meme_img} 
              alt="Meme"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            <div className="flex items-center justify-between gap-4 text-gray-400">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" /> {item.like_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> {item.love_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {item.comments?.length || 0}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit("memes", item.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete("memes", item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {item.comments && item.comments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Comments</h4>
                {item.comments.map((comment) => (
                  <div key={comment.id} className="text-sm text-gray-300 bg-gray-800/50 p-2 rounded">
                    <strong className="font-medium text-gray-200">{comment.user}</strong>: {comment.comment_text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

    // For other sections, render grid of items
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(query.data) && query.data.map((item: any) => (
          <div 
            key={item.id}
            className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
          >
            {/* Image display based on section */}
            {(item.proj_image || item.cert_image || item.blog_image || item.meme_img) && (
              <img 
                src={item.proj_image || item.cert_image || item.blog_image || item.meme_img} 
                alt={item.proj_title || item.cert_title || item.blog_title || "Image"}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            
            <div className="space-y-2">
              {/* Title section */}
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">
                  {item.proj_title || item.cert_title || item.blog_title || 
                   item.experience_title || item.name || ""}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(activeSection, item.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(activeSection, item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Date display */}
              {(item.proj_date || item.cert_date || item.blog_date || item.experience_date) && (
                <p className="text-sm text-gray-400">
                  {new Date(item.proj_date || item.cert_date || 
                           item.blog_date || item.experience_date).toLocaleDateString()}
                </p>
              )}
              
              {/* Description display */}
              {(item.proj_description || item.cert_description || 
                item.blog_text || item.experience_description) && (
                <p className="text-gray-300">
                  {item.proj_description || item.cert_description || 
                   item.blog_text || item.experience_description}
                </p>
              )}

              {/* Progress bar for skills */}
              {item.progress !== undefined && (
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              )}

              {/* Project links */}
              {(item.github_link || item.live_view_link) && (
                <div className="flex gap-4 mt-2">
                  {item.github_link && (
                    <a 
                      href={item.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                  {item.live_view_link && (
                    <a 
                      href={item.live_view_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Live Preview
                    </a>
                  )}
                </div>
              )}

              {/* Engagement metrics */}
              {(item.number_of_stars || item.like_count || item.love_count || item.laugh_count) && (
                <div className="flex items-center gap-4 text-gray-400">
                  {item.number_of_stars !== undefined && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" /> {item.number_of_stars}
                    </span>
                  )}
                  {item.like_count !== undefined && (
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" /> {item.like_count}
                    </span>
                  )}
                  {item.love_count !== undefined && (
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {item.love_count}
                    </span>
                  )}
                  {item.comments?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" /> {item.comments.length}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black-50/95 flex">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-black border-r border-black-200 transition-all duration-300 ease-in-out z-20",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-4 flex justify-between items-center border-b">
          {isSidebarOpen && <h2 className="font-semibold">Dashboard</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-white-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center px-4 py-3 transition-all",
                "hover:bg-white-100",
                activeSection === item.id ? "bg-black-100" : "",
                isSidebarOpen ? "justify-start" : "justify-center"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                activeSection === item.id ? "text-blue-600" : "text-white-600"
              )} />
              {isSidebarOpen && (
                <span className={cn(
                  "ml-3 text-sm font-medium",
                  activeSection === item.id ? "text-blue-600" : "text-white-600"
                )}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Navbar */}
        <div className={cn(
          "sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white-200 transition-all duration-300",
          isScrolled ? "shadow-md" : ""
        )}>
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white-200 flex items-center justify-center">
                <User className="h-6 w-6 text-white-600" />
              </div>
              <div>
                <h2 className="font-semibold text-white-800">Admin Dashboard</h2>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => window.location.href = "/"}
              className="text-black-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 animate-fade-in">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeSection === "stats" ? (
              renderStats()
            ) : (
              <>
                <div className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-white-100">
                  <h2 className="text-xl font-semibold mb-4">
                    {editingId ? `Edit ${activeSection}` : `Add New ${activeSection}`}
                  </h2>
                  {renderForm(activeSection)}
                  <Button 
                    onClick={() => editingId ? handleUpdate(activeSection) : handleAdd(activeSection)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    {editingId ? "Update" : "Add"} <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-white-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold capitalize">{activeSection}</h2>
                  </div>
                  {renderContent()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;