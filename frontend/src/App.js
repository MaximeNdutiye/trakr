import React, { Component } from 'react';
//import logo from '../Assets/logo-no-background.png';
import './App.css';
import Map from './components/Map'; 

export default class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      packageList:[]
    }
  }
  
  async componentDidMount() { 
    const response = await fetch('https://somethingweird.lib.id/trakr@dev/package/all/')
    const jsonStr = await response.json()
    this.setState({packageList: JSON.parse(jsonStr)})
  }
  
  render() {
    return (
      <div>
        <h1 className="mainTitle">Trakr</h1>
        <div className="Map-container">
          <div className="sideNav">
            <p className="sideBar-Title">Packages</p>
            <ul className="packages">
              {this.state.packageList.map(({tracking_id, carrier_name}) => (
                <li className="packageItem" key={tracking_id}>
                  <ul className="packageItemList">
                    <li className="item">Carrier: {carrier_name}</li>
                    <li className="item">Id: {tracking_id}</li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div> 
            <Map markers={this.markers()}/>
          </div> 
        </div>
      </div>
    )
  }
  
  markers = () => {
    return this.state.packageList.map(pkg => {
      if (!pkg.locations || !pkg.locations[pkg.locations.length - 1]) {
        return null;  
      }
      
      console.log(pkg.locations[pkg.locations.length - 1])
      
      return {
        name: pkg.carrier_name,
        position: {
          lat: pkg.locations[pkg.locations.length - 1].latitude,
          lng: pkg.locations[pkg.locations.length - 1].longitude,
        }
      }
    })
  }
}




