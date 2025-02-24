import { useState, useEffect } from "react";
import { getMemes, checkIfReactionExists } from "@/api/Portf_api.js";
import { useToast } from "@/hooks/use-toast";
import { MemeCard } from "@/components/ui/MemeCard";

interface UserReaction {
  is_liked: boolean;
  is_loved: boolean;
  is_laughed: boolean;
}

interface Comment {
  id: number;
  user: string;
  meme: number;
  comment_text: string;
  date: string;
}

interface Meme {
  id: number;
  meme_img: string;
  comments: Comment[];
  like_count: number;
  love_count: number;
  laugh_count: number;
  user_reaction?: UserReaction;
}

const Memes = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isLoggedIn = localStorage.getItem('token') !== null;

  const fetchMemes = async () => {
    try {
        const response = await getMemes();
        
        // Ensure response.data is used correctly
        const memesData = Array.isArray(response?.data) ? response.data : [];
        
        setMemes(memesData);
    } catch (error) {
        console.error("Error fetching memes:", error);
        toast({
            title: "Error",
            description: "Failed to load memes. Please try again later.",
            variant: "destructive",
        });
        setMemes([]);
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    fetchMemes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="container mx-auto px-4 py-8">
        <br></br>
        <br></br>
        <br></br>
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Memes 😂</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          {memes?.map((meme) => (
            <MemeCard
              key={meme.id}
              meme={meme}
              isLoggedIn={isLoggedIn}
              onUpdate={fetchMemes}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Memes;