import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ThumbsUp, Laugh } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

interface BlogPost {
    id: number;
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

interface BlogCardProps {
    post: BlogPost;
    onOpenFullScreen: (post: BlogPost) => void;
    isFullScreen?: boolean;
    onClose?: () => void;
    onUpdate: () => void;
}

interface StoredReaction {
    is_liked: boolean;
    is_loved: boolean;
    is_laughed: boolean;
}

const BlogCard = ({ post, onOpenFullScreen, isFullScreen = false, onClose, onUpdate }: BlogCardProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const isLoggedIn = !!username;
    const [reactionInProgress, setReactionInProgress] = useState(false);

    // Load reactions from localStorage
    const loadStoredReactions = () => {
        const key = `blog_reaction_${post.id}_${username}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored) as StoredReaction;
        }
        return {
            is_liked: false,
            is_loved: false,
            is_laughed: false
        };
    };

    const [localReactions, setLocalReactions] = useState<StoredReaction>(loadStoredReactions());

    // Save reactions to localStorage whenever they change
    useEffect(() => {
        if (isLoggedIn && post.id) {
            const key = `blog_reaction_${post.id}_${username}`;
            localStorage.setItem(key, JSON.stringify(localReactions));
        }
    }, [localReactions, post.id, username, isLoggedIn]);

    const handleReaction = async (reactionType: 'like' | 'love' | 'laugh') => {
        
        if (!post?.id) {
            
            return;
        }

        if (reactionInProgress) return;
        setReactionInProgress(true);

        try {
            const reactionKey = `is_${reactionType}${reactionType === 'laugh' ? 'ed' : 'd'}` as keyof StoredReaction;
            const currentValue = localReactions[reactionKey];

            setLocalReactions(prev => ({
                ...prev,
                [reactionKey]: !currentValue
            }));

            onUpdate();
        } catch (error) {            
        } finally {
            setReactionInProgress(false);
        }
    };

    const ReactionButton = ({ type, icon: Icon, glowing }: { 
        type: 'like' | 'love' | 'laugh', 
        icon: typeof ThumbsUp,
        glowing: boolean
    }) => {
        const isReacted = localReactions[`is_${type}${type === 'laugh' ? 'ed' : 'd'}` as keyof StoredReaction];
        
        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleReaction(type);
                }}
                className={cn(
                    "reaction-button flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                    "hover:scale-110 hover:bg-white/20",
                    isReacted ? "bg-white/20 scale-105" : "bg-white/5",
                    glowing ? "animate-pulse shadow-lg shadow-blue-500/50" : ""
                )}
                disabled={!isLoggedIn}
            >
                <Icon 
                    className={cn(
                        "w-6 h-6 transition-colors",
                        isReacted ? "text-blue-500" : "text-gray-400",
                        glowing ? "text-blue-400" : ""
                    )}
                    fill={isReacted ? "#0EA5E9" : "none"}
                    strokeWidth={1.5}
                />
            </button>
        );
    };

    const content = (
        <>
            <div className="meme-image-container rounded-t-xl">
                <img
                    src={post.blog_image}
                    alt={post.blog_title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                />
            </div>

            <CardHeader className="p-6 space-y-2">
                <CardTitle className="text-2xl font-bold text-gradient">{post.blog_title}</CardTitle>
                <CardDescription className="text-sm text-gray-400">{post.blog_date}</CardDescription>
            </CardHeader>

            <CardContent className="p-6">
                <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none">
                    {isFullScreen ? (
                        <ReactMarkdown>{post.blog_text}</ReactMarkdown>
                    ) : (
                        <ReactMarkdown>{`${post.blog_text.slice(0, 150)}...`}</ReactMarkdown>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-6 flex justify-between items-center border-t border-white/10">
                <div className="flex items-center gap-3">
                    <ReactionButton
                        type="like"
                        icon={ThumbsUp}
                        glowing={post.like_count > 5}
                    />
                    <ReactionButton
                        type="love"
                        icon={Heart}
                        glowing={post.love_count > 5}
                    />
                    <ReactionButton
                        type="laugh"
                        icon={Laugh}
                        glowing={post.laugh_count > 5}
                    />
                </div>
                
            </CardFooter>
        </>
    );

    if (isFullScreen) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm p-4 md:p-8 z-50 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <Card className="meme-card relative">
                        {content}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            ×
                        </button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <Card
            className="meme-card cursor-pointer group"
            onClick={() => onOpenFullScreen(post)}
        >
            {content}
        </Card>
    );
};

export default BlogCard;