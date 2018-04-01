import React from 'react';
import {Map,Marker, GoogleApiWrapper} from 'google-maps-react';


function MapContainer(props) {
  return (
    <Map style={style} google={props.google} zoom={14}>
      {props.markers.map(marker => {
        marker && <Marker name={marker.name} position={marker.position} />
      })}
    </Map>
  );
}

 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyCl-X16rxHg7XPLGcc-L8cNBYNuBtX-_sM')
})(MapContainer)


const style = {
    width: '80%', 
    height: '50%', 
    margin: '0px', 
    position: 'relative'

}
