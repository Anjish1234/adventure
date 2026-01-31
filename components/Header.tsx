import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon, SearchIcon, UserAddIcon, LogoutIcon, ChatBubbleIcon } from './Icons';
import { User } from '../types';

interface HeaderProps {
    onSearch: () => void;
    currentUser: User | null;
    onLogout: () => void;
    onProfileClick: () => void;
    onViewChange: (view: 'discover' | 'connections') => void;
    currentView: 'discover' | 'connections';
}

const Header: React.FC<HeaderProps> = ({ onSearch, currentUser, onLogout, onProfileClick, onViewChange, currentView }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20 shadow-lg shadow-purple-500/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center"><LogoIcon className="h-10 w-10 text-cyan-400" /><h1 className="ml-3 text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">Adventurly</h1></div>
                    {currentUser && (
                      <div className="hidden sm:flex items-center gap-2">
                        <button onClick={() => onViewChange('discover')} className={`px-4 py-2 text-sm font-semibold rounded-md ${currentView === 'discover' ? 'text-cyan-400 bg-cyan-900/50' : 'text-gray-300 hover:bg-gray-700/50'}`}>Discover</button>
                        <button onClick={() => onViewChange('connections')} className={`px-4 py-2 text-sm font-semibold rounded-md flex items-center gap-2 ${currentView === 'connections' ? 'text-pink-400 bg-pink-900/50' : 'text-gray-300 hover:bg-gray-700/50'}`}><ChatBubbleIcon className="w-5 h-5"/>Connections</button>
                      </div>
                    )}
                    <div className="flex items-center">
                        {currentUser && <button onClick={onSearch} className="relative mr-4 p-2 rounded-full hover:bg-gray-700/50 hidden lg:block"><SearchIcon className="h-5 w-5 text-gray-400" /></button>}
                        {currentUser ? (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-cyan-500"><img className="h-10 w-10 rounded-full object-cover" src={currentUser.avatarUrl} alt={currentUser.name} /></button>
                                {isDropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 z-30">
                                        <div className="px-4 py-2 border-b border-gray-700"><p className="text-sm text-white font-semibold">{currentUser.name}</p></div>
                                        <a href="#" onClick={(e) => { e.preventDefault(); onProfileClick(); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Your Profile</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); setIsDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"><LogoutIcon className="inline h-4 w-4 mr-2" />Sign out</a>
                                    </div>
                                )}
                            </div>
                        ) : (<button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700"><UserAddIcon className="h-5 w-5 mr-2" />Sign Up</button>)}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;
