import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Coordinates for Nepal districts
const districtCoords = {
  Kathmandu: [27.7172, 85.3240],
  Lalitpur: [27.6588, 85.3247],
  Bhaktapur: [27.6710, 85.4298],
  Pokhara: [28.2096, 83.9856],
  Chitwan: [27.5291, 84.3542],
  Butwal: [27.7006, 83.4532],
  Biratnagar: [26.4525, 87.2718],
  Dharan: [26.8120, 87.2840],
  Hetauda: [27.4167, 85.0333],
  Other: [27.7172, 85.3240],
};

const ServiceMap = ({ services }) => {
  const servicesWithCoords = services?.filter(
    (s) => s.location?.district && districtCoords[s.location.district]
  ) || [];

  return (
    <MapContainer
      center={[27.7172, 85.3240]}
      zoom={10}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {servicesWithCoords.map((service) => {
        const coords = districtCoords[service.location.district];
        // Add slight random offset so markers don't stack
        const offset = [
          coords[0] + (Math.random() - 0.5) * 0.02,
          coords[1] + (Math.random() - 0.5) * 0.02,
        ];
        return (
          <Marker key={service._id} position={offset}>
            <Popup>
              <div className="p-1 min-w-[160px]">
                <p className="text-xs font-semibold text-orange-500 uppercase">{service.category}</p>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{service.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {service.location.district}, {service.location.city}
                </p>
                <p className="font-bold text-gray-900 text-sm mt-1">Rs. {service.price}</p>
                <Link
                  to={`/services/${service._id}`}
                  className="block mt-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg text-center hover:bg-orange-600 transition-colors"
                >
                  View Service
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default ServiceMap;