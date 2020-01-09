
const API_KEY = "AIzaSyBob70viGuD9PCxbg5xAwqYzuGuEQZR4qo";


export function loadGoogleMaps()
{
    return new Promise(function(resolve, reject){

        window.resolveGoogleMapsPromise = function(){
            resolve(window.google);
            delete window.resolveGoogleMapsPromise;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
    })
}


export function loadPlaces(poi, location, radius){
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    var apiURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + poi + '&type=' + poi + '&location=' + location + '&radius=' + radius + '&key=' + API_KEY;
    
    return fetch(proxyurl + apiURL)
    .then(resp => resp.json())
    .catch(() => console.log("Can’t access " + apiURL + " response. Blocked by browser?"))
}


export function loadVehicleLocations(license){
    var apiURL = "https://man-challenge-api.herokuapp.com/vehicles/" + license;
    
    return fetch(apiURL)
    .then(resp => resp.json())
    .catch(() => console.log("Can’t access " + apiURL + " response. Blocked by browser?"))
}