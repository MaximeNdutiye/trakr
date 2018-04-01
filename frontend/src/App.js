import React, { Component } from 'react';
import logo from '../src/logo-no-background.png';
import './App.css';
import Map from './components/Map'; 

export default class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      packageList:[], 
      centeredPosition:{}
    }
  }
  
  async componentDidMount() { 
    
    const response = await fetch('https://somethingweird.lib.id/trakr@dev/package/all/')
    const jsonStr = await response.json()
    const parsedData = JSON.parse(jsonStr).data
    this.setState({packageList: parsedData})
  }
  
  render() {
    return (
      <div>
        
        <div className="Map-container">
          <div className="sideNav">
            <p className="sideBar-Title">Packages</p>
            <ul className="packages">
              {this.state.packageList.map(({tracking_id, carrier_name, locations}) => (
                <li 
                  className="packageItem" 
                  key={tracking_id} 
                  onClick={() => this.setState({
                    centeredPosition: locationsToPosition(locations)
                  })}
                >
                  <ul className="packageItemList">
                    <li className="item">Carrier: {carrier_name}</li>
                    <li className="item">Id: {tracking_id}</li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div> 
            <Map markers={this.markers()} centeredPosition={this.state.centeredPosition}/>
          </div> 
        </div>
      </div>
    )
  }
  
  markers = () => {
    return this.state.packageList.map(pkg => ({
      name: pkg.name,
      position: locationsToPosition(pkg.locations)
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



