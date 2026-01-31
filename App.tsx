import React, { useState, useEffect, useCallback } from 'react';
import { Adventure, Geolocation, User } from './types';
import { findAdventurousPeople } from './services/geminiService';
import Header from './components/Header';
import DiscoverFeed from './components/DiscoverFeed';
import AdventureDetailsModal from './components/AdventureDetailsModal';
import AIAssistant from './components/AIAssistant';
import LoadingSpinner from './components/LoadingSpinner';
import { LocationIcon, ErrorIcon, LogoIcon } from './components/Icons';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import ConnectionsView from './components/ConnectionsView';

type ViewMode = 'discover' | 'connections';

export default function App() {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [connections, setConnections] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Geolocation | null>(null);
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileModalUser, setProfileModalUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('discover');
  
  const fetchProfiles = useCallback(async (location: Geolocation) => {
    setIsLoading(true);
    setError(null);
    setProfiles([]);
    try {
      const fetchedProfiles = await findAdventurousPeople(location, currentUser);
      setProfiles(fetchedProfiles);
    } catch (err) {
      console.error(err);
      setError('Failed to find people. The AI might be on a coffee break. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError(null);
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        setUserLocation(location);
        setIsLocating(false);
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        let errorMessage = "Could not get your location.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage = "Location permission denied. Please enable it and click 'Retry'.";
        }
        setError(errorMessage);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (currentUser && userLocation && viewMode === 'discover' && profiles.length === 0) {
      fetchProfiles(userLocation);
    }
  }, [currentUser, userLocation, viewMode, fetchProfiles, profiles.length]);
  
  useEffect(() => {
    if (currentUser && !userLocation) {
      requestLocation();
    }
  }, [currentUser, userLocation, requestLocation]);

  const handleSelectAdventure = (adventure: Adventure) => setSelectedAdventure(adventure);
  const handleCloseModal = () => setSelectedAdventure(null);

  const handleSearch = () => {
    if (userLocation && currentUser) {
       setViewMode('discover');
       fetchProfiles(userLocation);
    }
  };

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
    setCurrentUser(null);
    setProfiles([]);
    setConnections([]);
    setUserLocation(null);
    setError(null);
    setViewMode('discover');
  };

  const handleShowProfile = (user: User) => setProfileModalUser(user);
  
  const handleLike = (profile: User) => {
    setConnections(prev => [profile, ...prev]);
  };

  const renderContent = () => {
    if (!userLocation) {
      if (isLocating) return <div className="flex flex-col items-center justify-center h-64 text-center"><LoadingSpinner /><p className="mt-4">Detecting your location...</p></div>;
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-red-900/20 p-6 rounded-lg">
          <ErrorIcon className="w-16 h-16 text-red-400" />
          <p className="mt-4 text-lg text-red-300">{error || "Location needed"}</p>
          <button onClick={requestLocation} className="mt-4 bg-cyan-600 px-4 py-2 rounded-lg">Retry</button>
        </div>
      );
    }

    if (viewMode === 'connections') {
        return <ConnectionsView connections={connections} onSelectUser={handleShowProfile} />;
    }

    if (isLoading) return <div className="flex flex-col items-center justify-center h-[70vh]"><LoadingSpinner /><p className="mt-4">Finding adventurers near you...</p></div>;
    if (error) return <div className="flex flex-col items-center justify-center h-64 text-center bg-red-900/20 p-6 rounded-lg"><ErrorIcon className="w-16 h-16 text-red-400" /><p className="mt-4 text-red-300">{error}</p></div>;
    
    return <DiscoverFeed profiles={profiles} onLike={handleLike} onSelectAdventure={handleSelectAdventure} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black overflow-hidden">
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        onSearch={handleSearch} 
        onProfileClick={() => currentUser && handleShowProfile(currentUser)}
        onViewChange={setViewMode}
        currentView={viewMode}
      />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {!currentUser ? (
           <div className="flex flex-col items-center justify-center h-[70vh] text-center">
             <LogoIcon className="h-24 w-24 text-cyan-400 animate-pulse" />
             <h2 className="mt-6 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">Welcome to Adventurly</h2>
             <p className="mt-2 text-lg text-gray-400">Discover your next adventure partner.</p>
           </div>
        ) : renderContent()}
      </main>
      
      <AuthModal isOpen={!currentUser} onLogin={handleLogin} />

      {selectedAdventure && <AdventureDetailsModal adventure={selectedAdventure} onClose={handleCloseModal} onHostClick={handleShowProfile} />}
      {profileModalUser && <UserProfileModal user={profileModalUser} onClose={() => setProfileModalUser(null)} />}
      {currentUser && <AIAssistant userLocation={userLocation} />}
    </div>
  );
}
