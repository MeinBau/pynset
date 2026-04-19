import React, { useEffect, useState } from 'react';
import { APIProvider, Map as GoogleMap, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Place } from '../types';

interface MapProps {
  places: Place[];
  activeStep: number;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

function MapContent({ places }: { places: Place[] }) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !mapsLib || places.length < 2) {
      if (polyline) polyline.setMap(null);
      return;
    }

    if (polyline) polyline.setMap(null);

    const newPolyline = new mapsLib.Polyline({
      path: places.map(p => ({ lat: p.lat, lng: p.lng })),
      geodesic: true,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map
    });

    setPolyline(newPolyline);

    // Fit bounds
    const bounds = new google.maps.LatLngBounds();
    places.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

  }, [map, mapsLib, places]);

  return (
    <>
      {places.map((place, index) => (
        <Marker
          key={place.id}
          position={{ lat: place.lat, lng: place.lng }}
          label={{
            text: (index + 1).toString(),
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      ))}
    </>
  );
}

export default function Map({ places, activeStep }: MapProps) {
  return (
    <div className="relative w-full h-full bg-[#F8F9FA] overflow-hidden rounded-3xl border border-gray-100 shadow-inner">
      <APIProvider apiKey={API_KEY}>
        <GoogleMap
          style={{ width: '100%', height: '100%' }}
          defaultCenter={{ lat: 37.544, lng: 127.056 }}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <MapContent places={places} />
        </GoogleMap>
      </APIProvider>

      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/50 text-[11px] font-medium text-gray-500 flex items-center gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        성수동 실시간 혼잡도: 보통
      </div>
    </div>
  );
}
