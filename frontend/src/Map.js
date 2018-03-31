import React, { Component } from 'react';
import ReactDOM from 'react'; 

export class Map extends React.Component {
    constructor(props) {
        super(props);
        
        const {lat, lng} = this.state.currentLocation;
        this.state = {
            currentLocation: {
                lat: lat,
                lng: lng
            }
        }
    }
    
    componentDidMount() {
        if (this.props.centerAroundCurrentLocation) {
            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const coords = pos.coords;
                    this.setState({
                        currentLocation: {
                            lat: coords.latitude,
                            lng: coords.longitude
                        }
                    })
                })
            }
        }
        this.loadMap();
    }
  
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
          this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
          this.recenterMap();
        }
    }
    
    loadMap() {
        if (this.props && this.props.google) {
            // google is available
            const {google} = this.props;
            const maps = google.maps;
            
            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);
            
            let {initialCenter, zoom} = this.props;
            const {lat, lng} = initialCenter;
            const center = new maps.LatLng(lat, lng);
            const mapConfig = Object.assign({}, {
                center: center,
                zoom: zoom
                })
                
            this.map = new maps.Map(node, mapConfig);

            let centerChangedTimeout;
            this.map.addListener('dragend', (evt) => {
                if (centerChangedTimeout) {
                  clearTimeout(centerChangedTimeout);
                  centerChangedTimeout = null;
                }
                centerChangedTimeout = setTimeout(() => {
                  this.props.onMove(this.map);
                }, 0);
            })
        }
    }
    
    recenterMap() {
        const map = this.map;
        const curr = this.state.currentLocation;
    
        const google = this.props.google;
        const maps = google.maps;
    
        if (map) {
            let center = new maps.LatLng(curr.lat, curr.lng)
            map.panTo(center)
        }
    }
  
    render() {
        return (<h1>Hello world</h1>); 
    }
}

Map.propTypes = {
  google: React.PropTypes.object,
  zoom: React.PropTypes.number,
  initialCenter: React.PropTypes.object,
  centerAroundCurrentLocation: React.PropTypes.bool,
  onMove: React.PropTypes.func
}
Map.defaultProps = {
  onMove: function() {}
}