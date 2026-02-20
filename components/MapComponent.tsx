"use client";
// forcing rebuild

import React, { useRef, useState, useMemo, useEffect } from 'react';
import Map, { Source, Layer, Marker, Popup } from 'react-map-gl/mapbox';
import { Layers, Plus, Minus, Check, Globe, Map as MapIcon, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AddPlaceModal from './AddPlaceModal';
import { motion, AnimatePresence } from 'framer-motion';
import { getCitiesForYear, HISTORICAL_CITIES } from '@/lib/historicalCityNames';
import { CULTURAL_HERITAGE_DATA } from '@/lib/culturalHeritageData';
import { isTurkicState } from '@/lib/turkicStates';
import { getTranslatedName } from '@/lib/stateTranslations';
import { getModernTurkicGeoJSON } from '@/lib/modernTurkicPopulations';
import { getTurkicTribesGeoJSON } from '@/lib/turkicTribesData';
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
  showAncientSites?: boolean;
  showCulturalHeritage?: boolean;
  showTradeRoutes?: boolean;
  activeFilters?: string[];
  turkicOnly?: boolean;
  onTurkicToggle?: () => void;
  showModernHeatmap?: boolean;
  onModernHeatmapToggle?: () => void;
  showTurkicTribes?: boolean;
  onTurkicTribesToggle?: () => void;
  selectedTribe?: string | null;
  setSelectedTribe?: (tribe: string | null) => void;
}

const MapComponent: React.FC<MapBlockProps> = ({ selectedYear, onStateClick, onPlaceClick, focusedLocation, historyMode = false, historicalEvents = [], onHistoricalEventClick, isAdmin = false, showAncientSites = true, showCulturalHeritage = true, showTradeRoutes = true, activeFilters = [], turkicOnly = false,
  onTurkicToggle,
  showModernHeatmap = false,
  onModernHeatmapToggle,
  showTurkicTribes = false,
  onTurkicTribesToggle,
  selectedTribe = null,
  setSelectedTribe
}) => {
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

  const { visibleCities, ancientSites } = useMemo(() => {
    if (!historyMode) return { visibleCities: [], ancientSites: [] };
    const all = getCitiesForYear(selectedYear);
    return {
      visibleCities: all.filter(c => c.type !== 'ancient_site'),
      ancientSites: all.filter(c => c.type === 'ancient_site')
    };
  }, [historyMode, selectedYear]);

  // Modern Turkic Populations Data
  const modernTurkicData = useMemo(() => getModernTurkicGeoJSON(), []);

  // Turkic Tribes (Boylar) Data
  const turkicTribesData = useMemo(() => getTurkicTribesGeoJSON(selectedTribe || undefined), [selectedTribe]);

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
          const rawName = f.properties.NAME || f.properties.name || f.properties.Name || "Unknown";
          const translatedName = getTranslatedName(rawName);

          return {
            ...f,
            properties: {
              ...f.properties,
              // Generate a consistent color from original name
              generated_color: stringToColor(rawName),
              name: translatedName, // Use translated/formatted name for map labels
              is_turkic: isTurkicState(rawName)
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
    // Only fetch places if the user explicitly wants to see modern places (which they don't right now).
    // User requested to remove "blue dots" (districts/cities).
    // So we skip fetching from Supabase 'places' for the map view.
    setPlaces([]);
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
  // Default to 'satellite' (Fiziki)
  const [mapStyle, setMapStyle] = React.useState<'dark' | 'political' | 'satellite'>('satellite');
  const [isStyleMenuOpen, setIsStyleMenuOpen] = React.useState(false);

  // Sync map style with theme (but respect user preference if they switch)
  useEffect(() => {
    if (historyMode) {
      setMapStyle('political'); // Tarih modunda siyasi beyaz/parşömen stili
    } else {
      setMapStyle('satellite'); // Normal modda fiziki harita
    }
  }, [historyMode]);

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
      // Time Machine Logic
      if (place.type === 'village') return null; // Villages hidden by user request

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
    minzoom: 5, // Show when zoomed out (default zoom is 5)
    paint: {
      'circle-radius': 4,
      'circle-color': [
        'match',
        ['get', 'type'],
        'village', '#FDD835',
        'district', '#FDD835', // Yellow for districts
        'battle', '#FF0000',
        'city', '#3FB1CE', // Blue for cities
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
    // 1. Check for Historical City Labels & Custom Annotations (Priority)
    const clickedFeatures = event.features || [];

    // Check for Historical Events (Battles/Treaties)
    const eventLabel = clickedFeatures.find((f: any) => f.layer.id === 'historical-events-labels' || f.layer.id === 'historical-events-glow');
    if (eventLabel && onHistoricalEventClick) {
      const props = eventLabel.properties;
      const coords = eventLabel.geometry.coordinates; // [lng, lat]
      const isMobile = window.innerWidth < 768;

      mapRef.current?.flyTo({
        center: [coords[0], coords[1]],
        zoom: 7,
        duration: 1000,
        padding: isMobile ? { bottom: 300, top: 0, left: 0, right: 0 } : { bottom: 0, top: 0, left: 0, right: 0 }
      });

      onHistoricalEventClick({
        id: props.id,
        name: props.name,
        year: props.year,
        type: props.type,
        lat: coords[1],
        lng: coords[0],
        parties: JSON.parse(props.parties || '[]'),
        result: props.result,
        source: props.source,
        importance: props.importance
      });
      return;
    }

    // Check for Cultural Heritage
    const culturalLabel = clickedFeatures.find((f: any) => f.layer.id === 'cultural-heritage-labels' || f.layer.id === 'cultural-heritage-glow');
    if (culturalLabel) {
      const props = culturalLabel.properties;
      const coords = culturalLabel.geometry.coordinates; // [lng, lat]
      const isMobile = window.innerWidth < 768;

      mapRef.current?.flyTo({
        center: [coords[0], coords[1]],
        zoom: 12, // Zoom in closer for heritage sites
        duration: 1000,
        padding: isMobile ? { bottom: 300, top: 0, left: 0, right: 0 } : { bottom: 0, top: 0, left: 0, right: 0 }
      });

      if (onPlaceClick) {
        onPlaceClick({
          name: props.name,
          lat: coords[1],
          lng: coords[0],
          type: 'cultural-heritage',
          historical_data: {
            description: props.description,
            sources: [props.significance]
          }
        });
      }
      return;
    }

    // Check for Modern Turkic Populations Heatmap Labels
    const modernTurkicLabel = clickedFeatures.find((f: any) => f.layer.id === 'modern-turkic-labels');
    if (modernTurkicLabel) {
      const props = modernTurkicLabel.properties;
      const coords = modernTurkicLabel.geometry.coordinates;
      const isMobile = window.innerWidth < 768;

      mapRef.current?.flyTo({
        center: [coords[0], coords[1]],
        zoom: 7,
        duration: 1000,
        padding: isMobile ? { bottom: 300, top: 0, left: 0, right: 0 } : { bottom: 0, top: 0, left: 0, right: 0 }
      });

      if (onPlaceClick) {
        onPlaceClick({
          id: props.id,
          name: props.name,
          type: 'modern_turkic', // Helper for AI Context
          lat: coords[1],
          lng: coords[0],
          region: props.region,
          country: props.country,
          population: props.population,
          description: props.description,
          isCustom: true // Treat as custom so the AI prompt isn't confused
        });
      }
      return;
    }

    // Check for Turkic Tribes (Boylar) Labels/Points
    const tribeFeature = clickedFeatures.find((f: any) =>
      f.layer.id === 'turkic-tribes-labels' || f.layer.id === 'turkic-tribes-points'
    );
    if (tribeFeature) {
      const props = tribeFeature.properties;
      const coords = tribeFeature.geometry.coordinates;
      const isMobile = window.innerWidth < 768;

      mapRef.current?.flyTo({
        center: [coords[0], coords[1]],
        zoom: 9,
        duration: 1000,
        padding: isMobile ? { bottom: 300, top: 0, left: 0, right: 0 } : { bottom: 0, top: 0, left: 0, right: 0 }
      });

      if (onPlaceClick) {
        onPlaceClick({
          ...props,
          type: 'turkic_tribe', // Specific type for AI context
          isCustom: true,
          lat: coords[1],
          lng: coords[0]
        });
      }
      return;
    }

    const historicalLabel = clickedFeatures.find((f: any) => f.layer.id === 'historical-city-labels' || f.layer.id === 'ancient-sites-labels' || f.layer.id === 'ancient-sites-glow');

    if (historicalLabel) {
      const props = historicalLabel.properties;
      const coords = historicalLabel.geometry.coordinates; // [lng, lat]

      // Adjust center for mobile
      const isMobile = window.innerWidth < 768; // Simple check

      mapRef.current?.flyTo({
        center: [coords[0], coords[1]],
        zoom: 10,
        duration: 1000,
        padding: isMobile ? { bottom: 300, top: 0, left: 0, right: 0 } : { bottom: 0, top: 0, left: 0, right: 0 }
      });

      if (onPlaceClick) {
        onPlaceClick({
          name: props.historicalName || props.name,
          lat: coords[1],
          lng: coords[0],
          type: (historicalLabel.layer.id === 'ancient-sites-labels' || historicalLabel.layer.id === 'ancient-sites-glow') ? 'ancient-site' : 'historical-city',
          modernName: props.modernName,
          civilization: props.civilization,
          period: props.period,
        });
      }
      return;
    }

    // 2. Mapbox Default Labels (Modern Map Places)
    const mapboxLabel = clickedFeatures.find((f: any) =>
      f.layer.id.includes('settlement-label') ||
      f.layer.id.includes('settlement-major-label') ||
      f.layer.id.includes('settlement-minor-label') ||
      f.layer.id.includes('settlement-subdivision-label') ||
      f.layer.id.includes('poi-label') ||
      f.layer.id.includes('country-label') ||
      f.layer.id.includes('state-label') ||
      f.layer.id.includes('place-') // for older mapbox styles
    );

    if (mapboxLabel) {
      const props = mapboxLabel.properties;
      const name = props.name || props.name_en || props.name_tr;

      if (name) {
        const isMobile = window.innerWidth < 768;
        mapRef.current?.flyTo({
          center: [event.lngLat.lng, event.lngLat.lat],
          zoom: mapRef.current.getMap().getZoom() > 10 ? mapRef.current.getMap().getZoom() : 10,
          duration: 1000,
          padding: isMobile ? { bottom: 300, top: 0, left: 0, right: 0 } : { bottom: 0, top: 0, left: 0, right: 0 }
        });

        if (onPlaceClick) {
          onPlaceClick({
            name: name,
            lat: event.lngLat.lat,
            lng: event.lngLat.lng,
            type: 'modern-place'
          });
        }
        return;
      }
    }

    // 3. Rendered Feature Logic (States, Places)
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

        const isMobile = window.innerWidth < 768;

        mapRef.current?.flyTo({
          center: [event.lngLat.lng, event.lngLat.lat], // Fly to where user actually clicked
          zoom: mapRef.current.getMap().getZoom() > 7 ? mapRef.current.getMap().getZoom() : 7,
          duration: 1000,
          essential: true,
          padding: isMobile ? { bottom: 300, top: 0, left: 0, right: 0 } : { bottom: 0, top: 0, left: 0, right: 0 }
        });

        if (stateName) {
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
          'places-label',
          'historical-city-labels',
          'ancient-sites-glow',
          'ancient-sites-labels',
          'cultural-heritage-labels',
          'cultural-heritage-glow',
          'historical-events-glow',
          'historical-events-labels',
          // Mapbox Default Layers
          'settlement-label',
          'settlement-major-label',
          'settlement-minor-label',
          'settlement-subdivision-label',
          'poi-label',
          'country-label',
          'state-label',
          'place-city-lg-n',
          'place-city-lg-s',
          'place-city-md-n',
          'place-city-md-s',
          'place-city-sm',
          'place-town',
          'place-village'
        ]}
        onClick={onMapClick}
        onLoad={() => {
          const map = mapRef.current?.getMap();
          if (!map) return;

          // Initial check
          updateLayerVisibility(map);

          // Re-apply on style change
          map.on('styledata', () => {
            updateLayerVisibility(map);
          });



          // Pointer cursor on hover
          map.on('mouseenter', 'historical-city-labels', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'historical-city-labels', () => {
            map.getCanvas().style.cursor = '';
          });

          // Pointer cursor for Modern Turkic points
          map.on('mouseenter', 'modern-turkic-labels', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'modern-turkic-labels', () => {
            map.getCanvas().style.cursor = '';
          });

          // Pointer cursor for Turkic Tribes points/labels
          map.on('mouseenter', 'turkic-tribes-labels', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseenter', 'turkic-tribes-points', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'turkic-tribes-labels', () => {
            map.getCanvas().style.cursor = '';
          });
          map.on('mouseleave', 'turkic-tribes-points', () => {
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
              filter={turkicOnly ? ['==', ['get', 'is_turkic'], true] : ['has', 'name']}
              paint={{
                'fill-color': [
                  'case',
                  ['==', ['get', 'name'], 'UNKNOWN'], '#ffffff',
                  ['get', 'generated_color']
                ],
                'fill-opacity': 0.3, // Light opacity to blend with paper texture
                'fill-outline-color': '#444' // Darker outline
              }}
            />
            {/* Outline Layer for sharper borders */}
            <Layer
              id="world-states-outline"
              type="line"
              filter={turkicOnly ? ['==', ['get', 'is_turkic'], true] : ['has', 'name']}
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
              filter={turkicOnly ? ['==', ['get', 'is_turkic'], true] : ['has', 'name']}
              layout={{
                'text-field': [
                  'case',
                  ['==', ['get', 'name'], 'UNKNOWN'], '',
                  ['get', 'name']
                ],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-size': 10,
                'text-transform': 'uppercase',
                'text-max-width': 12
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
        {historyMode && showTradeRoutes && (
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




        {/* Supabase Markers — Restored */}
        {placesGeoJSON && (
          <Source id="places-data" type="geojson" data={placesGeoJSON}>
            <Layer {...placesPointLayer} />
            <Layer {...placesLabelLayer} />
          </Source>
        )}

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
        {historyMode && (
          <>
            {/* Standard Cities */}
            {visibleCities.length > 0 && (
              <Source
                id="historical-city-names"
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: visibleCities.map((city, idx) => ({
                    type: 'Feature' as const,
                    id: `city-${idx}`,
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

            {/* Ancient Sites (Ruins) — Distinct Styling */}
            {showAncientSites && ancientSites.length > 0 && (
              <Source
                id="ancient-sites-data"
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: ancientSites.map((site, idx) => ({
                    type: 'Feature' as const,
                    id: `site-${idx}`,
                    geometry: {
                      type: 'Point' as const,
                      coordinates: [site.lng, site.lat],
                    },
                    properties: {
                      historicalName: site.historicalName,
                      modernName: site.modernName,
                      civilization: site.civilization,
                      period: site.period, // Pass period to properties
                      label: `${site.historicalName}\n[${site.period || 'Antik'}]`, // Show period in label
                    },
                  })),
                }}
              >
                <Layer
                  id="ancient-sites-glow"
                  type="circle"
                  paint={{
                    'circle-radius': 12,
                    'circle-color': '#D2691E',
                    'circle-blur': 0.6,
                    'circle-opacity': 0.7
                  }}
                  minzoom={2}
                />
                <Layer
                  id="ancient-sites-labels"
                  type="symbol"
                  layout={{
                    'text-field': ['get', 'label'],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], // Italicize?
                    'text-size': 11,
                    'text-anchor': 'top',
                    'text-offset': [0, 0.8], // Slightly lower than text
                    'text-allow-overlap': true, // Always show important sites?
                    'text-ignore-placement': false,
                    'icon-image': 'star-11', // Star icon for ancient sites
                    'icon-size': 0.9,
                    'icon-anchor': 'center',
                    'icon-allow-overlap': true,
                  }}
                  paint={{
                    'text-color': '#8B4513', // SaddleBrown for ancient feel
                    'text-halo-color': '#FFE4B5', // Moccasin halo
                    'text-halo-width': 2,
                    'text-halo-blur': 0.5,
                    'icon-color': '#D2691E', // Chocolate color icon (if supported mask)
                  }}
                  minzoom={2}
                />
              </Source>
            )}
          </>
        )}

        {/* Cultural Heritage Sites */}
        {historyMode && showCulturalHeritage && CULTURAL_HERITAGE_DATA && CULTURAL_HERITAGE_DATA.length > 0 && (
          <Source
            id="cultural-heritage-data"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: CULTURAL_HERITAGE_DATA.filter(site => selectedYear >= site.year).map((site, idx) => ({
                type: 'Feature' as const,
                id: `heritage-${idx}`,
                geometry: {
                  type: 'Point' as const,
                  coordinates: [site.lng, site.lat],
                },
                properties: {
                  name: site.name,
                  type: 'cultural-heritage',
                  heritageType: site.type,
                  description: site.description,
                  significance: site.significance,
                  label: `${site.name}`,
                },
              })),
            }}
          >
            {/* Glow effect under the icon */}
            <Layer
              id="cultural-heritage-glow"
              type="circle"
              paint={{
                'circle-radius': 14,
                'circle-color': '#9333ea', // purple
                'circle-blur': 0.8,
                'circle-opacity': 0.8
              }}
              minzoom={2}
            />
            <Layer
              id="cultural-heritage-labels"
              type="symbol"
              layout={{
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 12,
                'text-anchor': 'top',
                'text-offset': [0, 1.2],
                'text-allow-overlap': true,
                'icon-image': [
                  'match',
                  ['get', 'heritageType'],
                  'architecture', 'monument-11',
                  'monument', 'monument-11',
                  'literature', 'library-11',
                  'mythology', 'star-11',
                  'star-11'
                ],
                'icon-size': 1.2,
                'icon-allow-overlap': true,
              }}
              paint={{
                'text-color': '#d8b4fe', // light purple
                'text-halo-color': '#3b0764', // dark purple
                'text-halo-width': 2,
              }}
              minzoom={2}
            />
          </Source>
        )}

        {/* Modern Turkic Populations Heatmap Overlay */}
        {showModernHeatmap && (
          <Source id="modern-turkic-heatmap-data" type="geojson" data={modernTurkicData}>
            <Layer
              id="modern-turkic-heatmap-layer"
              type="heatmap"
              paint={{
                // Increase the heatmap weight based on the population property
                'heatmap-weight': [
                  'interpolate',
                  ['linear'],
                  ['get', 'population'],
                  10000, 0.1,    // Small pops are subtle
                  1000000, 0.6,  // Mid pops
                  15000000, 1.0  // Huge pops max weight
                ],
                // Heatmap intensity by zoom level
                'heatmap-intensity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0, 1.2,
                  5, 2.5,
                  9, 4.0
                ],
                // Premium Fire/Magma Color ramp
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0, 0, 0, 0)',
                  0.1, 'rgba(51, 0, 0, 0.2)',     // Subtlest dark red
                  0.3, 'rgba(153, 0, 0, 0.6)',    // Deep dark red
                  0.5, 'rgba(238, 44, 44, 0.8)',  // Vibrant red
                  0.7, 'rgba(255, 140, 0, 0.95)', // Bright orange
                  0.9, 'rgba(255, 215, 0, 1)',    // Yellow/Gold core
                  1, 'rgba(255, 255, 255, 1)'     // White hot center
                ],
                // Adjust the heatmap radius by zoom level
                'heatmap-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0, 15,
                  4, 30,
                  9, 80
                ],
                // General opacity
                'heatmap-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  3, 0.9,
                  9, 0.6
                ],
              }}
            />
            {/* Added a subtle text label to weight centers */}
            <Layer
              id="modern-turkic-labels"
              type="symbol"
              layout={{
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 12,
                'text-anchor': 'top',
                'text-offset': [0, 1]
              }}
              paint={{
                'text-color': '#fff',
                'text-halo-color': '#000',
                'text-halo-width': 1,
                'text-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  3, 0,
                  5, 1
                ]
              }}
            />
          </Source>
        )}

        {/* Turkic Tribes (Boylar) Layer */}
        {showTurkicTribes && (
          <Source id="turkic-tribes-data" type="geojson" data={turkicTribesData}>
            {/* Glow / Outer Circle */}
            <Layer
              id="turkic-tribes-glow"
              type="circle"
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  3, 8,
                  10, 20
                ],
                'circle-color': ['get', 'color'],
                'circle-blur': 0.5,
                'circle-opacity': 0.4
              }}
            />
            {/* Inner Point */}
            <Layer
              id="turkic-tribes-points"
              type="circle"
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  3, 3,
                  10, 6
                ],
                'circle-color': ['get', 'color'],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
              }}
            />
            {/* Tribe Name Labels */}
            <Layer
              id="turkic-tribes-labels"
              type="symbol"
              layout={{
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  4, 10,
                  10, 14
                ],
                'text-anchor': 'top',
                'text-offset': [0, 1],
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-radial-offset': 0.8
              }}
              paint={{
                'text-color': '#fff',
                'text-halo-color': '#000',
                'text-halo-width': 1.5,
                'text-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  4, 0,
                  6, 1
                ]
              }}
            />
          </Source>
        )}

        {/* Historical Events (Battles, Treaties) */}
        {historyMode && historicalEvents && historicalEvents.length > 0 && (
          <Source
            id="historical-events-data"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: historicalEvents
                .filter(ev => {
                  // Only show if close to selectedYear (e.g. +/- 50 years)
                  if (Math.abs(ev.year - selectedYear) > 200) return false;
                  // Filter by activeFilters if array is empty (meaning all active) or includes type
                  if (activeFilters && activeFilters.length > 0 && ev.type && !activeFilters.includes(ev.type)) return false;
                  return true;
                })
                .map((ev, idx) => ({
                  type: 'Feature' as const,
                  id: `event-${idx}`,
                  geometry: {
                    type: 'Point' as const,
                    coordinates: [ev.lng, ev.lat],
                  },
                  properties: {
                    id: ev.id,
                    name: ev.name,
                    year: ev.year,
                    type: ev.type,
                    parties: JSON.stringify(ev.parties || []),
                    result: ev.result,
                    source: ev.source,
                    importance: ev.importance,
                    label: `${ev.name}\n(${ev.year})`,
                  },
                })),
            }}
          >
            <Layer
              id="historical-events-glow"
              type="circle"
              paint={{
                'circle-radius': ['match', ['get', 'type'], 'battle', 12, 10],
                'circle-color': ['match', ['get', 'type'], 'battle', '#ef4444', '#3b82f6'],
                'circle-blur': 0.6,
                'circle-opacity': 0.8
              }}
              minzoom={3}
            />
            <Layer
              id="historical-events-labels"
              type="symbol"
              layout={{
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 11,
                'text-anchor': 'top',
                'text-offset': [0, 1.0],
                'text-allow-overlap': false,
                'icon-image': ['match', ['get', 'type'], 'battle', 'cross-11', 'marker-11'],
                'icon-size': 1.0,
                'icon-allow-overlap': true,
              }}
              paint={{
                'text-color': '#ffffff',
                'text-halo-color': ['match', ['get', 'type'], 'battle', '#7f1d1d', '#1e3a8a'],
                'text-halo-width': 2,
              }}
              minzoom={3}
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

        {/* Türk Dünyası Toggle (Standalone) - Only in History Mode */}
        {historyMode && (
          <button
            onClick={onTurkicToggle}
            className={`p-2.5 rounded-lg backdrop-blur-md border transition-all shadow-lg flex items-center justify-center relative group ${turkicOnly
              ? 'bg-amber-500/20 text-amber-500 border-amber-500/50'
              : 'bg-slate-900/80 text-slate-300 border-slate-700/50 hover:text-white hover:border-amber-500/50 hover:bg-slate-800'
              }`}
            title="Sadece Türk Dünyasını Göster"
          >
            {/* Göktürk / Wolf SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M11.95 2C11.59 2 11.23 2.15 10.97 2.42C8.32 5.09 5 8.12 3.19 10.15C2.18 11.28 2.06 12.87 2.91 14.12C4.08 15.82 5.95 18 8.13 19.34C9.57 20.21 10.91 21.36 11.66 21.84L12 22.05L12.34 21.84C13.09 21.36 14.43 20.21 15.87 19.34C18.05 18 19.92 15.82 21.09 14.12C21.94 12.87 21.82 11.28 20.81 10.15C19 8.12 15.68 5.09 13.03 2.42C12.77 2.15 12.41 2 12.05 2H11.95ZM12 4.19C14.18 6.38 17.06 9.04 18.66 10.82C19.06 11.26 19.11 11.83 18.77 12.33C17.7 13.88 15.98 15.87 14.28 17.04C13.56 17.53 12.74 18.09 12 18.59C11.26 18.09 10.44 17.53 9.72 17.04C8.02 15.87 6.3 13.88 5.23 12.33C4.89 11.83 4.94 11.26 5.34 10.82C6.94 9.04 9.82 6.38 12 4.19Z" />
              <path d="M12 7.5L10 11.5L7 12.5L9 15.5L8.5 19L12 17L15.5 19L15 15.5L17 12.5L14 11.5L12 7.5Z" />
            </svg>

            {/* Tooltip */}
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white opacity-0 whitespace-nowrap pointer-events-none group-hover:opacity-100 transition-opacity">
              Türk Dünyası Filtresi
            </span>
          </button>
        )}

        {/* Modern Turkic Populations Heatmap Toggle (Standalone) */}
        <button
          onClick={onModernHeatmapToggle}
          className={`p-2.5 rounded-lg backdrop-blur-md border transition-all shadow-lg flex items-center justify-center relative group ${showModernHeatmap
            ? 'bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            : 'bg-slate-900/80 text-slate-300 border-slate-700/50 hover:text-white hover:border-red-500/50 hover:bg-slate-800'
            }`}
          title="Günümüz Türk Nüfus Yoğunluğu"
        >
          {/* Nomadic Tent / Otağ SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 2L2 10l0 12h20l0-12L12 2z" />
            <path d="M15 22v-8a3 3 0 0 0-6 0v8" />
            <path d="M7 14.5l-3-6" />
            <path d="M17 14.5l3-6" />
            <path d="M12 4v4" />
          </svg>

          {/* Tooltip */}
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white opacity-0 whitespace-nowrap pointer-events-none group-hover:opacity-100 transition-opacity">
            Günümüz Türk Nüfusu
          </span>
        </button>

        {/* Turkic Tribes (Boylar) Toggle (Standalone) */}
        <button
          onClick={onTurkicTribesToggle}
          className={`p-2.5 rounded-lg backdrop-blur-md border transition-all shadow-lg flex items-center justify-center relative group ${showTurkicTribes
            ? 'bg-orange-500/20 text-orange-500 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
            : 'bg-slate-900/80 text-slate-300 border-slate-700/50 hover:text-white hover:border-orange-500/50 hover:bg-slate-800'
            }`}
          title="Türk Boyları Yerleşimleri"
        >
          {/* Bow and Arrow / Tribe SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 2v20" />
            <path d="M22 12l-6-6M22 12l-6 6M22 12H10" />
            <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10" />
          </svg>

          {/* Tooltip */}
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white opacity-0 whitespace-nowrap pointer-events-none group-hover:opacity-100 transition-opacity">
            Türk Boyları (Oğuz v.b)
          </span>
        </button>
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
