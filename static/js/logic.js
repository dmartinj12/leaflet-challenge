let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Fetch the earthquake data
d3.json(earthquakeURL).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function to determine the color based on earthquake depth
  function getColor(depth) {
    let color;
    if (depth > 90) {
      color = '#ff0000';
    } else if (depth > 70) {
      color = '#ffa500';
    } else if (depth > 50) {
      color = '#ffff00';
    } else if (depth > 30) {
      color = '#008000';
    } else if (depth > 10) {
      color = '#B6D800';
    } else {
      color = '#90ee90';
    }
    return color; 
  } 
  
  // Function to create popups 
  function pointToLayer(feature, latlng) {
    console.log(feature.geometry.coordinates[2])
    return L.circleMarker(latlng, {
      radius: feature.properties.mag * 3, 
      fillColor: getColor(feature.geometry.coordinates[2]), 
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }

// Creating the properties for the popups

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

// Creation of the popups
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  createMap(earthquakes);
}

let myMap;

function createMap(earthquakes) {

// Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let satelitte =     L.tileLayer(
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="http://www.esri.com/">Esri</a>i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

// Creating the different layers name's

  let baseMaps = {
      "Grey Scale": street,
      "Outdoors": topo,
      "Satellite": satelitte
    };
// Create toggable popups
    let overlayMaps = {
      Earthquakes: earthquakes
    };

// Create the map
  let myMap = L.map("map", {
    center: [39.8283, -98.5795], 
    zoom: 5,
    layers: [street, earthquakes]
  });

// Add the layers to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Create the legend

  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
  
// Define limits for the legend
    var limits = [-10, 10, 30, 50, 70, 90, 110];
    var colors = ['#90ee90', '#B6D800', '#008000', '#ffff00', '#ffa500', '#ff0000'];
    var labels = [];
  
  
// Create labels with specified ranges
    for (let i = 0; i < limits.length - 1; i++) {
      let label;
      if (i === limits.length - 2) { 
        label = limits[i] + '+';
      } else {
        label = limits[i] + '-' + limits[i + 1]; 
      }
  
// Append the legend and the label separately
      div.innerHTML += '<div style="display: flex; align-items: center;">' +
                       '<div style="background-color: ' + colors[i] + '; width: 20px; height: 20px; margin-right: 8px;"></div>' +
                       '<span>' + label + '</span>' +
                       '</div>';
    }
  
    return div;
  }
  
  legend.addTo(myMap);

}


