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
        <h1>Trakr</h1>
        <h2>Packages</h2>
        <ul>
          {this.state.packageList.map(({tracking_id}) => (
            <li key={tracking_id}>{tracking_id}</li>
          ))}
        </ul>
        <div className="Map-container"> 
          <Map markers={this.markers()}/>
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




