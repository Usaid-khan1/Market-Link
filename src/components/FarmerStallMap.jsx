import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getRoute, formatDistance, formatDuration } from '../services/routingService';

// 100% Free OpenStreetMap tiles (No API key required, zero watermarks)
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

// Default center in case stalls have no valid coordinates initially
const DEFAULT_CENTER = [-122.418, 37.779]; // Downtown Farmers Market vicinity
const DEFAULT_ZOOM = 13.5;

export default function FarmerStallMap({
  stalls = [],
  activeBooking = null,
  onBookStall,
  onViewStallDetails,
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const customerMarkerRef = useRef(null);

  // Map state
  const [selectedStall, setSelectedStall] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Routing state
  const [isRouting, setIsRouting] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [navigatingStall, setNavigatingStall] = useState(null);

  /**
   * Safe helper to calculate route and display on map
   */
  const calculateAndShowRoute = useCallback(
    async (custLng, custLat, targetStall) => {
      if (!mapRef.current || !targetStall?.latitude || !targetStall?.longitude) return;

      setIsRouting(true);
      setRouteError(null);
      setNavigatingStall(targetStall);

      try {
        const result = await getRoute(
          custLng,
          custLat,
          targetStall.longitude,
          targetStall.latitude
        );

        if (!result.success || !result.geometry) {
          setRouteError(result.error || 'Unable to calculate the pickup route. Please try again.');
          setRouteInfo(null);
          clearRouteLayer();
          return;
        }

        setRouteInfo({
          distanceFormatted: result.distanceFormatted,
          durationFormatted: result.durationFormatted,
          distanceMeters: result.distanceMeters,
          durationSeconds: result.durationSeconds,
          stallName: targetStall.stall_name,
          address: targetStall.address,
        });

        // Add or update route source in MapLibre
        const map = mapRef.current;
        const geojsonData = {
          type: 'Feature',
          properties: {},
          geometry: result.geometry,
        };

        if (map.getSource('pickup-route')) {
          map.getSource('pickup-route').setData(geojsonData);
        } else {
          map.addSource('pickup-route', {
            type: 'geojson',
            data: geojsonData,
          });

          // Outer glowing casing line
          map.addLayer({
            id: 'pickup-route-casing',
            type: 'line',
            source: 'pickup-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#092813',
              'line-width': 7,
              'line-opacity': 0.75,
            },
          });

          // Inner vibrant primary line
          map.addLayer({
            id: 'pickup-route-line',
            type: 'line',
            source: 'pickup-route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#2e6b3a',
              'line-width': 4.5,
              'line-opacity': 0.95,
            },
          });
        }

        // Fit map bounds around customer and booked stall
        const bounds = new maplibregl.LngLatBounds();
        bounds.extend([custLng, custLat]);
        bounds.extend([targetStall.longitude, targetStall.latitude]);

        // Also extend bounds along route coordinates for perfect padding
        if (result.geometry.coordinates && Array.isArray(result.geometry.coordinates)) {
          result.geometry.coordinates.forEach((coord) => bounds.extend(coord));
        }

        map.fitBounds(bounds, {
          padding: { top: 70, bottom: 70, left: 60, right: 60 },
          maxZoom: 16,
          duration: 1000,
        });
      } catch (err) {
        console.error('Failed to draw route:', err);
        setRouteError('Unable to calculate the pickup route. Please try again.');
      } finally {
        setIsRouting(false);
      }
    },
    []
  );

  const clearRouteLayer = () => {
    const map = mapRef.current;
    if (!map) return;
    if (map.getLayer('pickup-route-line')) map.removeLayer('pickup-route-line');
    if (map.getLayer('pickup-route-casing')) map.removeLayer('pickup-route-casing');
    if (map.getSource('pickup-route')) map.removeSource('pickup-route');
    setRouteInfo(null);
    setNavigatingStall(null);
  };

  /**
   * Request user geolocation and optionally start route to a stall
   */
  const requestCustomerLocation = useCallback(
    (targetStall = null) => {
      setLocationError(null);

      if (!('geolocation' in navigator)) {
        setLocationError('Geolocation is not supported by your browser.');
        return;
      }

      setLocatingUser(true);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocatingUser(false);
          const cust = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          };
          setCustomerLocation(cust);
          updateCustomerMarker(cust.longitude, cust.latitude);

          if (targetStall) {
            calculateAndShowRoute(cust.longitude, cust.latitude, targetStall);
          } else if (mapRef.current) {
            mapRef.current.flyTo({
              center: [cust.longitude, cust.latitude],
              zoom: 14.5,
              duration: 800,
            });
          }
        },
        (err) => {
          setLocatingUser(false);
          if (err.code === err.PERMISSION_DENIED) {
            setLocationError('Location permission denied. Please allow location access to calculate the pickup route.');
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setLocationError('Location information is currently unavailable.');
          } else {
            setLocationError('Unable to obtain your location. Please check your browser settings.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    },
    [calculateAndShowRoute]
  );

  // Helper to use simulated nearby customer location for instant testing without browser GPS prompts
  const useSimulatedCustomerLocation = (targetStall = null) => {
    setLocationError(null);
    // Position ~1.1 km north-east of the farmers market
    const sim = {
      longitude: -122.411,
      latitude: 37.788,
    };
    setCustomerLocation(sim);
    updateCustomerMarker(sim.longitude, sim.latitude);

    const stallToUse = targetStall || selectedStall || (stalls && stalls[0]);
    if (stallToUse) {
      calculateAndShowRoute(sim.longitude, sim.latitude, stallToUse);
    }
  };

  /**
   * Render or update customer blue pulse marker
   */
  const updateCustomerMarker = (lng, lat) => {
    if (!mapRef.current) return;

    if (customerMarkerRef.current) {
      customerMarkerRef.current.setLngLat([lng, lat]);
      return;
    }

    // Create custom pulsing blue marker element
    const el = document.createElement('div');
    el.className = 'customer-map-marker';
    el.innerHTML = `
      <div class="relative flex items-center justify-center cursor-pointer">
        <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-60"></span>
        <span class="relative inline-flex rounded-full h-5 w-5 bg-[#0284c7] border-2 border-white shadow-md items-center justify-center">
          <span class="w-2 h-2 rounded-full bg-white"></span>
        </span>
      </div>
    `;

    const popup = new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(`
      <div style="font-family: 'Rubik', sans-serif; padding: 4px 6px;">
        <p style="font-weight: 700; font-size: 11px; color: #0284c7; margin: 0;">You are here</p>
        <p style="font-size: 10px; color: #64748b; margin: 2px 0 0 0;">Customer Pickup Origin</p>
      </div>
    `);

    customerMarkerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(mapRef.current);
  };

  /**
   * 1. Initialize MapLibre GL Map once
   */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitchWithRotate: false,
      attributionControl: true,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Fit stalls bounds once loaded
      fitAllStalls();
    });

    return () => {
      if (markersRef.current) {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
      }
      if (customerMarkerRef.current) {
        customerMarkerRef.current.remove();
        customerMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /**
   * 2. Fit all stalls on the map
   */
  const fitAllStalls = useCallback(() => {
    const map = mapRef.current;
    if (!map || !stalls || stalls.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    let hasCoords = false;

    stalls.forEach((s) => {
      if (s.latitude && s.longitude) {
        bounds.extend([s.longitude, s.latitude]);
        hasCoords = true;
      }
    });

    if (customerLocation) {
      bounds.extend([customerLocation.longitude, customerLocation.latitude]);
    }

    if (hasCoords) {
      map.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 15,
        duration: 900,
      });
    }
  }, [stalls, customerLocation]);

  /**
   * 3. Update Stall Markers whenever stalls data changes
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !stalls) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    stalls.forEach((stall) => {
      if (!stall.latitude || !stall.longitude) return;

      const isBooked = activeBooking && (activeBooking.farmerId === stall.farmer_id || activeBooking.stallId === stall.id);
      const isSelected = selectedStall && selectedStall.id === stall.id;

      // Custom stall marker element
      const el = document.createElement('div');
      el.className = 'farmer-stall-marker cursor-pointer transition-transform duration-200 hover:scale-110';
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 ${
            isBooked
              ? 'bg-[#15803d] border-[#b9f474] ring-4 ring-[#b9f474]/40 text-white'
              : isSelected
              ? 'bg-[#125224] border-white ring-2 ring-[#125224]/30 text-white'
              : 'bg-white border-[#125224] text-[#125224]'
          }">
            <span class="material-symbols-outlined text-[20px]">
              ${isBooked ? 'verified' : 'agriculture'}
            </span>
          </div>
          <span class="absolute -bottom-1 w-2 h-2 bg-[#125224] rotate-45"></span>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedStall(stall);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([stall.longitude, stall.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [stalls, selectedStall, activeBooking]);

  /**
   * 4. React to incoming activeBooking changes
   */
  useEffect(() => {
    if (!activeBooking || !stalls || stalls.length === 0) return;

    // Find the booked stall
    const booked = stalls.find(
      (s) => s.id === activeBooking.stallId || s.farmer_id === activeBooking.farmerId || s.stall_name === activeBooking.farmer
    );

    if (booked) {
      setSelectedStall(booked);
      // If customer location is already known, trigger route calculation immediately
      if (customerLocation) {
        calculateAndShowRoute(customerLocation.longitude, customerLocation.latitude, booked);
      } else {
        // Automatically request browser location or suggest simulated location
        requestCustomerLocation(booked);
      }
    }
  }, [activeBooking, stalls, customerLocation, calculateAndShowRoute, requestCustomerLocation]);

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-outline-variant/30 shadow-md bg-surface ${className}`}
      style={{ fontFamily: "'Rubik', sans-serif" }}
    >
      {/* Top Banner / Map Header */}
      <div className="px-5 py-3.5 bg-white border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[19px]">map</span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-on-surface leading-tight flex items-center gap-2">
              Interactive Farmer Stall Map
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant">
                Live Directory
              </span>
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              Click any stall pin to view available harvest, reserve stock, or get in-app driving directions.
            </p>
          </div>
        </div>

        {/* Map Header Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Fit all stalls */}
          <button
            type="button"
            onClick={fitAllStalls}
            title="Fit All Stalls"
            className="px-2.5 py-1.5 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container hover:border-primary/40 text-on-surface text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">crop_free</span>
            <span className="hidden sm:inline">Fit Stalls</span>
          </button>

          {/* Current location button */}
          <button
            type="button"
            onClick={() => requestCustomerLocation(selectedStall)}
            disabled={locatingUser}
            title="Use my location for navigation"
            className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
              {locatingUser ? 'sync' : 'my_location'}
            </span>
            <span>{locatingUser ? 'Locating...' : 'My Location'}</span>
          </button>
        </div>
      </div>

      {/* Geolocation Notice / Error Banner if permission denied */}
      {locationError && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-amber-600">location_off</span>
            <span>{locationError}</span>
          </div>
          <button
            type="button"
            onClick={() => useSimulatedCustomerLocation(selectedStall)}
            className="px-2.5 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 font-bold text-[11px] text-amber-900 cursor-pointer underline flex-shrink-0"
          >
            Use Demo Location
          </button>
        </div>
      )}

      {/* Map Container Viewport */}
      <div className="relative w-full h-[460px] sm:h-[520px] bg-[#f0f4f0]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Controls: Zoom In, Zoom Out, Locate */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 shadow-md rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md border border-outline-variant/30">
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            title="Zoom In"
            className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <div className="h-[1px] bg-outline-variant/20 w-full" />
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            title="Zoom Out"
            className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
        </div>

        {/* Floating Route Info HUD Card */}
        {routeInfo && (
          <div className="absolute top-4 left-4 z-10 max-w-[340px] bg-white/95 backdrop-blur-md border border-[#125224]/30 rounded-2xl p-4 shadow-xl animate-fade-in">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-outline-variant/20">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-wider">
                  Pickup Navigation Route
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1 truncate">
                  {routeInfo.stallName}
                </h4>
                <p className="text-[11px] text-on-surface-variant truncate">
                  {routeInfo.address}
                </p>
              </div>
              <button
                type="button"
                onClick={clearRouteLayer}
                className="w-6 h-6 rounded-lg text-outline hover:text-on-surface hover:bg-black/5 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2.5 pt-1">
              <div className="bg-surface-container-low/60 rounded-xl p-2 text-center border border-outline-variant/20">
                <p className="text-[10px] text-on-surface-variant font-medium">Pickup Distance</p>
                <p className="font-extrabold text-sm sm:text-base text-primary mt-0.5">
                  {routeInfo.distanceFormatted}
                </p>
              </div>
              <div className="bg-surface-container-low/60 rounded-xl p-2 text-center border border-outline-variant/20">
                <p className="text-[10px] text-on-surface-variant font-medium">Est. Travel Time</p>
                <p className="font-extrabold text-sm sm:text-base text-[#15803d] mt-0.5">
                  {routeInfo.durationFormatted}
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-outline-variant/15 flex items-center justify-between text-[10px] text-on-surface-variant">
              <span className="flex items-center gap-1 text-primary font-semibold">
                <span className="material-symbols-outlined text-[13px]">directions_car</span>
                Calculated via OSRM Live Driving
              </span>
              <span className="text-[#3e6a00] font-bold">In-Dashboard Route</span>
            </div>
          </div>
        )}

        {/* Loading route state banner */}
        {isRouting && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
            <span>Calculating pickup route...</span>
          </div>
        )}

        {/* Route Error Notification */}
        {routeError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{routeError}</span>
          </div>
        )}

        {/* Floating Selected Stall Card / Bottom Drawer */}
        {selectedStall && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[380px] z-10 bg-white/98 backdrop-blur-md border border-outline-variant/30 rounded-2xl p-4 sm:p-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">agriculture</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#F28C28] uppercase tracking-wider block">
                    {selectedStall.market_name || 'Regional Market Stall'}
                  </span>
                  <h4 className="font-bold text-base text-on-surface truncate leading-tight">
                    {selectedStall.stall_name}
                  </h4>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">
                    Farmer: <strong>{selectedStall.farmer_name || selectedStall.contact_person}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStall(null)}
                className="w-7 h-7 rounded-lg text-outline hover:text-on-surface hover:bg-black/5 flex items-center justify-center cursor-pointer flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Stall Details Chips */}
            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
              <div className="p-2 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <p className="text-[10px] text-on-surface-variant">Available Stock</p>
                <p className="font-bold text-on-surface mt-0.5">
                  {selectedStall.total_stock || (selectedStall.products ? selectedStall.products.length * 20 : 45)} units available
                </p>
              </div>

              <div className="p-2 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <p className="text-[10px] text-on-surface-variant">Pickup Window</p>
                <p className="font-bold text-on-surface mt-0.5">
                  {selectedStall.pickup_time_start || '08:00'} – {selectedStall.pickup_time_end || '14:00'}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-on-surface-variant flex items-center gap-1 truncate mb-3">
              <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
              <span>{selectedStall.address}</span>
            </p>

            {/* Actions: Book Stock + Navigate Route */}
            <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => {
                  if (onBookStall) {
                    onBookStall(selectedStall);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                <span>Book Stock</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (customerLocation) {
                    calculateAndShowRoute(customerLocation.longitude, customerLocation.latitude, selectedStall);
                  } else {
                    requestCustomerLocation(selectedStall);
                  }
                }}
                className="px-3 py-2.5 rounded-xl border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">navigation</span>
                <span>Directions</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info / Legend Bar */}
      <div className="px-5 py-2.5 bg-surface-container-low/50 border-t border-outline-variant/20 flex flex-wrap items-center justify-between text-[11px] text-on-surface-variant">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#125224] border border-white shadow-2xs inline-block"></span>
            <span>Active Farmer Stall</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0284c7] border border-white shadow-2xs inline-block"></span>
            <span>Your Location</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 rounded-full bg-[#2e6b3a] inline-block"></span>
            <span>OSRM Pickup Route</span>
          </span>
        </div>

        <span className="text-[10px] text-outline font-medium">
          Zero external redirects • 100% In-Dashboard Navigation
        </span>
      </div>
    </div>
  );
}
