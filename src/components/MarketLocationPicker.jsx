import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// 100% Free OpenStreetMap raster tiles (Zero API key required)
const MAP_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const REGIONAL_PRESETS = [
  { name: 'Downtown Market Square', lat: 45.5152, lng: -122.6784, address: 'SW Park Ave & Montgomery St, Portland, OR 97201' },
  { name: 'Pioneer Heritage Plaza', lat: 45.5190, lng: -122.6795, address: '700 SW 6th Avenue, Pavilion Hall, OR 97204' },
  { name: 'Waterfront Esplanade Pier', lat: 45.5080, lng: -122.6680, address: '1020 Waterfront Esplanade, Pier 4, OR 97209' },
  { name: 'Oak Valley Community Park', lat: 45.5320, lng: -122.6950, address: 'Pioneer Park Pavilion, 412 Oak Valley Rd, OR 97034' },
  { name: 'Eastside Greenway Plaza', lat: 45.5140, lng: -122.6620, address: '1540 SE Water Avenue, Pavilion B, OR 97214' },
];

export default function MarketLocationPicker({
  latitude,
  longitude,
  marketName = '',
  address = '',
  onLocationChange,
  onAddressChange,
  showToast,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const initialLat = parseFloat(latitude) || 45.5152;
  const initialLng = parseFloat(longitude) || -122.6784;

  const [currentCoords, setCurrentCoords] = useState({
    lat: initialLat,
    lng: initialLng,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  // Sync internal state when external props change
  useEffect(() => {
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      if (Math.abs(latNum - currentCoords.lat) > 0.00001 || Math.abs(lngNum - currentCoords.lng) > 0.00001) {
        setCurrentCoords({ lat: latNum, lng: lngNum });
        if (markerRef.current) {
          markerRef.current.setLngLat([lngNum, latNum]);
        }
      }
    }
  }, [latitude, longitude]);

  /**
   * Create custom animated pin element for the Market Plaza
   */
  const createMarkerElement = () => {
    const el = document.createElement('div');
    el.className = 'market-pin-marker group cursor-grab active:cursor-grabbing relative select-none';
    el.style.zIndex = '50';
    el.innerHTML = `
      <div class="relative flex flex-col items-center">
        <!-- Floating Tooltip -->
        <div class="absolute -top-10 whitespace-nowrap px-2.5 py-1 bg-[#092813] text-white text-[11px] font-bold rounded-lg shadow-xl pointer-events-none transition-all duration-200 transform scale-95 group-hover:scale-100 flex items-center gap-1 border border-[#2e6b3a]/40">
          <span class="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-ping"></span>
          <span>Market Plaza Pin (Drag or Click to move)</span>
        </div>

        <!-- Outer Glowing Pulse -->
        <span class="absolute -top-1 w-11 h-11 rounded-full bg-primary/25 animate-ping pointer-events-none"></span>

        <!-- Main Pin Head -->
        <div class="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#125224] to-[#092813] text-white shadow-xl flex items-center justify-center border-2 border-white ring-4 ring-primary/40 transition-transform duration-200 group-hover:scale-110">
          <span class="material-symbols-outlined text-[24px]">location_city</span>
        </div>

        <!-- Sharp Pointer Pin Base -->
        <div class="w-3.5 h-3.5 bg-[#092813] rotate-45 -mt-2 border-r border-b border-white/60 shadow-md"></div>
        <div class="w-5 h-1.5 bg-black/30 rounded-full blur-[1px] mt-0.5"></div>
      </div>
    `;
    return el;
  };

  /**
   * Reverse geocode coordinates to update market street address
   */
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const road = data.address?.road || data.address?.pedestrian || data.address?.amenity || '';
          const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.city || '';
          const postcode = data.address?.postcode || '';
          const readable = road && suburb ? `${road}, ${suburb}${postcode ? ` ${postcode}` : ''}` : data.display_name.split(',').slice(0, 3).join(', ');
          
          if (onAddressChange && (!address || address.trim() === '')) {
            onAddressChange(readable);
          }
          return readable;
        }
      }
    } catch {
      // Ignore
    }
    return null;
  };

  /**
   * Handle updating coordinates both locally and notifying parent
   */
  const updateCoordinates = useCallback(
    (lat, lng, fly = false, zoomLevel = null) => {
      const roundedLat = parseFloat(Number(lat).toFixed(6));
      const roundedLng = parseFloat(Number(lng).toFixed(6));

      setCurrentCoords({ lat: roundedLat, lng: roundedLng });

      if (onLocationChange) {
        onLocationChange({ lat: String(roundedLat), lng: String(roundedLng) });
      }

      if (markerRef.current) {
        markerRef.current.setLngLat([roundedLng, roundedLat]);
      }

      if (fly && mapRef.current) {
        mapRef.current.flyTo({
          center: [roundedLng, roundedLat],
          zoom: zoomLevel !== null ? zoomLevel : mapRef.current.getZoom(),
          duration: 900,
        });
      }
    },
    [onLocationChange]
  );

  /**
   * Initialize MapLibre GL Map
   */
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [initialLng, initialLat],
      zoom: 14.5,
      pitch: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    // Create and attach draggable marker
    const markerEl = createMarkerElement();
    const marker = new maplibregl.Marker({
      element: markerEl,
      draggable: true,
      anchor: 'bottom',
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map);

    markerRef.current = marker;

    marker.on('drag', () => {
      const lngLat = marker.getLngLat();
      setCurrentCoords({
        lat: parseFloat(lngLat.lat.toFixed(6)),
        lng: parseFloat(lngLat.lng.toFixed(6)),
      });
    });

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      const lat = parseFloat(lngLat.lat.toFixed(6));
      const lng = parseFloat(lngLat.lng.toFixed(6));
      updateCoordinates(lat, lng, false);
      reverseGeocode(lat, lng);
      showToast?.(`📍 Market pinned to (${lat}, ${lng})`);
    });

    map.on('click', (e) => {
      const lat = parseFloat(e.lngLat.lat.toFixed(6));
      const lng = parseFloat(e.lngLat.lng.toFixed(6));
      updateCoordinates(lat, lng, false);
      reverseGeocode(lat, lng);
      showToast?.(`📍 Market pin moved to (${lat}, ${lng})`);
    });

    map.on('load', () => {
      map.resize();
    });

    const resizeTimer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    }, 250);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(resizeTimer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /**
   * Pin My Current Location
   */
  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      showToast?.('⚠️ Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));

        updateCoordinates(lat, lng, true, 16);
        showToast?.('🎯 Market location pinned to your current GPS position!');

        const addressFound = await reverseGeocode(lat, lng);
        if (addressFound && onAddressChange) {
          onAddressChange(addressFound);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        showToast?.('📍 Click anywhere on the map or search address to pin the market.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  };

  /**
   * Search Street or Plaza Name
   */
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      const query = encodeURIComponent(searchQuery.trim());
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=4`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          setSearchResults(results);
          const first = results[0];
          selectSearchResult(first);
        } else {
          setSearchError('No matching location found. Try searching a plaza or street name.');
        }
      } else {
        setSearchError('Search service temporarily unavailable.');
      }
    } catch {
      setSearchError('Could not reach address search service.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item) => {
    const lat = parseFloat(Number(item.lat).toFixed(6));
    const lng = parseFloat(Number(item.lon).toFixed(6));
    updateCoordinates(lat, lng, true, 15.5);
    if (onAddressChange) {
      onAddressChange(item.display_name.split(',').slice(0, 3).join(', '));
    }
    setSearchResults([]);
    setSearchQuery('');
    showToast?.(`📍 Centered on "${item.display_name.split(',')[0]}"!`);
  };

  const handleSelectPreset = (preset) => {
    updateCoordinates(preset.lat, preset.lng, true, 16);
    if (onAddressChange) {
      onAddressChange(preset.address);
    }
    showToast?.(`📍 Pinned to ${preset.name}!`);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Search Bar & Current GPS Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined text-[17px] text-on-surface-variant absolute left-3 pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search street, plaza, or city to center map..."
              className="w-full pl-8 pr-16 py-1.5 bg-surface-container-low rounded-xl text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/60"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-1 px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-40"
            >
              {isSearching ? '...' : 'Go'}
            </button>
          </div>

          {searchResults.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-outline-variant/30 z-30 overflow-hidden text-xs divide-y divide-outline-variant/15">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectSearchResult(r)}
                  className="w-full text-left px-3 py-2 hover:bg-primary/5 text-on-surface flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  <span className="truncate">{r.display_name}</span>
                </button>
              ))}
            </div>
          )}
          {searchError && (
            <p className="text-[11px] text-amber-600 mt-1 pl-1">{searchError}</p>
          )}
        </form>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="px-3 py-1.5 rounded-xl bg-primary hover:bg-[#1f5028] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-60 flex-shrink-0"
        >
          <span className={`material-symbols-outlined text-[16px] text-[#a3e635] ${isLocating ? 'animate-spin' : ''}`}>
            {isLocating ? 'sync' : 'my_location'}
          </span>
          <span>{isLocating ? 'Locating...' : 'Pin My Location'}</span>
        </button>
      </div>

      {/* Quick Jump Plaza Chips */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px] text-primary">place</span>
          Presets:
        </span>
        {REGIONAL_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className="px-2 py-0.5 rounded-md bg-surface-container hover:bg-primary/10 hover:text-primary text-on-surface text-[10px] font-semibold border border-outline-variant/30 transition-all cursor-pointer"
          >
            {preset.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Map Container Viewport */}
      <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden border-2 border-outline-variant/40 shadow-sm bg-[#e8eee8]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Top Hint Pill */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-outline-variant/30 flex items-center gap-1.5 text-[10px] text-on-surface">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-bold text-primary">Market Pin:</span>
          <span className="text-on-surface-variant">Click map or drag pin to position market</span>
        </div>

        {/* Floating Zoom & Center Controls */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1 shadow-md rounded-xl overflow-hidden bg-white/95 backdrop-blur-md border border-outline-variant/30">
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            title="Zoom In"
            className="w-7 h-7 flex items-center justify-center text-on-surface hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
          <div className="h-[1px] bg-outline-variant/20 w-full" />
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            title="Zoom Out"
            className="w-7 h-7 flex items-center justify-center text-on-surface hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">remove</span>
          </button>
          <div className="h-[1px] bg-outline-variant/20 w-full" />
          <button
            type="button"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.flyTo({ center: [currentCoords.lng, currentCoords.lat], zoom: 15.5 });
              }
            }}
            title="Center on Market Pin"
            className="w-7 h-7 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
          </button>
        </div>

        {/* Floating Live Coordinates HUD Pill (Bottom) */}
        <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-primary/20 flex items-center gap-2 text-xs">
          <span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
          <div>
            <span className="text-[9px] uppercase font-bold text-on-surface-variant block leading-tight">
              Market Coordinates
            </span>
            <span className="font-mono font-bold text-on-surface text-[11px]">
              {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
