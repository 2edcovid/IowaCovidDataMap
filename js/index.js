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

function loadMap(url) {
  //load the data asynchronously
  d3.queue()
    .defer(d3.json, url) //the Iowa COVID-19 geojson file
    .await(drawMap); //load the layers after the map loads
}

loadMap(getGeoJsonURL());


  var StartDate = new Date(2020, 2, 8);
  var Today = new Date();
  var DaysSinceStart = Math.trunc((Today.getTime() - StartDate.getTime())  / (1000 * 3600 * 24));

  console.log(DaysSinceStart);

  // Time
  var dataTime = d3.range(0, DaysSinceStart).map(function(d) {
    return new Date(2020, 2, 8 + d);
  });

  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24)
    .width(650)
    .height(80)
    .tickFormat(d3.timeFormat('%Y %m %d'))
    .tickValues(dataTime)
    .default(Today)
    .on('onchange', val => {
      d3.select('.value-time').text(getTitleText(sliderTime));
    });

  var gTime = d3
    .select('#header')
    .append('svg')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + 720 + " " + 50)
    .classed("slider-content", true)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gTime.append("text")
    .attr("class", "value-time")
    .attr("y", -10)
    // .attr("y", 10)
    .text(getTitleText(sliderTime));

  gTime.call(sliderTime);

  function getTitleText(sliderTime) {
    var titleText = `Data as of ${d3.timeFormat('%m/%d/%Y')(sliderTime.value())}`;
    return titleText;
  }
  // d3.select('h6#value-time').text();
