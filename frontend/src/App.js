import React, { Component } from 'react';
//import logo from '../Assets/logo-no-background.png';
import './App.css';
import Map from './components/Map'; 

export default class App extends Component {
  render() {
    return (
      <div class="App-container">
        <h1>Trakr</h1>
        <div class="map-wrapper"> 
          <Map />
        </div> 
      </div>
    )
  }
}




