import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ThumbsUp, Laugh, MessageSquare, SendIcon, Trash2 } from "lucide-react";
import { createComment, createMemeReaction, updateMemeReaction, deleteComment, getUsername, checkIfReactionExists, deleteMemeReaction } from "@/api/Portf_api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../ui/UseAvatar";

export const MemeCard = ({ meme, onUpdate }) => {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [reactionInProgress, setReactionInProgress] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const username = getUsername();
  const isLoggedIn = !!username;

  const handleReaction = async (reactionType) => {
    if (!isLoggedIn) {
      return;
    }

    if (reactionInProgress) return;
    setReactionInProgress(true);

    try {
      const currentReaction = meme.user_reaction || {};
      const isCurrentlyActive = currentReaction[`is_${reactionType}ed`] || currentReaction[`is_${reactionType}d`];
      
      // Check if a reaction exists
      const existingReaction = await checkIfReactionExists(meme.id, username);

      if (isCurrentlyActive && existingReaction) {
        // If we're toggling off the current reaction
        if (Object.values(currentReaction).filter(Boolean).length === 1) {
          // If this is the only active reaction, delete it
          await deleteMemeReaction(existingReaction.id);
        } else {
          // Otherwise, update to remove this reaction
          const newReactionState = {
            is_liked: reactionType === 'like' ? false : currentReaction.is_liked || false,
            is_loved: reactionType === 'love' ? false : currentReaction.is_loved || false,
            is_laughed: reactionType === 'laugh' ? false : currentReaction.is_laughed || false
          };
          await updateMemeReaction(existingReaction.id, {
            meme: Number(meme.id),
            user: username,
            ...newReactionState
          });
        }
      } else {
        // Setting a new reaction or changing reaction type
        const newReactionState = {
          is_liked: reactionType === 'like' ? true : currentReaction.is_liked || false,
          is_loved: reactionType === 'love' ? true : currentReaction.is_loved || false,
          is_laughed: reactionType === 'laugh' ? true : currentReaction.is_laughed || false
        };

        if (existingReaction) {
          // Update existing reaction
          await updateMemeReaction(existingReaction.id, {
            meme: Number(meme.id),
            user: username,
            ...newReactionState
          });
        } else {
          // Create new reaction
          await createMemeReaction({
            meme: Number(meme.id),
            user: username,
            ...newReactionState
          });
        }
      }

      onUpdate();
    } catch (error) {

    } finally {
      setReactionInProgress(false);
    }
  };
  

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }

    if (!newComment.trim()) return;

    try {
      await createComment({
        meme: Number(meme.id),
        comment_text: newComment,
      });
      setNewComment('');
      onUpdate();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Failed to add comment.";
      if (error.response?.status === 401) {
        navigate('auth');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      onUpdate();
      
    } catch (error) {
      return;
    }
  };

  return (
    <Card className="meme-card">
      <div className="meme-image-container">
        <img
          src={meme.meme_img}
          alt="Meme"
          className="meme-image"
          loading="lazy"
        />
      </div>

      <CardContent className="p-4 bg-[#1a1a1a]">
        <div className="flex justify-center space-x-6 mb-4">
          <button 
            onClick={() => handleReaction('like')}
            className={`reaction-button ${
              !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
            } ${meme.user_reaction?.is_liked ? 'active text-blue-400' : 'text-gray-300'}`}
            disabled={!isLoggedIn || reactionInProgress}
          >
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm font-medium">{meme.like_count || 0}</span>
          </button>
          <button 
            onClick={() => handleReaction('love')}
            className={`reaction-button ${
              !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
            } ${meme.user_reaction?.is_loved ? 'active text-red-400' : 'text-gray-300'}`}
            disabled={!isLoggedIn || reactionInProgress}
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">{meme.love_count || 0}</span>
          </button>
          <button 
            onClick={() => handleReaction('laugh')}
            className={`reaction-button ${
              !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
            } ${meme.user_reaction?.is_laughed ? 'active text-yellow-400' : 'text-gray-300'}`}
            disabled={!isLoggedIn || reactionInProgress}
          >
            <Laugh className="w-5 h-5" />
            <span className="text-sm font-medium">{meme.laugh_count || 0}</span>
          </button>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-all duration-200 mb-4 hover:underline"
          >
            {isExpanded ? "Hide Comments" : `Show Comments (${meme.comments?.length || 0})`}
          </button>

          {isExpanded && (
            <div className="comment-section">
              {[...(meme.comments || [])]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((comment) => (
                <div key={comment.id} className="comment-bubble">
                  <UserAvatar username={comment.user} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-200">{comment.user}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {new Date(comment.date).toLocaleDateString()}
                        </span>
                        {isLoggedIn && comment.user === username && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-400 hover:text-red-400 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 break-words">{comment.comment_text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-4">
            {isLoggedIn && <UserAvatar username={username} size="sm" />}
            <div className="flex-1 relative">
              <input
                type="text"
                className="comment-input"
                placeholder={isLoggedIn ? "Write a comment..." : "Login to comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!isLoggedIn}
              />
              {isLoggedIn && newComment.trim() && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-500 hover:bg-blue-400 text-white transition-all duration-200 hover:scale-105"
                  onClick={handleAddComment}
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};