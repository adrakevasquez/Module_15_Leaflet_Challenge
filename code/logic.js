//store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Add a Leaflet tile layer.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a Leaflet map object.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streetmap]
});


//define basemaps as the streetmap
let baseMaps = {
    "Street": streetmap
};

//define the earthquake layergroup and tectonic plate layergroups for the map
let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

//define the overlays and link the layergroups to separate overlays
let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};

//add a control layer and pass in baseMaps and overlays
L.control.layers(baseMaps, overlays).addTo(myMap);

//this styleInfo function will dictate the stying for all of the earthquake points on the map
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag), //sets radius based on magnitude 
        fillColor: chooseColor(feature.geometry.coordinates[2]) //sets fillColor based on the depth of the earthquake
    }
};

//define a function to choose the fillColor of the earthquake based on earthquake depth
function chooseColor(depth) {
    if (depth <= 10) return "green";
    else if (depth > 10 & depth <= 30) return "yellow-green";
    else if (depth > 30 & depth <= 50) return "yellow";
    else if (depth > 50 & depth <= 70) return "orange";
    else if (depth > 70 & depth <= 90) return "red-orange";
    else return "red";
};

//define a function to determine the radius of each earthquake marker
function chooseRadius(magnitude) {
    return magnitude*5;
};

d3.json(url).then(function (data) { //pull the earthquake JSON data with d3
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  //declare a point to layer function that takes a feature and latlon
            return L.circleMarker(latlon).bindPopup(feature.id); //function creates a circleMarker at latlon and binds a popup with the earthquake id
        },
        style: styleInfo //style the CircleMarker with the styleInfo function as defined above
    }).addTo(earthquake_data); // add the earthquake data to the earthquake_data layergroup / overlay
    earthquake_data.addTo(myMap);

    //this function pulls the tectonic plate data and draws over the plates
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) { //pulls tectonic data with d3.json
        L.geoJson(data, {
            color: "orange",
            weight: 3
        }).addTo(tectonics); //add the tectonic data to the tectonic layergroup / overlay
        tectonics.addTo(myMap);
    });


});

function getColor(d) {
    return d < 0 ? 'rgb(144,238,144)' :
          d < 10  ? 'rgb(144,238,144)' :
          d < 30  ? 'rgb(154, 205, 50)' :
          d < 50  ? 'rgb(255, 255, 0)' :
          d < 70  ? 'rgb(255, 165, 0)' :
          d < 90  ? 'rgb(255, 105, 0)' :
                         'rgb(255,105,105)';
    
    }

// Create a legend to display information about our map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [-10, 10, 30, 50, 70, 90],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);

//collect data with d3
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let results = features.filter(id => id.id == "nc73872510"); //replace the id string with the argument of the function once created
    let first_result = results[0];
    console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); // longitude
    console.log(coordinates[1]); // latitude
    console.log(coordinates[2]); // depth of earthquake
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    //define depth variable
    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);

});