import React from 'react';
import { Geolocation } from '../types';

interface InteractiveMapProps {
  location: Geolocation;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ location }) => {
  // In a real app, this would use a library like Mapbox, Google Maps, or Leaflet.
  // For this demo, we'll use a styled placeholder that looks like a map.
  // The URL could point to a static map API if an API key were available.
  const mapImageUrl = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-s-a+990000(${location.longitude},${location.latitude})/${location.longitude},${location.latitude},12,0/600x300?access_token=pk.eyJ1IjoiZGV2LW1ha2VyLWFwcHMiLCJhIjoiY2x5aGtuc29xMGRuMDJqcW53ZWw0dGNqZSJ9.Q21jns-2F26W3c9v_w4ePA`;
  
  const mapStyle: React.CSSProperties = {
      backgroundImage: `url(${mapImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
  };

  return (
    <div className="w-full h-full relative" style={mapStyle}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
        Map data &copy; Mapbox &copy; OpenStreetMap
      </div>
    </div>
  );
};

export default InteractiveMap;
