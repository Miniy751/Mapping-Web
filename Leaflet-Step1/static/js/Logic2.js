// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
var map = L.map("map", {
  center: [45.52, -122.67],
  zoom: 5
});

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



// Pull GeoJSON Data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data) {

    console.log(data);

    function getColor(d) {
      return d > 90  ? '#FF0D0D' :
             d > 70  ? '#FF4E11' :
             d > 50   ? '#FF8E15' :
             d > 30   ? '#FAB733' :
             d > 10   ? '#dfff00' :
             d > -10  ? '#63ff00':
                        '#FFEDA0';
    }
  
    function style(feature) {
      var depth = feature.geometry.coordinates.slice(2,3)
      var magnitude = feature.properties.mag
      return {
        weight: 1,
        fillOpacity: 0.8,
        color: "black",
        fillColor: getColor(depth),
        // Adjust the radius.
        radius: magnitude*magnitude*2
      };
    }


    function onEachFeature(feature, layer) {
      var id = feature.id
      var title = feature.properties.title
      var place = feature.properties.place
      var time =  feature.properties.time
      var magnitude = feature.properties.mag
      var depth = feature.geometry.coordinates.slice(2,3)
      var date = new Date(time)
          layer.bindPopup(
                          `<h3 style="text-transform:uppercase;">ID: ${id}</h3>
                           <h3>Title: ${title} </h3>
                           <h3>Place: ${place}</h3>
                           <h3>Time: ${date}</h3>
                           <h3>Magnitude ${magnitude}</h3>
                           <h3>Depth ${depth}</h3>
                        `);
      }


    // for (i in data.features) {

    //     var earthquake = data.features[i]
    //     var location = earthquake.geometry.coordinates.slice(0,2).reverse()
    //     var place = earthquake.properties.place
    //     var time = earthquake.properties.time
    //     var magnitude = earthquake.properties.mag
    //     var color = earthquake.geometry.coordinates.slice(2,3)
    //     var area = Math.pow(10, magnitude)
    // }
  
    
    L.geoJSON(data, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, style(feature));
      }
  }).addTo(map);




var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
    

    //     //Add circles to the map.
    //     L.circle(location, {
    //     fillOpacity: 0.75,
    //     color: "black",
    //     fillColor: color,
    //     // Adjust the radius.
    //     radius: Math.sqrt((area/Math.PI))*1000
    //     })
    //     .addTo(myMap)
    //     .bindPopup(`<h3>${place}</h3> <p><h4>Time: ${time}</h4></p> <p><h4>Magnitude: ${magnitude}</h4></p>`)
        
    // //close loop
    // }

    

});