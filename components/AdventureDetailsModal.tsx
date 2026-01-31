import React from 'react';
import { Adventure, User } from '../types';
import { XIcon, LocationIcon, ClipboardListIcon, CheckCircleIcon, UserCircleIcon, LinkIcon, CalendarIcon, UsersIcon, DollarSignIcon } from './Icons';
import InteractiveMap from './InteractiveMap';

interface AdventureDetailsModalProps {
  adventure: Adventure;
  onClose: () => void;
  onHostClick: (host: User) => void;
}

const AdventureDetailsModal: React.FC<AdventureDetailsModalProps> = ({ adventure, onClose, onHostClick }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="bg-gray-900 rounded-lg shadow-2xl shadow-purple-500/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 bg-gray-800">
            <InteractiveMap location={adventure.location.coordinates} />
            <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors" aria-label="Close modal"><XIcon className="h-6 w-6" /></button>
        </div>

        <div className="p-6 sm:p-8">
          <div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">{adventure.title}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-400 mt-2 text-sm">
                <div className="flex items-center"><LocationIcon className="h-4 w-4 mr-1.5" />{adventure.location.name}</div>
                <div className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1.5" />{adventure.dateTime}</div>
                <div className="flex items-center"><UsersIcon className="h-4 w-4 mr-1.5" />{adventure.attendees.length} / {adventure.capacity} going</div>
                <div className="flex items-center"><DollarSignIcon className="h-4 w-4 mr-1.5" />{adventure.price ? `$${adventure.price}` : 'Free'}</div>
              </div>
            </div>

          <p className="mt-4 text-gray-300">{adventure.description}</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold text-white flex items-center mb-4"><ClipboardListIcon className="h-6 w-6 mr-3 text-cyan-400"/>Itinerary</h3>
                <ul className="space-y-3">
                    {adventure.itinerary.map((item, index) => (<li key={index} className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-green-400 mt-1 mr-3 flex-shrink-0" /><span className="text-gray-400">{item}</span></li>))}
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-white flex items-center mb-4"><ClipboardListIcon className="h-6 w-6 mr-3 text-cyan-400"/>Gear List</h3>
                <ul className="space-y-3">
                    {adventure.gearList.map((item, index) => (<li key={index} className="flex items-start"><CheckCircleIcon className="h-5 w-5 text-green-400 mt-1 mr-3 flex-shrink-0" /><span className="text-gray-400">{item}</span></li>))}
                </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <h3 className="text-xl font-semibold text-white flex items-center mb-4"><UserCircleIcon className="h-6 w-6 mr-3 text-cyan-400"/>Host</h3>
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => onHostClick(adventure.host)}>
                <img src={adventure.host.avatarUrl} alt={adventure.host.name} className="h-16 w-16 rounded-full object-cover border-2 border-cyan-500" />
                <div className="ml-4"><p className="text-lg font-bold text-white">{adventure.host.name}</p><p className="text-sm text-gray-400">{adventure.host.bio}</p></div>
            </div>
          </div>
          
          {adventure.sources && adventure.sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <h3 className="text-xl font-semibold text-white flex items-center mb-4"><LinkIcon className="h-6 w-6 mr-3 text-cyan-400"/>Sources</h3>
              <ul className="space-y-2">{adventure.sources.map((source, index) => (<li key={index}><a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-sm truncate block" title={source.title}>{source.title || source.uri}</a></li>))}</ul>
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-gray-800/50 flex justify-end"><button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105">Request to Join</button></div>
      </div>
    </div>
  );
};
export default AdventureDetailsModal;
