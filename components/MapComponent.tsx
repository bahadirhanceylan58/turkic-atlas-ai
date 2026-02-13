"use client";
// forcing rebuild

import React, { useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
// import type { FeatureCollection } from 'geojson';
// import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBlockProps {
  selectedYear: number;
  onStateClick: (stateName: string) => void;
}

const MapComponent: React.FC<MapBlockProps> = ({ selectedYear, onStateClick }) => {
  // Access token from environment variable
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Filter data based on selected year
  // We will use Mapbox filters for performance, but we also need the data source
  // Assuming data is loaded from /data/history.json
  // For simplicity, we'll fetch it or import it. unique for now, fetch in useEffect or useSWR is better, 
  // but for MVP we can just import if it's small, or fetch.
  // Let's use simple fetch for now.

  const [geoData, setGeoData] = React.useState<any | null>(null);

  React.useEffect(() => {
    fetch('/data/history.json')
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

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
      const isActive = selectedYear >= feature.properties.startYear && selectedYear <= feature.properties.endYear;

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
        0.5,
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
      'line-color': '#FFFFFF',
      'line-width': 1,
      'line-opacity': [
        'case',
        ['==', ['get', 'is_active'], 1],
        1,
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

  // Use simple type filters instead of complex date filters to allow fading
  const stateTypeFilter = useMemo(() => ['==', 'type', 'state'], []);
  const migrationTypeFilter = useMemo(() => ['==', 'type', 'migration'], []);
  const cityTypeFilter = useMemo(() => ['==', 'type', 'city'], []);

  const onMapClick = (event: any) => {
    const feature = event.features?.[0];
    if (feature) {
      onStateClick(feature.properties.name); // Keep using the main ID name for API calls
    }
  };

  if (!mapboxToken) {
    return <div className="text-white p-10">Mapbox Token Missing</div>;
  }

  return (
    <div className="w-full h-full absolute top-0 left-0">
      <Map
        initialViewState={{
          longitude: 35,
          latitude: 39,
          zoom: 5
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxToken}
        interactiveLayerIds={['states-fill', 'cities-point', 'cities-label']}
        onClick={onMapClick}
      >
        {processedData && (
          <Source id="history-data" type="geojson" data={processedData}>
            {/* @ts-ignore */}
            <Layer {...fillLayer} filter={stateTypeFilter} />
            {/* @ts-ignore */}
            <Layer {...lineLayer} filter={stateTypeFilter} />
            {/* @ts-ignore */}
            <Layer {...migrationLayer} filter={migrationTypeFilter} />
            {/* @ts-ignore */}
            <Layer {...cityLayer} filter={cityTypeFilter} />
            {/* @ts-ignore */}
            <Layer {...cityLabelLayer} filter={cityTypeFilter} />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
