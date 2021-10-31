// Tile layer 
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 15
});

  
  // Add the tile layer
  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);

// the url to be used.
var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"


// obtaining data from json
d3.json(quakeUrl).then(function(earthquakes) {

  var quakeFeatures = earthquakes.features;

  // checking for duplicates before adding popups
  function popupFromFeature(feature, layer) {
    if (feature.properties && feature.properties.place && feature.properties.time) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}`);
    }
}
// conditions for colors
markercolor = ["#008000","#ffc40c","#f08080","#cd5c5c","#ff0000","#8b0000","#480607"]
function getColor(magnitude) {
  return magnitude >= 5 ? markercolor[5]:
         magnitude >= 4 ? markercolor[4]:
         magnitude >= 3 ? markercolor[3]:
         magnitude >= 2 ? markercolor[2]:
         magnitude >= 1 ? markercolor[1]:
         markercolor[0];
}

  L.geoJSON(quakeFeatures, {
      pointToLayer: function(feature, latlng) {
        var quakeDepth = feature.geometry.coordinates[2];
        
        // get magnitude from json
        var mag = feature.properties.mag;
        // 
        var circles = {
            radius: (10**(mag/5)),
            color: getColor(quakeDepth),
            fillcolor: getColor(quakeDepth),
            fillOpacity: 1
        }  

        return L.circleMarker(latlng, circles)
      }
  ,onEachFeature: popupFromFeature}).addTo(myMap);

  // add legends 
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
    labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<h3>Earthquake Depth</h3></hr>'
    for (var i = 0; i <= 5; i++) {
      div.innerHTML += '<p><span style="font-size:20px; background-color:' + getColor(i) +
        ';">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + labels[i] + '</p>';
    }
    
    return div;
  };

  // Add legend
  legend.addTo(myMap);

});