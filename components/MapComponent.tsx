"use client";
// forcing rebuild

import React, { useRef, useState, useMemo, useEffect } from 'react';
import Map, { Source, Layer, Marker, Popup } from 'react-map-gl/mapbox';
import { Layers, Plus, Minus, Check, Globe, Map as MapIcon, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AddPlaceModal from './AddPlaceModal';
import { motion, AnimatePresence } from 'framer-motion';
import { getCitiesForYear, HISTORICAL_CITIES } from '@/lib/historicalCityNames';
import { useTheme } from '@/components/ThemeProvider';
import 'mapbox-gl/dist/mapbox-gl.css';



interface MapBlockProps {
  selectedYear: number;
  onStateClick: (stateName: string) => void;
  onPlaceClick?: (place: any) => void;
  focusedLocation?: { lat: number, lng: number } | null;
  historyMode?: boolean;
  historicalEvents?: any[];
  onHistoricalEventClick?: (event: any) => void;
  isAdmin?: boolean;
}

const MapComponent: React.FC<MapBlockProps> = ({ selectedYear, onStateClick, onPlaceClick, focusedLocation, historyMode = false, historicalEvents = [], onHistoricalEventClick, isAdmin = false }) => {
  const mapRef = React.useRef<any>(null);

  // Manual Entry State
  const [isAddMode, setIsAddMode] = React.useState(false);
  const [addLocation, setAddLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  // Fly to focused location when it changes
  React.useEffect(() => {
    if (focusedLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [focusedLocation.lng, focusedLocation.lat],
        zoom: 12,
        duration: 2000
      });
    }
  }, [focusedLocation]);

  // Expose flyTo capability or handle it internally when prop changes? 
  // For now, let's handle click centering internally if possible, or simple "flyTo" on click.
  // Actually, the user wants "click on Sivas -> center on Sivas".
  // The onMapClick handles the interaction. We can flyTo there.

  // Access token from environment variable
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Filter data based on selected year
  // We will use Mapbox filters for performance, but we also need the data source
  // Assuming data is loaded from /data/history.json
  // For simplicity, we'll fetch it or import it. unique for now, fetch in useEffect or useSWR is better, 
  // but for MVP we can just import if it's small, or fetch.
  // Let's use simple fetch for now.

  // Available map years in public/data/historical_maps/
  const AVAILABLE_MAP_YEARS = [
    -2000, -1000, -500, -323, -200, 100, 200, 300, 400, 500,
    600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500,
    1600, 1700, 1800, 1900, 1994
  ];

  // Helper: Find closest map year
  const getClosestMapYear = (year: number) => {
    return AVAILABLE_MAP_YEARS.reduce((prev, curr) => {
      return (Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev);
    });
  };

  // Helper: Generate consistent color from string
  const stringToColor = (str: string) => {
    if (!str) return '#cccccc';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  const [geoData, setGeoData] = React.useState<any | null>(null);
  const [worldMapData, setWorldMapData] = React.useState<any | null>(null);
  const [loadedMapYear, setLoadedMapYear] = React.useState<number | null>(null);
  const mapCache = React.useRef<{ [key: number]: any }>({});

  // Historical City Names - compute visible cities for the selected year
  const historicalCityMarkers = useMemo(() => {
    if (!historyMode) return [];
    return getCitiesForYear(selectedYear);
  }, [historyMode, selectedYear]);

  // Fetch Full World Map on Year Change
  React.useEffect(() => {
    if (!historyMode) return;

    const targetYear = getClosestMapYear(selectedYear);

    // Avoid re-fetching if already currently loaded
    if (loadedMapYear === targetYear) return;

    const loadMap = async () => {
      try {
        // Check cache first
        if (mapCache.current[targetYear]) {
          setWorldMapData(mapCache.current[targetYear]);
          setLoadedMapYear(targetYear);
          return;
        }

        const filename = targetYear < 0 ? `world_bc${Math.abs(targetYear)}.geojson` : `world_${targetYear}.geojson`;
        console.log(`Loading map: ${filename}`);

        const res = await fetch(`/data/historical_maps/${filename}`);
        if (!res.ok) throw new Error('Map not found');

        const data = await res.json();

        // Pre-process to add color property based on name
        data.features = data.features.map((f: any) => {
          const name = f.properties.NAME || f.properties.name || f.properties.Name || "Unknown";
          return {
            ...f,
            properties: {
              ...f.properties,
              // Generate a consistent color
              generated_color: stringToColor(name),
              name: name // standardize name key
            }
          };
        });

        mapCache.current[targetYear] = data;
        setWorldMapData(data);
        setLoadedMapYear(targetYear);

      } catch (err) {
        console.error("Failed to load map year:", targetYear, err);
      }
    };

    loadMap();
  }, [selectedYear, historyMode]);

  // Keep the old fetch for legacy support or if we revert
  React.useEffect(() => {
    fetch('/data/history.json') // Intentionally listing broken path as we moved to new system?
      .then(res => res.json())
      .then(data => setGeoData(data)) // Logic for old Turkic-only data
      .catch(e => console.log("Legacy history.json skipped"));
  }, []);


  const [places, setPlaces] = React.useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = React.useState<any>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPlaces = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .abortSignal(controller.signal);

        if (error) {
          // Ignore abort errors
          if (error.code !== '20' && !error.message.includes("AbortError")) { // 20 is Postgres Abort check? Actually Supabase JS throws object.
            console.error('Error fetching places:', error.message || error);
          }
        } else {
          setPlaces(data || []);
          console.log("🔍 Supabase Veri Kontrolü: Mekanlar yüklendi.");
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Unexpected error fetching places:', err);
        }
      }
    };

    fetchPlaces();

    return () => {
      controller.abort();
    };
  }, []);

  // Animation Ref
  const animationRef = React.useRef<number>(0);

  React.useEffect(() => {
    // Only animate between 1000 and 1100
    if (selectedYear >= 1000 && selectedYear <= 1100) {
      const animateDashArray = (timestamp: number) => {
        const map = mapRef.current?.getMap();
        if (!map || !map.isStyleLoaded() || !map.getSource('migration-route-data')) {
          // Wait for map or source to be ready
          animationRef.current = requestAnimationFrame(animateDashArray);
          return;
        }

        if (map.getLayer('migration-route-line')) {
          // Standard marching ants: increment offset
          const newOffset = (timestamp / 100) % 3;
          try {
            map.setPaintProperty('migration-route-line', 'line-dasharray-offset', newOffset);
          } catch (e) {
            // Ignore animation errors during hot reload or init
          }

          animationRef.current = requestAnimationFrame(animateDashArray);
        } else {
          // Layer not visible or present, just loop
          animationRef.current = requestAnimationFrame(animateDashArray);
        }
      };

      animationRef.current = requestAnimationFrame(animateDashArray);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedYear]);

  // Theme Integration
  // Theme Integration
  const { theme } = useTheme();

  // Map Style State
  // Default to 'political' (Light) or 'dark' based on theme
  const [mapStyle, setMapStyle] = React.useState<'dark' | 'political' | 'satellite'>('political');
  const [isStyleMenuOpen, setIsStyleMenuOpen] = React.useState(false);

  // Sync map style with theme
  useEffect(() => {
    if (historyMode) {
      setMapStyle('political'); // Force white/light theme in History Mode
    } else if (theme === 'dark') {
      setMapStyle('dark');
    } else {
      setMapStyle('political'); // Light
    }
  }, [theme, historyMode]);

  const mapStyleUrl = useMemo(() => {
    switch (mapStyle) {
      case 'political': return 'mapbox://styles/mapbox/light-v10';
      case 'satellite': return 'mapbox://styles/mapbox/satellite-streets-v12';
      case 'dark': return 'mapbox://styles/mapbox/dark-v11';
      default: return theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v10';
    }
  }, [mapStyle, theme]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 500 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 500 });
  };

  // Pre-process data to handle dynamic labeling based on etymology_chain and transition state
  const processedData = useMemo(() => {
    if (!geoData) return null;

    const features = geoData.features.map((feature: any) => {
      let label = feature.properties.name;

      // Dynamic Etymology Check
      if (feature.properties.etymology_chain) {
        // Sort chain by year descending
        const chain = [...feature.properties.etymology_chain].sort((a: any, b: any) => b.year - a.year);
        // Find best match
        const match = chain.find((item: any) => item.year <= selectedYear);

        if (match) {
          label = match.name;
        } else {
          // Fallback to oldest known if current year is before any history (or keep base name)
          const oldest = chain[chain.length - 1];
          if (oldest) label = oldest.name;
        }
      }

      // Calculate Visibility for Smooth Transitions
      // We set a property 'is_active' to 1 or 0, and use a transition on opacity in the layer style.
      // This avoids the abrupt removal of the feature from the source.
      let isActive = selectedYear >= feature.properties.startYear && selectedYear <= feature.properties.endYear;

      // Special case: Hide 'Republic of Turkey' general polygon when we have detailed provinces (>= 1923)
      if (feature.properties.name === 'Republic of Turkey' && selectedYear >= 1923) {
        isActive = false;
      }

      return {
        ...feature,
        // Promote ID for stable diffing
        id: feature.properties.name || Math.random(),
        properties: {
          ...feature.properties,
          current_label: label,
          is_active: isActive ? 1 : 0
        }
      };
    });

    return {
      ...geoData,
      features
    };
  }, [geoData, selectedYear]);

  // --- Optimized Layer Styles with Transitions (Memoized) ---

  const fillLayer: any = useMemo(() => ({
    id: 'states-fill',
    type: 'fill',
    paint: {
      'fill-color': ['get', 'color'],
      // Use is_active property to drive opacity with a transition
      'fill-opacity': [
        'case',
        ['==', ['get', 'is_active'], 1],
        0.2, // Reduced opacity for realistic overlay
        0
      ],
      'fill-opacity-transition': { duration: 500, delay: 0 } // Smooth fade over 500ms
    }
  }), []);

  const migrationLayer: any = useMemo(() => ({
    id: 'migration-layer',
    type: 'line',
    paint: {
      'line-color': '#FF9800',
      'line-width': 3,
      'line-dasharray': [2, 1],
      'line-opacity': [
        'case',
        ['==', ['get', 'is_active'], 1],
        1,
        0
      ],
      'line-opacity-transition': { duration: 500 }
    }
  }), []);

  const lineLayer: any = useMemo(() => ({
    id: 'states-outline',
    type: 'line',
    paint: {
      'line-color': ['get', 'color'], // Use state color for border
      'line-width': 2,
      'line-blur': 1, // Soft glow effect
      'line-opacity': [
        'case',
        ['==', ['get', 'is_active'], 1],
        0.8,
        0
      ],
      'line-opacity-transition': { duration: 500 }
    }
  }), []);

  const cityLayer: any = useMemo(() => ({
    id: 'cities-point',
    type: 'circle',
    paint: {
      'circle-radius': 6,
      'circle-color': '#00bcd4',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': [
        'case',
        ['==', ['get', 'is_active'], 1],
        1,
        0
      ],
      'circle-stroke-opacity': [
        'case',
        ['==', ['get', 'is_active'], 1],
        1,
        0
      ],
      'circle-opacity-transition': { duration: 300 }
    }
  }), []);

  const cityLabelLayer: any = useMemo(() => ({
    id: 'cities-label',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'current_label'],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 12,
      'text-offset': [0, 1.25],
      'text-anchor': 'top'
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#000000',
      'text-halo-width': 2,
      'text-opacity': [
        'case',
        ['==', ['get', 'is_active'], 1],
        1,
        0
      ],
      'text-opacity-transition': { duration: 300 }
    }
  }), []);


  // --- Places GeoJSON Transformation (Performance Optimization) ---
  const placesGeoJSON = useMemo(() => {
    if (!places) return null;

    const features = places.map(place => {
      let lng = Number(place.lng || place.longitude);
      let lat = Number(place.lat || place.latitude);

      // Parse WKT location if needed
      if ((isNaN(lng) || isNaN(lat)) && place.location) {
        const match = place.location.match(/POINT\(([\d.-]+) ([\d.-]+)\)/);
        if (match) {
          lng = Number(match[1]);
          lat = Number(match[2]);
        }
      }

      if (isNaN(lng) || isNaN(lat)) return null;

      // Time Machine Logic
      if (place.type === 'village' && selectedYear <= 1920) return null; // Show villages only after 1920

      if (place.type === 'battle') {
        const battleYear = place.year || (place.historical_data?.year);
        if (battleYear) {
          const start = Math.floor(battleYear / 100) * 100;
          const end = start + 100;
          if (selectedYear < start || selectedYear > end) return null;
        }
      }

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          id: place.id,
          name: place.name,
          type: place.type,
          // Note: Passing complex objects like historical_data might need stringification if used directly in expressions,
          // but for click handlers we can retrieve the original object from the ID.
          // We'll keep it simple here.
        }
      };
    }).filter(Boolean);

    return { type: 'FeatureCollection', features } as any;
  }, [places, selectedYear]);

  // --- Place Layers ---
  const placesPointLayer: any = useMemo(() => ({
    id: 'places-point',
    type: 'circle',
    minzoom: 8, // Don't show when zoomed out
    paint: {
      'circle-radius': 6,
      'circle-color': [
        'match',
        ['get', 'type'],
        'village', '#FDD835',
        'battle', '#FF0000',
        'city', '#3FB1CE',
        '#3FB1CE' // default
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.9,
      'circle-stroke-opacity': 0.9
    }
  }), []);

  const placesLabelLayer: any = useMemo(() => ({
    id: 'places-label',
    type: 'symbol',
    minzoom: 9, // Labels appear later to reduce clutter
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 11,
      'text-offset': [0, 1.2],
      'text-anchor': 'top',
      'text-allow-overlap': false,
      'text-ignore-placement': false
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#000000',
      'text-halo-width': 2,
      'text-opacity': 0.9
    }
  }), []);


  // Use simple type filters instead of complex date filters to allow fading
  const stateTypeFilter = useMemo(() => ['==', 'type', 'state'], []);
  const migrationTypeFilter = useMemo(() => ['==', 'type', 'migration'], []);
  const cityTypeFilter = useMemo(() => ['==', 'type', 'city'], []);

  // Helper to hide/show modern layers
  const updateLayerVisibility = (map: any) => {
    if (!map) return;

    // CRITICAL: Wait for style to fully load before accessing layers
    try {
      if (!map.isStyleLoaded()) return;
    } catch (e) {
      return; // Style object not available yet
    }

    const style = map.getStyle();
    if (!style || !style.layers) return;

    style.layers.forEach((layer: any) => {
      try {
        // Modern Layers to Hide in History Mode
        const isModernLayer =
          layer.id.includes('road') ||
          layer.id.includes('admin') ||
          layer.id.includes('waterway') ||
          layer.id.includes('building') ||
          layer.id.includes('country-label') ||
          layer.id.includes('state-label') ||
          layer.id.includes('settlement-label') ||
          layer.id.includes('poi-label') ||
          layer.id.includes('airport') ||
          layer.id.includes('transit');

        if (isModernLayer) {
          map.setLayoutProperty(layer.id, 'visibility', historyMode ? 'none' : 'visible');
        }

        // Mute water color - ONLY for fill layers
        if (layer.id.includes('water') && layer.type === 'fill' && historyMode) {
          map.setPaintProperty(layer.id, 'fill-color', '#a0a0a0');
        } else if (layer.id.includes('water') && layer.type === 'fill' && !historyMode) {
          map.setPaintProperty(layer.id, 'fill-color', '#a0cfdf');
        }
      } catch (err) {
        // Skip layers that can't be modified (e.g., background)
      }
    });
  };

  // Trigger visibility update when mode changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map && map.isStyleLoaded()) {
      updateLayerVisibility(map);
    }
  }, [historyMode, mapStyle]);

  const onMapClick = (event: any) => {
    const feature = event.features?.[0];
    if (feature) {

      // Check if it's a place click
      if (feature.layer.id === 'places-point' || feature.layer.id === 'places-label') {
        const placeId = feature.properties.id;
        const place = places.find(p => p.id === placeId);
        if (place) {
          mapRef.current?.flyTo({ center: [Number(place.lng || place.longitude || feature.geometry.coordinates[0]), Number(place.lat || place.latitude || feature.geometry.coordinates[1])], zoom: 10, duration: 1000 });

          if (onPlaceClick) {
            onPlaceClick(place);
          } else {
            // Fallback if no callback provided (old behavior)
            setSelectedPlace(place);
          }
        }
        return; // Stop propagation
      }

      // Fly to the clicked feature (States) - Supports both legacy and new layers
      if (feature.layer.id === 'states-fill' || feature.layer.id === 'world-states-fill') {
        const stateName = feature.properties.name || feature.properties.NAME || feature.properties.Name;
        if (stateName) {
          // Try to find a specific coordinate for this state/city name in our historical database
          // This fixes the issue of clicking "Sivas" and flying to "Tokat" (random point in polygon)
          const targetCity = HISTORICAL_CITIES.find(c =>
            c.modernName.toLowerCase() === stateName.toLowerCase() ||
            c.names.some(n => n.name.toLowerCase() === stateName.toLowerCase())
          );

          mapRef.current?.flyTo({
            center: targetCity ? [targetCity.lng, targetCity.lat] : event.lngLat,
            zoom: targetCity ? 9 : 7, // Zoom in closer if we have a specific city
            duration: 1500
          });
          onStateClick(stateName);
        }
      }
    }
  };

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[var(--background)] text-red-500 font-bold text-xl p-10 text-center z-50">
        ⚠️ Mapbox Token Missing<br />
        <span className="text-sm text-[var(--text-muted)] mt-2 font-normal">Vercel Environment Variables Missing</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full absolute top-0 left-0`}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 35,
          latitude: 39,
          zoom: 5
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyleUrl}
        mapboxAccessToken={mapboxToken}
        interactiveLayerIds={[
          'world-states-fill', // NEW
          'states-fill',
          'cities-point',
          'cities-label',
          'provinces-fill',
          'districts-fill-click',
          'places-point',
          'places-label'
        ]}
        onClick={(e) => {
          if (isAddMode) {
            setAddLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
            return;
          }

          // Check for ANY Mapbox label at click point (only when zoomed in enough)
          const map = mapRef.current?.getMap();
          const currentZoom = map?.getZoom() || 0;
          if (map && onPlaceClick && currentZoom >= 8) {
            // Query ALL rendered features at click point (no layer filter)
            const allFeatures = map.queryRenderedFeatures(e.point);

            // Find the first feature with a name (prefer symbol/label layers)
            const labelFeature = allFeatures.find((f: any) =>
              f.layer?.type === 'symbol' && (f.properties?.name || f.properties?.name_tr)
            );

            if (labelFeature) {
              const placeName = labelFeature.properties?.name || labelFeature.properties?.name_tr || labelFeature.properties?.name_en;
              if (placeName) {
                console.log('📍 Label clicked:', placeName, labelFeature.layer?.id);

                // Determine target coordinates
                let targetCenter: [number, number] = [e.lngLat.lng, e.lngLat.lat];
                if (labelFeature.geometry?.type === 'Point') {
                  const coords = (labelFeature.geometry as any).coordinates;
                  targetCenter = [coords[0], coords[1]];
                }

                mapRef.current?.flyTo({
                  center: targetCenter,
                  zoom: Math.max(currentZoom, 10),
                  duration: 800
                });
                onPlaceClick({
                  name: placeName,
                  lat: e.lngLat.lat,
                  lng: e.lngLat.lng,
                  type: labelFeature.properties?.class || labelFeature.properties?.type || 'settlement',
                });
                return;
              }
            }
          }

          onMapClick(e);
        }}
        onLoad={() => {
          const map = mapRef.current?.getMap();
          if (!map) return;

          // Initial check
          updateLayerVisibility(map);

          // Re-apply on style change
          map.on('styledata', () => {
            updateLayerVisibility(map);
          });

          // Click handler for historical city labels
          map.on('click', 'historical-city-labels', (e: any) => {
            if (!e.features || e.features.length === 0) return;
            const props = e.features[0].properties;
            const coords = e.features[0].geometry.coordinates;
            if (onPlaceClick) {
              onPlaceClick({
                name: props.historicalName,
                lat: coords[1],
                lng: coords[0],
                type: 'historical-city',
                modernName: props.modernName,
                civilization: props.civilization,
              });
            }
            mapRef.current?.flyTo({
              center: coords,
              zoom: 8,
              duration: 1000,
            });
          });

          // Pointer cursor on hover
          map.on('mouseenter', 'historical-city-labels', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'historical-city-labels', () => {
            map.getCanvas().style.cursor = '';
          });
        }}
      >
        {/* Historical State Polygons — FULL WORLD HISTORY MODE */}
        {historyMode && worldMapData && (
          <Source id="world-history-data" type="geojson" data={worldMapData}>
            <Layer
              id="world-states-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'generated_color'],
                'fill-opacity': 0.3, // Light opacity to blend with paper texture
                'fill-outline-color': '#444' // Darker outline
              }}
            />
            {/* Outline Layer for sharper borders */}
            <Layer
              id="world-states-outline"
              type="line"
              paint={{
                'line-color': '#555',
                'line-width': 0.5,
                'line-opacity': 0.5
              }}
            />
            {/* Labels for World States */}
            <Layer
              id="world-states-label"
              type="symbol"
              layout={{
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-size': 10,
                'text-transform': 'uppercase',
                'text-max-width': 8
              }}
              paint={{
                'text-color': '#333', // Ink color
                'text-halo-color': '#ebd5b3', // Paper halo
                'text-halo-width': 1,
                'text-opacity': 0.7
              }}
              minzoom={3}
            />
          </Source>
        )}

        {/* Legacy: Migration Route — ONLY in History Mode */}
        {historyMode && (
          <Source id="migration-route-data" type="geojson" data="/data/migrations.json">
            <Layer
              id="migration-route-line"
              type="line"
              paint={{
                'line-color': '#FFA500',
                'line-width': 5,
                'line-dasharray': [2, 1],
                'line-opacity': 0.8
              }}
              layout={{
                'line-join': 'round',
                'line-cap': 'round',
                'visibility': (selectedYear >= 600 && selectedYear <= 1100) ? 'visible' : 'none'
              }}
            />
          </Source>
        )}

        {/* Raster Image Overlays (Historical Maps) */}
        {historyMode && processedData && processedData.features.map((feature: any) => {
          if (feature.properties.image_url && feature.properties.coordinates && feature.properties.is_active) {
            return (
              <Source
                key={`image-${feature.id}`}
                id={`image-source-${feature.id}`}
                type="image"
                url={feature.properties.image_url}
                coordinates={feature.properties.coordinates}
              >
                <Layer
                  id={`image-layer-${feature.id}`}
                  type="raster"
                  paint={{
                    'raster-opacity': 0.8,
                    'raster-fade-duration': 300
                  }}
                />
              </Source>
            );
          }
          return null;
        })}



        {/* Trade Routes — ONLY in History Mode */}
        {historyMode && (
          <Source id="trade-routes-data" type="geojson" data="/data/trade-routes.json">
            <Layer
              id="trade-routes-line"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2.5,
                'line-dasharray': [4, 2],
                'line-opacity': 0.6
              }}
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
            />
            <Layer
              id="trade-routes-label"
              type="symbol"
              layout={{
                'symbol-placement': 'line-center',
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Italic', 'Arial Unicode MS Regular'],
                'text-size': 10,
                'text-allow-overlap': false
              }}
              paint={{
                'text-color': '#FFD700',
                'text-halo-color': '#000000',
                'text-halo-width': 1.5,
                'text-opacity': 0.7
              }}
              minzoom={4}
            />
          </Source>
        )}




        {/* Supabase Markers — hidden, Mapbox built-in labels used instead */}

        {/* Selected Place Popup */}
        {selectedPlace && (() => {
          let lng = Number(selectedPlace.lng || selectedPlace.longitude);
          let lat = Number(selectedPlace.lat || selectedPlace.latitude);
          if ((isNaN(lng) || isNaN(lat)) && selectedPlace.location) {
            const match = selectedPlace.location.match(/POINT\(([\d.-]+) ([\d.-]+)\)/);
            if (match) {
              lng = Number(match[1]);
              lat = Number(match[2]);
            }
          }
          if (isNaN(lng) || isNaN(lat)) return null;

          return (
            <Popup
              longitude={lng}
              latitude={lat}
              anchor="top"
              onClose={() => setSelectedPlace(null)}
              closeOnClick={false}
            >
              <div className="text-black p-1 max-w-xs">
                <h3 className="font-bold text-lg mb-1">{selectedPlace.name}</h3>
                <p className="text-sm text-gray-600 capitalize mb-2">{selectedPlace.type}</p>

                <div className="mb-3 max-h-40 overflow-y-auto">
                  {selectedPlace.historical_data?.description ? (
                    <p className="text-sm text-gray-800">{selectedPlace.historical_data.description}</p>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Kayıtlı bilgi bulunmamaktadır.</p>
                  )}
                  {selectedPlace.historical_data?.source_url && (
                    <a href={selectedPlace.historical_data.source_url} target="_blank" rel="noopener noreferrer" className="block mt-1 text-xs text-blue-600 hover:underline">Kaynak Linki</a>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const place = selectedPlace; // Capture current
                      const newDesc = prompt("Açıklama giriniz:", place.historical_data?.description || "");
                      if (newDesc === null) return;

                      const newSource = prompt("Kaynak URL (varsa):", place.historical_data?.source_url || "");
                      if (newSource === null) return;

                      const updatedData = {
                        ...place.historical_data,
                        description: newDesc,
                        source_url: newSource
                      };

                      const updatedPlace = { ...place, historical_data: updatedData };
                      setPlaces(prev => prev.map(p => p.id === place.id ? updatedPlace : p));
                      setSelectedPlace(updatedPlace);

                      if (supabase) {
                        supabase.from('places').update({ historical_data: updatedData }).eq('id', place.id)
                          .then(({ error }) => {
                            if (error) console.error("Update error:", error);
                            else console.log("Saved!");
                          });
                      }
                    }}
                    className="w-full bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>✏️ Bilgi Ekle / Düzenle</span>
                  </button>
                </div>
              </div>
            </Popup>
          );
        })()}

        {/* Historical City Name Labels — Clean text on map (History Mode only) */}
        {historyMode && historicalCityMarkers.length > 0 && (
          <Source
            id="historical-city-names"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: historicalCityMarkers.map((city, idx) => ({
                type: 'Feature' as const,
                id: idx,
                geometry: {
                  type: 'Point' as const,
                  coordinates: [city.lng, city.lat],
                },
                properties: {
                  historicalName: city.historicalName,
                  modernName: city.modernName,
                  civilization: city.civilization,
                  label: city.historicalName !== city.modernName
                    ? `${city.historicalName}\n(${city.modernName})`
                    : city.historicalName,
                },
              })),
            }}
          >
            {/* City name text */}
            <Layer
              id="historical-city-labels"
              type="symbol"
              layout={{
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': [
                  'interpolate', ['linear'], ['zoom'],
                  2, 9,
                  5, 12,
                  8, 15,
                ],
                'text-anchor': 'top',
                'text-offset': [0, 0.5],
                'text-allow-overlap': false,
                'text-ignore-placement': false,
                'text-max-width': 10,
                'text-line-height': 1.2,
                'icon-image': 'circle-11',
                'icon-size': 0.7,
                'icon-anchor': 'center',
                'icon-allow-overlap': true,
              }}
              paint={{
                'text-color': '#4a2c0a',
                'text-halo-color': '#f5e6c8',
                'text-halo-width': 1.5,
                'text-halo-blur': 0.5,
                'text-opacity': 0.95,
              }}
              minzoom={2}
            />
          </Source>
        )}

        {/* Manual Entry Marker (Preview) */}
        {
          addLocation && (
            <Marker longitude={addLocation.lng} latitude={addLocation.lat} anchor="bottom">
              <div className="text-4xl animate-bounce">📍</div>
            </Marker>
          )
        }
      </Map>

      {/* Map Controls (Responsive — adjust position in history mode) */}
      <div className={`absolute flex flex-col gap-2 z-50 right-4 ${historyMode ? 'top-20 md:top-24' : 'top-1/2 -translate-y-1/2 md:top-auto md:right-auto md:bottom-24 md:left-6 md:translate-y-0'}`}>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden shadow-lg">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors border-b border-slate-700/50"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          >
            <Minus size={20} />
          </button>
        </div>

        {/* Style Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
            className={`p-2.5 rounded-lg bg-slate-900/80 backdrop-blur-md border transition-all shadow-lg flex items-center justify-center ${isStyleMenuOpen ? 'border-cyan-500 text-cyan-400' : 'border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-500'}`}
          >
            <Layers size={20} />
          </button>

          <AnimatePresence>
            {isStyleMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                className="absolute left-14 bottom-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-2 rounded-xl shadow-2xl w-48 flex flex-col gap-1"
              >
                <div className="text-[10px] uppercase text-slate-500 font-bold px-2 py-1 tracking-wider">Harita Katmanı</div>

                <button
                  onClick={() => { setMapStyle('dark'); setIsStyleMenuOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${mapStyle === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Moon size={16} />
                  <span>Koyu (Varsayılan)</span>
                  {mapStyle === 'dark' && <Check size={14} className="ml-auto" />}
                </button>

                <button
                  onClick={() => { setMapStyle('political'); setIsStyleMenuOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${mapStyle === 'political' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <MapIcon size={16} />
                  <span>Siyasi (Açık)</span>
                  {mapStyle === 'political' && <Check size={14} className="ml-auto" />}
                </button>

                <button
                  onClick={() => { setMapStyle('satellite'); setIsStyleMenuOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${mapStyle === 'satellite' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Globe size={16} />
                  <span>Fiziki (Uydu)</span>
                  {mapStyle === 'satellite' && <Check size={14} className="ml-auto" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Manual Entry Marker (Preview) */}


      {/* Add Place Toggle Button — Admin Only */}
      {
        isAdmin && (
          <div className="absolute top-24 left-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => {
                if (!isAddMode) {
                  setIsAddMode(true);
                  setAddLocation(null);
                } else {
                  setIsAddMode(false);
                  setAddLocation(null);
                }
              }}
              className={`p-3 rounded-full shadow-lg transition-all ${isAddMode ? 'bg-amber-500 text-black rotate-45' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              title={isAddMode ? "Ekleme Modunu Kapat" : "Yeni Yer Ekle"}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )
      }

      {
        isAddMode && (
          <div className="absolute top-4 left-20 z-10 bg-black/70 text-amber-400 px-4 py-2 rounded pointer-events-none border border-amber-500/30 backdrop-blur-md">
            Haritada bir yere tıklayın
          </div>
        )
      }

      {/* Add Place Modal */}
      {
        addLocation && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <AddPlaceModal
              lat={addLocation.lat}
              lng={addLocation.lng}
              onClose={() => setAddLocation(null)}
              onSuccess={() => {
                setAddLocation(null);
                setIsAddMode(false);
                window.location.reload();
              }}
            />
          </div>
        )
      }

    </div >
  );
};

export default MapComponent;
