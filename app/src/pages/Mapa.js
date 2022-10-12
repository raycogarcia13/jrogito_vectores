import * as React from 'react';

import { 
  Table, 
  Modal,
  message,
  Space, 
  Card, 
  Divider, 
  Button, 
  Typography, 
  Form,
  Input,
  Tooltip,
} from 'antd';

// import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer,useMap } from 'react-leaflet'
import L,{ latLng } from "leaflet";
// import HeatmapLayer from '../utils/HeatmapLayer';
export default function DataTable() {
  
  return (
      <Card style={{ width: '100%',paddingBottom:'10vh' }}>
         
         <MapContainer 
         style={{height: '80vh', zIndex:'1'}}
          bounds={[ [21.8932641596, -82.8244219401], [21.9016376414, -82.8096053901] ]} 
          center={latLng(21.75, -82.85)} 
          attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
          zoom={13} 
          scrollWheelZoom={true}>
          <TileLayer
            attribution='<a href="mailto:rayco.garcia13@nauta.cu>r@ancode</a>'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
        </MapContainer>


      </Card>
  );
}