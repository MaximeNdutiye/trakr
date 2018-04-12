import React, { Component } from 'react';
import logo from '../src/logo-no-background-outline.png';
import './App.css';
import Map from './components/Map'; 
require('dotenv').config();

export default class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      packageList:[], 
      centeredPosition:{},
      activeMarker:{}
    }
  }
  
  async componentDidMount() { 
    const response = await fetch('https://somethingweird.lib.id/trakr@dev/package/all/')
    const jsonStr = await response.json()
    const parsedData = JSON.parse(jsonStr).data
    this.setState({packageList: parsedData})
  }
  
  componentWillUpdate(nextProps, nextState){
    const packageId = nextState.activeMarker.id;
    const packageListItem = document.getElementById(packageId); 
    if(packageListItem)
      packageListItem.style.backgroundColor = "#4fc3f7"; 
    
  }
  
  componentDidUpdate(prevProps, prevState){
    const packageId = prevState.activeMarker.id;
    const packageListItem = document.getElementById(packageId); 
    if(packageListItem && packageId !== this.state.activeMarker.id)
      packageListItem.style.backgroundColor = "white"; 
  }
  
  render() {
    return (
      <div>
        <img alt="Trackr logo"className="mainTitle" src={logo}></img>
        <div className="Map-container">
          <div className="sideNav">
            <h1 className="sideBar-Title ">All Packages</h1>
            <ul className="packages">
              {this.state.packageList.map(({tracking_id, carrier_name, locations, display_name}) => (
                <li 
                  className="packageItem" 
                  key={tracking_id} 
                  onClick={() => {
                    this.setState({
                    centeredPosition: locationsToPosition(locations),
                    activeMarker: {id: tracking_id}
                  })}}
                  id={tracking_id}
                >
                  <ul className="packageItemList">
                    <li className="item" style={{fontWeight: 'bold'}}>{display_name}</li>
                    <li className="item">Carrier: {carrier_name}</li>
                    <li className="item">Id: {tracking_id}</li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <Map markers={this.markers()} centeredPosition={this.state.centeredPosition}/>
        </div>
        <div className="footer">
          <p>Trackr</p>
          <p>Created by:</p>
          <a href="https://github.com/Azhng">@Azhang</a><br/>
          <a href="https://github.com/PatzHum">@PatzHum</a><br/>
          <a href="https://github.com/MaximeNdutiye">@MaximeNdutiye</a><br/>
        </div>
      </div>
    )
  }
  
  markers = () => {
    return this.state.packageList.map(pkg => ({
      name: 
        "Package: " + pkg.tracking_id +  
        ", To: " + pkg.locations[0].name + 
        ", Carrier " + pkg.carrier_name,
      title: pkg.name,
      id: pkg.tracking_id,
      position: locationsToPosition(pkg.locations),
      onMarkerClick: (props, marker, e) => {
        this.setState({
          activeMarker: marker,
      });
      }
    }))
  }
}

function locationsToPosition(locations) {
  if (!locations) {
    return null;
  }
  
  const latestLocation = locations[locations.length - 1]
  
  if (!latestLocation) {
    return null;  
  }
  
  return {
    lat: latestLocation.latitude,
    lng: latestLocation.longitude,
  }
}


