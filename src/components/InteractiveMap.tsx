'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Supercluster from 'supercluster';
import { Place } from '@/types';
import { Star, MapPin, ArrowRight, Plus, Minus, Navigation, Loader2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryIconConfig } from '@/lib/map-markers';
import styles from './InteractiveMap.module.css';

// Fix Leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Coordinate validation to prevent map breaks from corrupted data
function isValidLatLng(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

type MapStyle = 'streets' | 'satellite' | 'terrain';

const MAP_STYLES: Record<
  MapStyle,
  { name: string; url: string; attribution: string; maxZoom: number }
> = {
  streets: {
    name: 'Streets',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
    maxZoom: 19,
  },
  terrain: {
    name: 'Terrain',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, USGS',
    maxZoom: 19,
  },
};

// ━━━ 1. DISTINCT CATEGORY ICONS & STYLING (NO COMPASS) ━━━

function createCategoryMarkerIcon(category: string, isSelected = false) {
  const cfg = categoryIconConfig[category] || {
    bg1: '#0284c7', bg2: '#38bdf8',
    svg: `<path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="white"/>`
  };

  const size = isSelected ? 44 : 38;
  const iconAnchor: [number, number] = [size / 2, size];

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${cfg.bg1}, ${cfg.bg2});
        border: ${isSelected ? '3.5px' : '2.5px'} solid #ffffff;
        border-radius: 50% 50% 50% 4px;
        transform: rotate(-45deg);
        box-shadow: 0 5px 14px rgba(24, 49, 33, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
          <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24">
            ${cfg.svg}
          </svg>
        </div>
      </div>
    `,
    className: 'custom-category-pin',
    iconSize: [size, size],
    iconAnchor: iconAnchor,
    popupAnchor: [0, -size + 4],
  });
}

// ━━━ 2. CLUSTER BADGE ICON GENERATOR ━━━
function createClusterIcon(count: number) {
  let size = 42;
  let bg = 'linear-gradient(135deg, #0284c7, #0369a1)';
  let ring = '#38bdf8';

  if (count >= 15) {
    size = 52;
    bg = 'linear-gradient(135deg, #07111e, #0284c7)';
    ring = '#38bdf8';
  } else if (count >= 6) {
    size = 46;
    bg = 'linear-gradient(135deg, #0369a1, #38bdf8)';
    ring = '#bae6fd';
  }

  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: ${ring};
          opacity: 0.25;

        "></div>
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${bg};
          color: #ffffff;
          border: 3px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: system-ui, -apple-system, sans-serif;
          font-weight: 600;
          font-size: ${size * 0.35}px;
          box-shadow: 0 5px 15px rgba(25, 49, 35, 0.22);
          cursor: pointer;
        ">
          ${count}
        </div>
      </div>
    `,
    className: 'custom-cluster-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// ━━━ 3. LIVE USER LOCATION PULSING BLUE DOT ICON ━━━
function createUserLocationIcon() {
  return L.divIcon({
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #0284c7;
          opacity: 0.35;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: relative;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #0284c7;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.6);
        "></div>
      </div>
    `,
    className: 'live-user-dot',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

// ━━━ 4. CLUSTERED MARKERS ENGINE (SUPERCLUSTER) ━━━
interface GeoPointProps {
  cluster: false;
  placeId: number;
  place: Place;
}

interface ClusterProps {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string | number;
}

function ClusteredMarkers({
  places,
  selectedPlace,
  onSelectPlace,
}: {
  places: Place[];
  selectedPlace?: Place | null;
  onSelectPlace?: (place: Place) => void;
}) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => Math.round(map.getZoom()));
  const [bounds, setBounds] = useState<[number, number, number, number]>(() => {
    const b = map.getBounds();
    return [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
  });

  const updateState = useCallback(() => {
    const b = map.getBounds();
    setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
    setZoom(Math.round(map.getZoom()));
  }, [map]);

  useEffect(() => {
    map.on('moveend', updateState);
    map.on('zoomend', updateState);
    return () => {
      map.off('moveend', updateState);
      map.off('zoomend', updateState);
    };
  }, [map, updateState]);

  // Build Supercluster index
  const supercluster = useMemo(() => {
    const sc = new Supercluster<GeoPointProps>({
      radius: 45,
      minPoints: 3,
      maxZoom: 13,
    });

    const points: GeoJSON.Feature<GeoJSON.Point, GeoPointProps>[] = places
      .filter((p) => isValidLatLng(p.lat, p.lng))
      .map((p) => ({
        type: 'Feature',
        properties: { cluster: false, placeId: p.id, place: p },
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat],
        },
      }));

    sc.load(points);
    return sc;
  }, [places]);

  // Compute clusters for active viewport
  const clusters = useMemo(() => {
    if (!bounds || !supercluster) return [];
    return supercluster.getClusters(bounds, zoom);
  }, [supercluster, bounds, zoom]);

  return (
    <>
      {clusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const isCluster = Boolean(cluster.properties && 'cluster' in cluster.properties && cluster.properties.cluster);

        if (isCluster) {
          const clusterProps = cluster.properties as unknown as ClusterProps;
          const pointCount = clusterProps.point_count;
          const clusterId = (cluster.id ?? clusterProps.cluster_id) as number;

          return (
            <Marker
              key={`cluster-${clusterId}-${pointCount}`}
              position={[lat, lng]}
              icon={createClusterIcon(pointCount)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(clusterId),
                    18
                  );
                  map.setView([lat, lng], expansionZoom, { animate: true });
                },
              }}
            />
          );
        }

        // Individual destination pin
        const pointProps = cluster.properties as unknown as GeoPointProps;
        const place = pointProps.place;
        const isSelected = selectedPlace?.id === place.id;
        const icon = createCategoryMarkerIcon(place.category, isSelected);

        return (
          <Marker
            key={`place-${place.id}`}
            position={[place.lat, place.lng]}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onSelectPlace) {
                  onSelectPlace(place);
                }
              },
            }}
          >
            <Popup className="premium-map-popup" maxWidth={310} minWidth={290}>
              <div className="bg-white rounded-2xl overflow-hidden font-sans border border-slate-200 shadow-2xl flex flex-col">
                {/* Destination image with badges */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={place.image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80'}
                    alt={place.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80';
                    }}
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Category pill */}
                  <span className="absolute bottom-2.5 left-2.5 bg-white/95 text-[#36583e] backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md border border-[#dfe5d7]">
                    {place.category}
                  </span>

                  {/* Province badge */}
                  <span className="absolute top-2.5 left-2.5 bg-black/60 text-white backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-semibold border border-white/20">
                    {place.province}
                  </span>
                </div>

                {/* Body Info */}
                <div className="p-4 flex flex-col">
                  <h4 className="text-slate-900 font-extrabold text-base leading-tight mb-1">
                    {place.name}
                  </h4>

                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-2.5">
                    <MapPin size={12} className="text-sky-600 shrink-0" />
                    <span className="truncate">{place.location}</span>
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3.5">
                    {place.short_description}
                  </p>

                  {/* Rating & Review info badge */}
                  <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200/80 rounded-xl px-2.5 py-1.5 mb-3.5">
                    <div className="flex items-center gap-1 text-amber-800 font-bold text-xs">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span>{place.rating.toFixed(1)}</span>
                      <span className="text-amber-400">·</span>
                      <span className="text-slate-900 font-medium">
                        {place.rating >= 4.8 ? 'Exceptional' : 'Recommended'}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {place.review_count.toLocaleString()} reviews
                    </span>
                  </div>

                  {/* View Details Button */}
                  <a
                    href={`/places/${place.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#294e39] hover:bg-[#203e2e] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 shadow-md shadow-[#294e39]/10 active:scale-95 cursor-pointer"
                  >
                    <span>View Destination</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

// ━━━ 5. MAP CONTROLLER (BOUNDS & SELECTION) ━━━
function MapController({
  places,
  selectedPlace,
  center,
  zoom,
  recenterTrigger,
}: {
  places: Place[];
  selectedPlace?: Place | null;
  center?: [number, number];
  zoom?: number;
  recenterTrigger?: number;
}) {
  const map = useMap();

  // Invalidate map size on mount and window resize
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 600);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  // Handle position & bounds updates
  useEffect(() => {
    if (selectedPlace && isValidLatLng(selectedPlace.lat, selectedPlace.lng)) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 13, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    } else if (places.length === 1 && isValidLatLng(places[0].lat, places[0].lng)) {
      map.setView([places[0].lat, places[0].lng], zoom || 13);
    } else {
      const validPlaces = places.filter((p) => isValidLatLng(p.lat, p.lng));
      if (validPlaces.length > 0) {
        const bounds = L.latLngBounds(validPlaces.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
      } else if (center) {
        map.setView(center, zoom || 7.5);
      }
    }
  }, [places, selectedPlace, center, zoom, recenterTrigger, map]);

  return null;
}

// ━━━ 6. CUSTOM ZOOM CONTROLS (BOTTOM-LEFT) ━━━
function ZoomControls() {
  const map = useMap();

  return (
    <div className="absolute bottom-6 left-4 z-[400] flex flex-col bg-white/85 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        className="p-2.5 text-slate-700 hover:text-[#36583e] hover:bg-slate-50 transition-colors border-b border-slate-100 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        className="p-2.5 text-slate-700 hover:text-[#36583e] hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}

// ━━━ 7. UNIFIED TOP CONTROLS TOOLBAR (TOP-RIGHT) ━━━
function MapTopToolbar({
  mapStyle,
  setMapStyle,
  onResetView,
  userLocation,
  setUserLocation,
}: {
  mapStyle: MapStyle;
  setMapStyle: (s: MapStyle) => void;
  onResetView?: () => void;
  userLocation: [number, number] | null;
  setUserLocation: (coords: [number, number] | null) => void;
}) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = useCallback(() => {
    if (userLocation) {
      map.flyTo(userLocation, 14, { duration: 1.2 });
      toast.success('Centered on your location 📍');
      return;
    }

    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setIsLocating(false);
        map.flyTo(coords, 14, { duration: 1.5 });
        toast.success('Found your location! 📍');
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Location access denied. Please enable GPS permissions.');
        } else if (err.code === err.TIMEOUT) {
          toast.error('Location request timed out. Please try again.');
        } else {
          toast.error('Could not determine your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [map, userLocation, setUserLocation]);

  return (
    <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-[400] flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[calc(100vw-1.5rem)]">
      {/* 1. Map Layer Switcher */}
      <div className="flex items-center bg-white/85 backdrop-blur-md rounded-xl p-0.5 sm:p-1 border border-slate-200/90 shadow-md">
        <button
          type="button"
          onClick={() => setMapStyle('streets')}
          aria-pressed={mapStyle === 'streets'}
          className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
            mapStyle === 'streets'
              ? 'bg-[#294e39] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Streets
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('satellite')}
          aria-pressed={mapStyle === 'satellite'}
          className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
            mapStyle === 'satellite'
              ? 'bg-[#294e39] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Satellite
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('terrain')}
          aria-pressed={mapStyle === 'terrain'}
          className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
            mapStyle === 'terrain'
              ? 'bg-[#294e39] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Terrain
        </button>
      </div>

      {/* 2. Whole Island Recenter Button (if onResetView provided) */}
      {onResetView && (
        <button
          type="button"
          onClick={onResetView}
          title="Reset map view to whole island"
          aria-label="Show whole island"
          className="bg-white/85 hover:bg-slate-50 text-slate-800 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-md border border-slate-200/90 transition-all hover:scale-105 active:scale-95 text-[11px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5 backdrop-blur-md cursor-pointer h-[30px] sm:h-[34px]"
        >
          <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#36583e]" />
          <span className="hidden sm:inline">Whole Island</span>
        </button>
      )}

      {/* 3. Locate Me / Near Me Button */}
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={isLocating}
        title="Find my location"
        aria-label="Locate me"
        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-md border transition-all hover:scale-105 active:scale-95 text-[11px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5 backdrop-blur-md cursor-pointer h-[30px] sm:h-[34px] ${
          userLocation
            ? 'bg-[#edf3e9] border-[#becdb5] text-[#36583e] ring-2 ring-[#294e39]/20'
            : 'bg-white/85 hover:bg-slate-50 border-slate-200/90 text-slate-800'
        }`}
      >
        {isLocating ? (
          <>
            <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-[#36583e]" />
            <span>Locating...</span>
          </>
        ) : userLocation ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#edf3e9]0"></span>
            </span>
            <span>My GPS</span>
          </>
        ) : (
          <>
            <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#36583e] fill-sky-500/20" />
            <span>Locate Me</span>
          </>
        )}
      </button>
    </div>
  );
}

// ━━━ 8. MAIN INTERACTIVE MAP COMPONENT ━━━
interface InteractiveMapProps {
  places: Place[];
  selectedPlace?: Place | null;
  onSelectPlace?: (place: Place) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  recenterTrigger?: number;
  onResetView?: () => void;
}

export default function InteractiveMap({
  places,
  selectedPlace,
  onSelectPlace,
  center = [7.8731, 80.7718], // Sri Lanka geographic center
  zoom = 7.5,
  height = '100%',
  recenterTrigger = 0,
  onResetView,
}: InteractiveMapProps) {
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const validPlaces = useMemo(() => {
    return places.filter((p) => isValidLatLng(p.lat, p.lng));
  }, [places]);

  return (
    <div className={`${styles.map} relative w-full overflow-hidden bg-[#e7eee2]`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          url={MAP_STYLES[mapStyle].url}
          attribution={MAP_STYLES[mapStyle].attribution}
          maxZoom={MAP_STYLES[mapStyle].maxZoom}
        />

        <MapController
          places={validPlaces}
          selectedPlace={selectedPlace}
          center={center}
          zoom={zoom}
          recenterTrigger={recenterTrigger}
        />

        {/* Zoom Controls at bottom-left */}
        <ZoomControls />

        {/* Unified Top Controls Toolbar at top-right */}
        <MapTopToolbar
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
          onResetView={onResetView}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
        />

        {/* Clustered Markers (Pins + Cluster Badges) */}
        <ClusteredMarkers
          places={validPlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={onSelectPlace}
        />

        {/* Live User Location Pulsing Blue Dot */}
        {userLocation && (
          <Marker position={userLocation} icon={createUserLocationIcon()}>
            <Popup className="premium-map-popup">
              <div className="p-3 text-center">
                <div className="font-semibold text-sm text-slate-900 mb-0.5">
                  📍 You Are Here
                </div>
                <div className="text-xs text-slate-500">
                  Live GPS position detected
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
