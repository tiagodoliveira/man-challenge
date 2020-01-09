import React, { Component } from 'react';
import {MainForm} from './MainForm';
import {loadGoogleMaps} from './services'

class App extends Component{

  componentDidMount(){

    let googleMapsPromise = loadGoogleMaps();

    //Rendering the Google maps for the first time at the MAN Digital Hub headquarters 
    Promise.all([googleMapsPromise]).then(values => {
      let google = values[0];
      this.google = google;
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        scrollwheel: true,
        center: {lat: 38.717121, lng: -9.149210}
      });
    });
  }
  render(){
    return (
      <div >
        <MainForm></MainForm>
        <div id="map" ></div>
      </div>
    );
  }
}

export default App;