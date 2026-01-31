import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { User, Adventure } from '../types';
import { LocationIcon, SparklesIcon } from './Icons';

interface ProfileSwipeCardProps {
  profile: User;
  onSwipe: (direction: 'left' | 'right') => void;
  onSelectAdventure: (adventure: Adventure) => void;
  isActive: boolean;
}

const ProfileSwipeCard = forwardRef<
    { swipe: (dir: 'left' | 'right') => void },
    ProfileSwipeCardProps
>(({ profile, onSwipe, onSelectAdventure, isActive }, ref) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const startPos = React.useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isActive) return;
        setDragging(true);
        startPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragging || !isActive) return;
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        setPosition({ x: dx, y: dy });
    };

    const handleMouseUp = () => {
        if (!dragging || !isActive) return;
        setDragging(false);
        if (Math.abs(position.x) > 100) {
            onSwipe(position.x > 0 ? 'right' : 'left');
        } else {
            setPosition({ x: 0, y: 0 });
        }
    };

    useImperativeHandle(ref, () => ({
        swipe: (dir: 'left' | 'right') => {
            const x = dir === 'right' ? window.innerWidth : -window.innerWidth;
            setPosition({ x: x * 1.5, y: 0 });
            setTimeout(() => onSwipe(dir), 200);
        }
    }));
    
    const rotation = position.x / 20;
    
    const cardStyle: React.CSSProperties = {
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transition: dragging ? 'none' : 'transform 0.3s ease-out',
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: isActive ? 10 : 1,
    };
    
    return (
        <div
            style={cardStyle}
            className="absolute w-full h-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden flex flex-col justify-end"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.avatarUrl})` }} />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute top-4 left-4 p-2 bg-black/50 rounded-xl text-white font-bold text-3xl" style={{ opacity: position.x > 0 ? (position.x/100) : 0, color: '#4ade80' }}>CONNECT</div>
            <div className="absolute top-4 right-4 p-2 bg-black/50 rounded-xl text-white font-bold text-3xl" style={{ opacity: position.x < 0 ? (-position.x/100) : 0, color: '#f87171' }}>PASS</div>
            
            <div className="relative p-5 text-white">
                {profile.pitchedAdventure && (
                    <div 
                        onClick={() => onSelectAdventure(profile.pitchedAdventure!)}
                        className="mb-3 p-3 bg-cyan-900/50 backdrop-blur-sm border border-cyan-500/50 rounded-lg hover:bg-cyan-900/80 cursor-pointer"
                    >
                        <p className="text-xs font-bold text-cyan-400 flex items-center"><SparklesIcon className="w-4 h-4 mr-1"/>PITCHED ADVENTURE</p>
                        <h4 className="font-bold text-white">{profile.pitchedAdventure.title}</h4>
                        <p className="text-xs text-gray-300 flex items-center"><LocationIcon className="w-3 h-3 mr-1"/>{profile.pitchedAdventure.location.name}</p>
                    </div>
                )}
                <h3 className="text-3xl font-bold">{profile.name}</h3>
                <p className="text-sm text-gray-300 leading-snug">{profile.bio}</p>
                 <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 text-xs text-white bg-purple-600 rounded-full">{profile.skillLevel}</span>
                    {profile.interests.slice(0, 3).map(interest => (
                        <span key={interest} className="px-3 py-1 text-xs text-white bg-white/10 rounded-full">{interest}</span>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default ProfileSwipeCard;
