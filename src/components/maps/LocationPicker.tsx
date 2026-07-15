'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Trash2, Map as MapIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type SelectedLocation = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  googleMapsUrl: string;
};

interface LocationPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationChange: (location: SelectedLocation | null) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    __googleMapsPromise?: Promise<void>;
  }
}

export default function LocationPicker({
  initialLatitude,
  initialLongitude,
  onLocationChange,
  disabled
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const autocompleteInstance = useRef<any>(null);
  const geocoderInstance = useRef<any>(null);
  const clickListener = useRef<any>(null);

  const [currentLocation, setCurrentLocation] = useState<SelectedLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // 1. Cargar Script de Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setLoadError(true);
      return;
    }

    if (typeof window === 'undefined') return;

    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    if (!window.__googleMapsPromise) {
      window.__googleMapsPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        // Usamos la API semanal para soportar AdvancedMarkerElement y librerías modernas
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Error al cargar Google Maps'));
        document.head.appendChild(script);
      });
    }

    window.__googleMapsPromise
      .then(() => setMapLoaded(true))
      .catch(() => setLoadError(true));
  }, []);

  // 2. Inicializar Mapa cuando el script y el DOM estén listos
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return;
    if (mapInstance.current) return; // Evitar reinicializar

    // Centro inicial de sugerencia: Asunción, Paraguay
    const defaultCenter = { 
      lat: initialLatitude || -25.2637, 
      lng: initialLongitude || -57.5759 
    };

    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      mapId: mapId,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
    });

    geocoderInstance.current = new window.google.maps.Geocoder();

    // Configurar Autocomplete
    if (searchInputRef.current) {
      autocompleteInstance.current = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        componentRestrictions: { country: 'py' },
        fields: ['geometry', 'formatted_address', 'name'],
      });

      autocompleteInstance.current.addListener('place_changed', () => {
        const place = autocompleteInstance.current.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';
        
        updateLocationState(lat, lng, address);
        mapInstance.current.setCenter(place.geometry.location);
        mapInstance.current.setZoom(16);
      });
    }

    // Configurar Click Listener
    clickListener.current = mapInstance.current.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handleMapClick(lat, lng);
    });

    // Cleanup
    return () => {
      if (clickListener.current) {
        window.google.maps.event.removeListener(clickListener.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  // Actualizador de estado interno y notificador
  const updateLocationState = (lat: number, lng: number, address: string = '') => {
    if (!window.google) return;

    // Actualizar o crear marcador
    if (!markerInstance.current) {
      if (window.google.maps.marker?.AdvancedMarkerElement) {
        markerInstance.current = new window.google.maps.marker.AdvancedMarkerElement({
          map: mapInstance.current,
          position: { lat, lng },
          gmpDraggable: true,
        });

        // Escuchar arrastre del marcador (Drag End)
        markerInstance.current.addListener('dragend', (event: any) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          handleMapClick(newLat, newLng); // Reutilizamos lógica de click para reverse geocoding
        });
      } else {
        // Fallback si no soporta AdvancedMarkerElement
        markerInstance.current = new window.google.maps.Marker({
          map: mapInstance.current,
          position: { lat, lng },
          draggable: true,
        });

        markerInstance.current.addListener('dragend', (event: any) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          handleMapClick(newLat, newLng);
        });
      }
    } else {
      markerInstance.current.position = { lat, lng };
    }

    const loc: SelectedLocation = {
      latitude: lat,
      longitude: lng,
      formattedAddress: address,
      googleMapsUrl: `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`
    };
    
    setCurrentLocation(loc);
    onLocationChange(loc);
  };

  // Click handler + Reverse Geocoding
  const handleMapClick = (lat: number, lng: number) => {
    if (!geocoderInstance.current) {
      updateLocationState(lat, lng, '');
      return;
    }

    geocoderInstance.current.geocode(
      { location: { lat, lng } },
      (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          updateLocationState(lat, lng, results[0].formatted_address);
        } else {
          updateLocationState(lat, lng, '');
        }
      }
    );
  };

  // Botón "Usar mi ubicación actual"
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
        
        if (mapInstance.current) {
          mapInstance.current.setCenter({ lat, lng });
          mapInstance.current.setZoom(16);
        }
        handleMapClick(lat, lng);
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
    if (markerInstance.current) {
      markerInstance.current.map = null;
      markerInstance.current = null;
    }
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    setCurrentLocation(null);
    onLocationChange(null);
    setLocationError('');
  };

  // Pantalla de Fallback / Error
  if (loadError) {
    return (
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h3 className="text-sm font-semibold text-amber-800 mb-1 flex items-center">
          <MapIcon className="w-4 h-4 mr-2" />
          No pudimos cargar el mapa interactivo
        </h3>
        <p className="text-xs text-amber-700">
          Podés escribir una referencia o pegar un enlace de Google Maps en el campo de observaciones debajo.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex flex-col space-y-3 p-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-gray-900">Ubicación del proyecto</h3>
        <p className="text-xs text-gray-500">Marcá en el mapa dónde se realizará el trabajo. Este dato es opcional.</p>
      </div>

      {/* Controles: Buscador y Ubicación Actual */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            ref={searchInputRef}
            type="text" 
            placeholder="Buscar dirección o zona..." 
            className="pl-9 bg-white w-full h-12 sm:h-10"
            disabled={disabled || !mapLoaded}
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGetCurrentLocation}
          disabled={disabled || isLocating || !mapLoaded}
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
      <div className="relative w-full h-[280px] sm:h-[360px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
        {!mapLoaded && (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm">Cargando mapa...</span>
          </div>
        )}
        <div ref={mapRef} className="absolute inset-0 w-full h-full" />
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
              href={currentLocation.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded transition-colors"
            >
              Ver en Google Maps
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
