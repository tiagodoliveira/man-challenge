import React from 'react'
import { loadGoogleMaps, loadPlaces, loadVehicleLocations } from './services'


/* 
React component that generates the submission form for user interaction
as well as fetching and drawing the POIs using the Google Places API and
the geo-locations of all the vehicles registered in the database from the 
created Spring Boot backend server.
*/ 
export class MainForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { license: '', poi: 'all', radius: '5' };

        this.handlePOI = this.handlePOI.bind(this);
        this.handleRadius = this.handleRadius.bind(this);
        this.handleLicense = this.handleLicense.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleLicense(event) {
        this.setState({ license: event.target.value });
    }

    handlePOI(event) {
        this.setState({ poi: event.target.value });
    }

    handleRadius(event) {
        this.setState({ radius: event.target.value });
    }

    //Function that handles the form submition
    handleSubmit(event) {

        let poiTypes = [this.state.poi];

        if (this.state.poi === "all") {
            poiTypes = ["gas station", "restaurant", "hotel"];
        }

        //Load Google Maps and get the specified vehicle's locations
        let googleMapsPromise = loadGoogleMaps();
        let vehicleLocationsPromise = loadVehicleLocations(this.state.license);

        Promise.all([googleMapsPromise, vehicleLocationsPromise]).then(values => {

            //Retrieve the google maps object and the vehicle path coordinates
            let google = values[0];
            let vehicleLocations = values[1];
            const locationsLength = Object.keys(vehicleLocations).length;
            const currentLocation = 
                vehicleLocations[locationsLength - 1].lat + ',' +
                vehicleLocations[locationsLength - 1].lng;
            let selectedVehicleLocation;
            
            //Draw the map centered on the vehicle's current location
            this.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                scrollwheel: true,
                center: { 
                    lat: vehicleLocations[locationsLength - 1].lat,
                    lng: vehicleLocations[locationsLength - 1].lng
                }
            });

            //Set the vehicle's path marker's size and icon 
            let markerSize = new google.maps.Size(25, 25);
            let vehicleFirstMarker = "imgs/icn-first-location.png";
            let vehiclePathMarker = "imgs/icn-path.png";
            let vehicleCurrentLocationMarker = "imgs/icn-current-location.png";
            let markerIcon = vehicleFirstMarker;
            let lastLocationMarker;
            
            var i;
            var currentLicense = vehicleLocations[0].license;
            
            for (i = 0; i < locationsLength; i++) {
                
                //If we reached the end of the array or the next vehicle in the array
                // is a different vehicle, then this is the current vehicle's current location
                // otherwise we are currently drawing the current vehicle's path
                if(typeof vehicleLocations[i + 1] === 'undefined' ||
                    vehicleLocations[i + 1].license !== currentLicense){
                    markerIcon = vehicleCurrentLocationMarker;
                    markerSize = new google.maps.Size(40, 40);
                }else{
                    markerSize = new google.maps.Size(20, 20);
                    markerIcon = vehiclePathMarker;
                }

                //Verify if the current vehicle's location belongs to the current vehicle
                // if not, then we are now processing a different vehicle
                if(vehicleLocations[i].license !== currentLicense){
                    currentLicense = vehicleLocations[i].license;
                    markerSize = new google.maps.Size(25, 25);
                    markerIcon = vehicleFirstMarker;
                }

                //Drawing the vehicle's marker in the map 
                let currentLocationMarker = new google.maps.Marker({
                    position: { lat: vehicleLocations[i].lat, lng: vehicleLocations[i].lng },
                    map: this.map,
                    id: vehicleLocations[i].id,
                    animation: google.maps.Animation.DROP,
                    icon: {
                        url: markerIcon,
                        scaledSize: markerSize
                    },
                    license: currentLicense
                });

                //In case of multiple vehicles in the map, by clicking on the vehicle's current marker,
                //that vehicle will be selected and distances will be calculated based on it's location
                //The license plate of that vehicle will also be shown to show the possiblity of creating
                //a card with additional information regarding the vehicle or the driver
                google.maps.event.addListener(currentLocationMarker,'click', () => {
                    let infoCard = '<div class="info_box"> <h3>License: ' + currentLocationMarker.license + '</h3> </div>';
                    this.infowindow.setContent(infoCard);
                    this.map.setCenter(currentLocationMarker.position);
                    this.infowindow.open(this.map, currentLocationMarker);
                    this.map.panBy(0, -125); 

                    //Setting an animation to give a visual reference of which vehicle is selected
                    if (currentLocationMarker.getAnimation() !== null && 
                    currentLocationMarker.position !== lastLocationMarker.position) {
                         currentLocationMarker.setAnimation(null); 
                    }
                    else {
                         currentLocationMarker.setAnimation(google.maps.Animation.BOUNCE); 
                        }

                    if(currentLocationMarker.position !== lastLocationMarker.position)
                        lastLocationMarker.setAnimation(null);

                    selectedVehicleLocation = currentLocationMarker.position;
                    lastLocationMarker = currentLocationMarker;
                });

                lastLocationMarker = currentLocationMarker;
                selectedVehicleLocation = currentLocationMarker.position;
            }

            //Setting the animation for the current selected vehicle marker
            lastLocationMarker.setAnimation(google.maps.Animation.BOUNCE); 

            poiTypes.forEach(poiType => {

                let placesPromise = loadPlaces(poiType, currentLocation, this.state.radius);

                Promise.all([placesPromise]).then(values => {

                    let pois = values[0].results;
                    this.google = google;
                    this.infowindow = new google.maps.InfoWindow();

                    pois.forEach(poi => {

                        //Set the location's marker's by it's type 
                        markerIcon = "imgs/icn-hotel.png";

                        if (poi.types.indexOf("restaurant") > -1) 
                            markerIcon = "imgs/icn-restaurant.png";
                        
                        if (poi.types.indexOf("gas_station") > -1) 
                            markerIcon = "imgs/icn-gas-station.png";

                        //Drawing the location's marker in the map 
                        let marker = new google.maps.Marker({
                            position: { lat: poi.geometry.location.lat, lng: poi.geometry.location.lng },
                            map: this.map,
                            name: poi.geometry.name,
                            id: poi.geometry.id,
                            animation: google.maps.Animation.DROP,
                            icon: {
                                url: markerIcon,
                                scaledSize: new google.maps.Size(50, 50)
                            }
                        });

                        //Setting a click listener to create a card that will display the location
                        //information as well as it's distance from the current selected vehicle 
                        google.maps.event.addListener(marker, 'click', () => {

                            //Computing the distance between the poi and the vehicle
                            var distance = google.maps.geometry.spherical.computeDistanceBetween(
                                marker.getPosition(), 
                                selectedVehicleLocation
                            );

                            let infoCard = '<div class="info_box">' +
                            '<h3>Distance: ' + Math.round(distance) + 'm</h3>' +
                            '<h4>' + poi.name + '</h4>' +
                            '<p>' + poi.formatted_address + '</p>' +
                            '<img class="middlr" alt="' + poi.name + '" src="' + poi.icon + '" />' +
                            '</div>';

                            this.infowindow.setContent(infoCard);
                            this.map.setCenter(marker.position);
                            this.infowindow.open(this.map, marker);
                            this.map.panBy(0, -125); 

                            if (marker.getAnimation() !== null) { marker.setAnimation(null); }
                            else { marker.setAnimation(google.maps.Animation.BOUNCE); }
                            setTimeout(() => { marker.setAnimation(null) }, 1500);
                        });
                    });
                });
            });
        });
        event.preventDefault();
    }

    //Render of the form that creates the GUI
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className={'display-box'}>

                    <div className={'component-container'}>
                        <input type="text" value={this.state.license} onChange={this.handleLicense} className={'component-start'} placeholder={"Search by license plate"} />
                    </div>

                    <div className={'component-container'}>
                        <select value={this.state.poi} onChange={this.handlePOI} className={'component-middle'}>
                            <option value="all">View all</option>
                            <option value="gas station">Gas Stations</option>
                            <option value="restaurant">Restaurants</option>
                            <option value="hotel">Hotels</option>
                        </select>
                    </div>

                    <div className={'component-container'}>
                        <select value={this.state.radius} onChange={this.handleRadius} className={'component-middle'}>
                            <option value="100">100 m</option>
                            <option value="200">200 m</option>
                            <option value="500">500 m</option>
                            <option value="750">750 m</option>
                            <option value="1000">1 km</option>
                            <option value="2000">2 km</option>
                            <option value="5000">5 km</option>
                            <option value="10000">10 km</option>
                            <option value="25000">25 km</option>
                            <option value="50000">50 km</option>
                        </select>
                    </div>

                    <div className={'component-container'}>
                        <button type="submit" className={'component-end'}>Apply</button>
                    </div>
                </div>
            </form>
        );
    }
}