'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix leaflet default icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createPickerPinIcon() {
  return L.divIcon({
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: linear-gradient(135deg, #0284c7, #38bdf8);
        border: 3px solid #ffffff;
        border-radius: 50% 50% 50% 4px;
        transform: rotate(-45deg);
        box-shadow: 0 10px 20px -3px rgba(2, 132, 199, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5">
            <circle cx="12" cy="12" r="3" fill="#ffffff"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          </svg>
        </div>
      </div>
    `,
    className: 'custom-picker-pin',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });
}

function isValidLatLng(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapFlyTo({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    map.flyTo(position, map.getZoom() || 11, { duration: 0.8 });
    return () => clearTimeout(t);
  }, [position, map]);
  return null;
}

interface MapLocationPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

const REGION_PRESETS = [
  { name: 'Sigiriya', lat: 7.9570, lng: 80.7603 },
  { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
  { name: 'Ella', lat: 6.8667, lng: 81.0466 },
  { name: 'Galle', lat: 6.0535, lng: 80.2210 },
  { name: 'Mirissa', lat: 5.9483, lng: 80.4552 },
  { name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891 },
  { name: 'Jaffna', lat: 9.6615, lng: 80.0255 },
  { name: 'Trincomalee', lat: 8.5874, lng: 81.2152 },
];

export default function MapLocationPicker({
  lat,
  lng,
  onChange,
}: MapLocationPickerProps) {
  const currentLat = isValidLatLng(lat, lng) ? lat : 7.8731;
  const currentLng = isValidLatLng(lat, lng) ? lng : 80.7718;
  const pinIcon = useMemo(() => createPickerPinIcon(), []);

  const eventHandlers = useMemo(
    () => ({
      dragend(e: L.LeafletEvent) {
        const marker = e.target as L.Marker;
        if (marker) {
          const newPos = marker.getLatLng();
          onChange(newPos.lat, newPos.lng);
        }
      },
    }),
    [onChange]
  );

  return (
    <div className="space-y-3">
      {/* Quick Region Jump Presets */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Quick Jump by Region
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {REGION_PRESETS.map((r) => (
            <button
              key={r.name}
              type="button"
              onClick={() => onChange(r.lat, r.lng)}
              className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-800 transition-colors border border-slate-200"
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={9}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <MapFlyTo position={[currentLat, currentLng]} />
          <MapClickHandler onClick={onChange} />

          <Marker
            position={[currentLat, currentLng]}
            icon={pinIcon}
            draggable={true}
            eventHandlers={eventHandlers}
          />
        </MapContainer>

        {/* Floating guidance badge */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 shadow-md flex items-center gap-1.5 pointer-events-none">
          <Navigation className="w-3.5 h-3.5 text-sky-600" />
          <span>Click anywhere or drag pin to adjust coordinates</span>
        </div>
      </div>

      {/* Live coordinates display */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs">
        <span className="text-slate-500 font-medium">Selected Location:</span>
        <span className="font-mono font-bold text-slate-900">
          Lat: {currentLat.toFixed(5)} · Lng: {currentLng.toFixed(5)}
        </span>
      </div>
    </div>
  );
}
