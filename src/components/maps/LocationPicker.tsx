'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Search, Trash2, Map as MapIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type SelectedLocation = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  mapUrl: string;
};

interface LocationPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationChange: (location: SelectedLocation | null) => void;
  disabled?: boolean;
}

// Import dinámico del mapa de Leaflet para evitar problemas de SSR con window
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
      <Loader2 className="w-8 h-8 animate-spin mb-2" />
      <span className="text-sm">Cargando mapa...</span>
    </div>
  ),
});

export default function LocationPicker({
  initialLatitude,
  initialLongitude,
  onLocationChange,
  disabled
}: LocationPickerProps) {
  // Centro inicial de sugerencia: Asunción, Paraguay
  const defaultCenter = { 
    lat: initialLatitude || -25.2637, 
    lng: initialLongitude || -57.5759 
  };

  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number} | null>(null);
  const [currentLocation, setCurrentLocation] = useState<SelectedLocation | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState('');

  const updateLocationState = (lat: number, lng: number, address: string = '') => {
    setMarkerPosition({ lat, lng });
    
    const loc: SelectedLocation = {
      latitude: lat,
      longitude: lng,
      formattedAddress: address,
      mapUrl: `https://www.openstreetmap.org/?mlat=${lat.toFixed(6)}&mlon=${lng.toFixed(6)}#map=18/${lat.toFixed(6)}/${lng.toFixed(6)}`
    };
    
    setCurrentLocation(loc);
    onLocationChange(loc);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || '';
        updateLocationState(lat, lng, address);
      } else {
        updateLocationState(lat, lng, ''); // Falla silenciosa, conservamos coords
      }
    } catch (e) {
      updateLocationState(lat, lng, '');
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    updateLocationState(lat, lng, 'Obteniendo dirección...');
    reverseGeocode(lat, lng);
  };

  const handleMarkerDragEnd = (lat: number, lng: number) => {
    updateLocationState(lat, lng, 'Obteniendo dirección...');
    reverseGeocode(lat, lng);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setLocationError('');
    
    try {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      // Límite de 5 resultados, prioridad Paraguay
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodedQuery}&countrycodes=py&addressdetails=1&limit=5`);
      
      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const firstResult = results[0];
          const lat = parseFloat(firstResult.lat);
          const lng = parseFloat(firstResult.lon);
          
          setCenter({ lat, lng });
          updateLocationState(lat, lng, firstResult.display_name);
        } else {
          setLocationError('No se encontraron resultados para esta búsqueda.');
        }
      } else {
        setLocationError('Hubo un error al buscar la dirección.');
      }
    } catch (e) {
      setLocationError('No se pudo conectar al servicio de búsqueda.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleGetCurrentLocation = () => {
    setLocationError('');
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Tu navegador no admite geolocalización.');
      return;
    }

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setLocationError('Se requiere conexión segura (HTTPS) para detectar tu ubicación.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setCenter({ lat, lng });
        handleMapClick(lat, lng); // Reutilizamos lógica de reverse geocoding
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Permiso rechazado. Buscá tu zona o tocá el mapa.');
        } else if (error.code === error.TIMEOUT) {
          setLocationError('Tiempo de espera agotado. Intentá buscar tu dirección.');
        } else {
          setLocationError('No pudimos acceder a tu ubicación.');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleClearLocation = () => {
    setMarkerPosition(null);
    setSearchQuery('');
    setCurrentLocation(null);
    onLocationChange(null);
    setLocationError('');
  };

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex flex-col space-y-3 p-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-gray-900">Ubicación del proyecto</h3>
        <p className="text-xs text-gray-500">Marcá en el mapa dónde se realizará el trabajo. Este dato es opcional.</p>
      </div>

      {/* Controles: Buscador y Ubicación Actual */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 flex">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            type="text" 
            placeholder="Buscar dirección o zona..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 bg-white w-full h-12 sm:h-10 rounded-r-none border-r-0"
            disabled={disabled || isSearching}
          />
          <Button 
            type="button" 
            onClick={handleSearch}
            disabled={disabled || isSearching || !searchQuery.trim()}
            className="h-12 sm:h-10 rounded-l-none bg-blue-600 hover:bg-blue-700 text-white px-4"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
          </Button>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGetCurrentLocation}
          disabled={disabled || isLocating}
          className="h-12 sm:h-10 bg-white border-gray-300 whitespace-nowrap"
        >
          {isLocating ? (
             <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Detectando...</>
          ) : (
            <><MapPin className="w-4 h-4 mr-2 text-blue-500" /> Usar mi ubicación</>
          )}
        </Button>
      </div>
      
      {locationError && (
        <p className="text-xs text-red-500">{locationError}</p>
      )}

      {/* Contenedor del Mapa */}
      <div className="relative w-full h-[280px] sm:h-[220px] bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
        <LeafletMap 
          center={center}
          markerPosition={markerPosition}
          onMapClick={handleMapClick}
          onMarkerDragEnd={handleMarkerDragEnd}
        />
      </div>

      {/* Detalles de la ubicación seleccionada */}
      {currentLocation && (
        <div className="bg-white border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 flex-shrink-0"></span>
              Ubicación seleccionada
            </p>
            {currentLocation.formattedAddress && (
              <p className="text-xs text-gray-600 truncate mt-1">
                {currentLocation.formattedAddress}
              </p>
            )}
            <p className="text-[10px] text-gray-400 mt-0.5">
              Lat: {currentLocation.latitude.toFixed(6)} | Lng: {currentLocation.longitude.toFixed(6)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a 
              href={currentLocation.mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded transition-colors"
            >
              Abrir ubicación en el mapa
            </a>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleClearLocation}
              disabled={disabled}
              className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 px-2"
              title="Borrar ubicación"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
