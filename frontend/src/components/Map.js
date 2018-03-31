import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

class MapContainer extends Component {
render() {
    return (
      <Map style={style} google={this.props.google} zoom={14}>
      
        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />
        <InfoWindow onClose={this.onInfoWindowClose}>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyCl-X16rxHg7XPLGcc-L8cNBYNuBtX-_sM')
})(MapContainer)


const style = {
    width: '50%', 
    height: '50%', 
    margin: '10px'
}