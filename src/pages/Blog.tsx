import { useState, useEffect } from "react";
import { getBlogs } from "../api/Portf_api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search } from "lucide-react";
import BlogCard from "@/components/ui/BlogCard";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: number;  // Changed from blog.id to direct id
  blog_image: string;
  blog_title: string;
  blog_date: string;
  blog_text: string;
  like_count: number;
  love_count: number;
  laugh_count: number;
  user_reaction?: {
    is_liked?: boolean;
    is_loved?: boolean;
    is_laughed?: boolean;
  };
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await getBlogs();
      setBlogs(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredPosts = searchTerm
    ? blogs.filter(post =>
        post.blog_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : blogs;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12 fade-in">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Blog Posts</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our latest thoughts, ideas, and stories
          </p>
        </div>

        <div className="max-w-md mx-auto relative mb-12 fade-in">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            className="w-full px-12 py-3 bg-black/20 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-300"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 memes-grid">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onOpenFullScreen={setCurrentPost}
              onUpdate={fetchBlogs}
            />
          ))}
        </div>

        {currentPost && (
          <BlogCard
            post={currentPost}
            onOpenFullScreen={() => {}}
            isFullScreen
            onClose={() => setCurrentPost(null)}
            onUpdate={fetchBlogs}
          />
        )}
      </div>
    </div>
  );
};

export default Blog;