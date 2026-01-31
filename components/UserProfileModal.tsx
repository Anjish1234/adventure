import React from 'react';
import { User } from '../types';
import { XIcon } from './Icons';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[60] p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl shadow-cyan-500/10 w-full max-w-md border border-gray-700 text-center p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" aria-label="Close profile">
          <XIcon className="h-6 w-6" />
        </button>
        <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-cyan-500" />
        <h2 className="mt-4 text-3xl font-bold text-white">{user.name}</h2>
        <p className="mt-2 text-gray-400">{user.bio}</p>
        
        <div className="mt-4 text-left">
            <span className="text-sm font-bold text-cyan-400">{user.skillLevel}</span>
            <div className="flex flex-wrap gap-2 mt-2">
                {user.interests.map(interest => (
                    <span key={interest} className="px-3 py-1 text-xs text-white bg-gray-700 rounded-full">{interest}</span>
                ))}
            </div>
        </div>

        <div className="mt-6">
          <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-2 px-5 rounded-lg shadow-lg transition-all transform hover:scale-105">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
