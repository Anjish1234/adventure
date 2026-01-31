import React from 'react';
import { User } from '../types';
import { ChatBubbleIcon, UserCircleIcon } from './Icons';

interface ConnectionsViewProps {
  connections: User[];
  onSelectUser: (user: User) => void;
}

const ConnectionsView: React.FC<ConnectionsViewProps> = ({ connections, onSelectUser }) => {
  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ChatBubbleIcon className="w-24 h-24 text-pink-500/50" />
        <p className="mt-4 text-2xl font-bold text-gray-300">No Connections Yet</p>
        <p className="text-gray-500">Go to the Discover tab and swipe right on people you want to connect with!</p>
      </div>
    );
  }

  return (
    <div>
        <h2 className="text-3xl font-bold text-white mb-6">My Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {connections.map((user) => (
            <div 
                key={user.id}
                className="group bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700"
            >
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${user.avatarUrl})` }} />
                <div className="p-4">
                    <h3 className="text-lg font-bold text-white truncate">{user.name}</h3>
                    <p className="text-sm text-gray-400 h-10 overflow-hidden">{user.bio}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {user.interests.slice(0, 2).map(interest => (
                            <span key={interest} className="px-2 py-0.5 text-xs text-white bg-gray-700 rounded-full">{interest}</span>
                        ))}
                    </div>
                </div>
                <div className='p-4 border-t border-gray-700/50 flex gap-2'>
                    <button onClick={() => onSelectUser(user)} className="flex-1 text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2">
                        <UserCircleIcon className="w-4 h-4" /> Profile
                    </button>
                    <button className="flex-1 text-sm bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2">
                        <ChatBubbleIcon className="w-4 h-4" /> Chat
                    </button>
                </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default ConnectionsView;
