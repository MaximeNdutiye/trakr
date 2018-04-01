import React from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';


function MapContainer(props) {
  
  return (
    <Map  style={style} 
          center={props.centeredPosition}
          className="map-wrapper" google={props.google} zoom={6}>
      {props.markers.map(marker => {
        console.log(marker)
        return marker && <Marker title={marker.name} name={marker.name} position={marker.position} />
      })}
      
    </Map>
  );
}

 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyCl-X16rxHg7XPLGcc-L8cNBYNuBtX-_sM')
})(MapContainer)

const style = {
  width: '71%', 
  height: '80%',
  display: 'fixed'
}