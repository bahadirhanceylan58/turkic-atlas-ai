"use client";

import React, { useMemo } from 'react';
import Map, { Source, Layer, FillLayer, LineLayer } from 'react-map-gl';
import type { FeatureCollection } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBlockProps {
  selectedYear: number;
  onStateClick: (stateName: string) => void;
}

const MapBlock: React.FC<MapBlockProps> = ({ selectedYear, onStateClick }) => {
  // Access token from environment variable
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Filter data based on selected year
  // We will use Mapbox filters for performance, but we also need the data source
  // Assuming data is loaded from /data/history.json
  // For simplicity, we'll fetch it or import it. unique for now, fetch in useEffect or useSWR is better, 
  // but for MVP we can just import if it's small, or fetch.
  // Let's use simple fetch for now.
  
  const [geoData, setGeoData] = React.useState<FeatureCollection | null>(null);

  React.useEffect(() => {
    fetch('/data/history.json')
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  const filter = useMemo(() => {
    return [
      'all',
      ['<=', 'startYear', selectedYear],
      ['>=', 'endYear', selectedYear]
    ];
  }, [selectedYear]);

  const fillLayer: FillLayer = {
    id: 'states-fill',
    type: 'fill',
    paint: {
      'fill-color': '#627BC1',
      'fill-opacity': 0.5
    }
  };

  const lineLayer: LineLayer = {
    id: 'states-outline',
    type: 'line',
    paint: {
      'line-color': '#FFFFFF',
      'line-width': 1
    }
  };

  const onMapClick = (event: any) => {
    const feature = event.features?.[0];
    if (feature) {
      onStateClick(feature.properties.name);
    }
  };

  if (!mapboxToken) {
    return <div className="text-white p-10">Mapbox Token Missing</div>;
  }

  return (
    <div className="w-full h-full absolute top-0 left-0">
      <Map
        initialViewState={{
          longitude: 65,
          latitude: 40,
          zoom: 3
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxToken}
        interactiveLayerIds={['states-fill']}
        onClick={onMapClick}
      >
        {geoData && (
          <Source id="history-data" type="geojson" data={geoData}>
            {/* @ts-ignore */}
            <Layer {...fillLayer} filter={filter} />
            {/* @ts-ignore */}
            <Layer {...lineLayer} filter={filter} />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default MapBlock;
