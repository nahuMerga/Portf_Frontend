import React from 'react';

interface UserAvatarProps {
  username: string;
  size?: "sm" | "md" | "lg";
}

const UserAvatar: React.FC<UserAvatarProps> = ({ username, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg"
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const getRandomColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-rose-400 to-rose-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-emerald-400 to-emerald-600',
      'bg-gradient-to-br from-amber-400 to-amber-600'
    ];
    return colors[Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length];
  };

  return (
    <div 
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold ${getRandomColor(username)} shadow-lg ring-2 ring-white/10`}
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
    >
      {getInitial(username)}
    </div>
  );
};

export default UserAvatar;