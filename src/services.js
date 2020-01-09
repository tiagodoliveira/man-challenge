const configs = require('./configs.json');
const API_KEY = "AIzaSyBob70viGuD9PCxbg5xAwqYzuGuEQZR4qo";


export function loadGoogleMaps()
{
    return new Promise(function(resolve, reject){

        window.resolveGoogleMapsPromise = function(){
            resolve(window.google);
            delete window.resolveGoogleMapsPromise;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${configs.API_KEY}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
    });
}


export function loadPlaces(poi, location, radius){
    var apiURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + poi + '&type=' + poi + '&location=' + location + '&radius=' + radius + '&key=' + configs.API_KEY;
    
    return fetch(configs.proxyURL + apiURL)
    .then(resp => resp.json())
    .catch(() => console.log("Can’t access " + apiURL + " response. Blocked by browser?"));
}


export function loadVehicleLocations(license){
    return fetch(configs.apiURL + license)
    .then(resp => resp.json())
    .catch(() => console.log("Can’t access " + configs.apiURL + " response. Blocked by browser?"));
}