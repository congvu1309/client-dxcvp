'use client';

import { TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });

const customIcon = new L.Icon({
    iconUrl: '/favicon.ico',
    iconSize: [40, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapProductProps {
    districts: string;
}

const MapProduct: React.FC<MapProductProps> = ({ districts }) => {

    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: districts,
                        format: 'json',
                        limit: 1,
                    },
                });

                if (response.data && response.data.length > 0) {
                    const { lat, lon } = response.data[0];
                    setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
                }
            } catch (error) {
                console.error('Failed to fetch coordinates', error);
            }
        };

        if (districts) {
            fetchCoordinates();
        }
    }, [districts]);

    return (
        <>
            <div className="h-[200px] sm:h-[450px] w-full pt-2 flex items-center justify-center">
                {coordinates ? (
                    <MapContainer
                        center={[coordinates.lat, coordinates.lon]}
                        zoom={12}
                        style={{ height: "100%", width: "100%", borderRadius: '12px', zIndex: '30' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[coordinates.lat, coordinates.lon]} icon={customIcon}>
                            <Popup>{districts}</Popup>
                        </Marker>
                    </MapContainer>
                ) : (
                    <span className="text-base sm:text-lg">Đang tải bản đồ...</span>
                )}
            </div>
        </>
    );
}

export default MapProduct;