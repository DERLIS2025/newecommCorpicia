'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  center: { lat: number; lng: number };
  markerPosition: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerDragEnd: (lat: number, lng: number) => void;
}

const customIconHtml = `
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill="#EF4444" stroke="#B91C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="12" cy="10" r="3" fill="white"/>
</svg>
`;

export default function LeafletMap({
  center,
  markerPosition,
  onMapClick,
  onMarkerDragEnd
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current).setView([center.lat, center.lng], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center smoothly
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng]);
    }
  }, [center]);

  // Update marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (markerPosition) {
      if (!markerInstanceRef.current) {
        const customIcon = L.divIcon({
          html: customIconHtml,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        markerInstanceRef.current = L.marker([markerPosition.lat, markerPosition.lng], {
          icon: customIcon,
          draggable: true
        }).addTo(mapInstanceRef.current);

        markerInstanceRef.current.on('dragend', (e) => {
          const newPos = e.target.getLatLng();
          onMarkerDragEnd(newPos.lat, newPos.lng);
        });
      } else {
        markerInstanceRef.current.setLatLng([markerPosition.lat, markerPosition.lng]);
      }
    } else {
      // Remove marker if position is null
      if (markerInstanceRef.current) {
        markerInstanceRef.current.remove();
        markerInstanceRef.current = null;
      }
    }
  }, [markerPosition, onMarkerDragEnd]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ zIndex: 0 }} // Prevent Leaflet from overlapping dropdowns/modals
    />
  );
}
