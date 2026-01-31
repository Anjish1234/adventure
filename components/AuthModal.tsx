import React, { useState } from 'react';
import { LogoIcon, ArrowRightIcon } from './Icons';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onLogin: (user: User) => void;
}

const interestsList = ["Hiking", "Surfing", "Climbing", "Kayaking", "Skiing", "Camping", "Cycling", "Yoga"];
const skillLevels: Array<User['skillLevel']> = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onLogin }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<User['skillLevel']>('Beginner');

  const handleNext = () => {
    if (name.trim()) setStep(step + 1);
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && interests.length > 0) {
      // FIX: Added a unique id to the user object to match the User type.
      onLogin({
        id: crypto.randomUUID(),
        name: name.trim(),
        avatarUrl: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
        bio: 'New adventurer ready to explore!',
        interests,
        skillLevel,
      });
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl shadow-purple-500/10 w-full max-w-md border border-gray-700 text-center transform transition-all duration-300 scale-95 animate-fade-in-up">
        <LogoIcon className="h-16 w-16 text-cyan-400 mx-auto" />
        {step === 1 && (
          <div>
            <h2 className="mt-4 text-2xl font-bold text-white">Welcome to Adventurly</h2>
            <p className="mt-2 text-sm text-gray-400">What should we call you?</p>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="mt-6">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Alex Rover" className="block w-full text-center px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-gray-200" required />
              <button type="submit" className="w-full mt-4 flex justify-center items-center bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50" disabled={!name.trim()}>Next <ArrowRightIcon className="w-5 h-5 ml-2" /></button>
            </form>
          </div>
        )}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-white">What are your interests?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              {interestsList.map(interest => (
                <button type="button" key={interest} onClick={() => toggleInterest(interest)} className={`p-2 rounded-lg text-sm border-2 transition-colors ${interests.includes(interest) ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-gray-700 border-gray-600 hover:border-cyan-500'}`}>{interest}</button>
              ))}
            </div>
            <h2 className="text-xl font-bold text-white mt-6">What's your skill level?</h2>
            <div className="flex justify-center gap-2 my-4">
              {skillLevels.map(level => (
                <button type="button" key={level} onClick={() => setSkillLevel(level)} className={`px-3 py-1 rounded-full text-sm transition-colors ${skillLevel === level ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{level}</button>
              ))}
            </div>
            <button type="submit" className="w-full mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50" disabled={interests.length === 0}>Start Exploring</button>
          </form>
        )}
      </div>
      <style>{`.animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; } @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
};
export default AuthModal;