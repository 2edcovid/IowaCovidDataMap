// initialize our map
var map = L.map('map', { 
  minZoom: 7,
  maxZoom: 11,
  zoomControl: false,
  zoomSnap: 0.25
 });

//add esri topo basemap
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {  
}).addTo(map);

var useYesterday = false;
useYesterday = fallBackToYesterday(getGeoJsonURL());
var Today = getDate();
var curDateString = getDateString(Today);
function loadMap(url) {
  //load the data asynchronously
  d3.queue()
    .defer(d3.json, url) //the Iowa COVID-19 geojson file
    .await(drawMap); //load the layers after the map loads
}

loadMap(getGeoJsonURL());
