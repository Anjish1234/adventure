import React, { useState, useMemo } from 'react';
import { User, Adventure } from '../types';
import ProfileSwipeCard from './ProfileSwipeCard';
import { XCircleIcon, HeartIcon, UsersIcon } from './Icons';

interface DiscoverFeedProps {
  profiles: User[];
  onLike: (profile: User) => void;
  onSelectAdventure: (adventure: Adventure) => void;
}

const DiscoverFeed: React.FC<DiscoverFeedProps> = ({ profiles, onLike, onSelectAdventure }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const canSwipe = currentIndex < profiles.length;

  const swiped = (direction: 'left' | 'right', profile: User) => {
    if (direction === 'right') {
      onLike(profile);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const childRefs = useMemo(
    () =>
      Array(profiles.length)
        .fill(0)
        .map(() => React.createRef<{ swipe: (dir: 'left' | 'right') => Promise<void> }>()),
    [profiles.length]
  );
  
  const swipe = async (dir: 'left' | 'right') => {
    if (canSwipe) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  if (!profiles.length || currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <UsersIcon className="w-24 h-24 text-cyan-500/50" />
        <p className="mt-4 text-2xl font-bold text-gray-300">That's everyone for now!</p>
        <p className="text-gray-500">You've seen all the adventurers in your area. Check back later for new people.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center">
        <div className="relative w-full max-w-sm h-full max-h-[550px]">
            {profiles.map((profile, index) => (
                <ProfileSwipeCard
                    ref={childRefs[index]}
                    key={profile.id}
                    profile={profile}
                    onSwipe={(dir) => swiped(dir, profile)}
                    onSelectAdventure={onSelectAdventure}
                    isActive={index === currentIndex}
                />
            ))}
        </div>
        <div className="flex items-center justify-center gap-8 mt-6">
            <button onClick={() => swipe('left')} className="p-4 bg-white/10 rounded-full text-red-500 hover:bg-white/20 transition-transform transform hover:scale-110">
                <XCircleIcon className="h-10 w-10" />
            </button>
            <button onClick={() => swipe('right')} className="p-5 bg-white/10 rounded-full text-green-400 hover:bg-white/20 transition-transform transform hover:scale-110">
                <HeartIcon className="h-12 w-12" />
            </button>
        </div>
    </div>
  );
};

export default DiscoverFeed;
