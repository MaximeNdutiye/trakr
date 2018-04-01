import React from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';


function MapContainer(props) {
  return (
    <Map  style={style} 
          center={props.centeredPosition}
          google={props.google} zoom={6}>
      {props.markers.map(marker => {
        console.log(marker)
        return marker && 
          <Marker 
            title= {marker.name}
            name={marker.name} 
            id={marker.id}
            onClick={marker.onMarkerClick}
            position={marker.position} />
      })}
      
    </Map>
  );
}


export default GoogleApiWrapper({
  apiKey: ('AIzaSyCl-X16rxHg7XPLGcc-L8cNBYNuBtX-_sM')
})(MapContainer)

const style = {
  boxsizing: 'border-box',
  width: '72%', 
  height: '80%',
  display: 'fixed'
}