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


//load the data asynchronously
d3.queue()
  .defer(d3.json, getGeoJsonURL()) //the Iowa COVID-19 geojson file
  .await(drawMap); //load the layers after the map loads

//provide instructions for drawing the map
function drawMap(err, corona) {

  var curLegend = null;
  var curLabels = null;
  var curChart = null;

  //define layers
  var baselayers = {};
  var chart = getChart();

  var title = getTitle();
  title.addTo(map);
 

  var defaultCategoryTitle = 'Confirmed Cases';
  var categories = new Map();
  categories[defaultCategoryTitle] = {name: 'Confirmed', category: null};
  categories['Percent Cases'] = {name: 'PercentConfirmed', category: null};
  categories['Confirmed Deaths'] = {name: 'Deaths', category: null};
  categories['Percent Deaths'] = {name: 'PercentDeaths', category: null};
  categories['Estimated Active'] = {name: 'Active', category: null};
  categories['Percent Active'] = {name: 'PercentActive', category: null};
  categories['Assumed Recovered'] = {name: 'Recovered', category: null};
  categories['Percent Recovered'] = {name: 'PercentRecovered', category: null};
  categories['Individuals Tested'] = {name: 'Tested', category: null};
  categories['Percent Tested'] = {name: 'PercentTested', category: null};
  categories['Confirmed Hospitalized'] = {name: 'Hospitalized', category: null};
  categories['Percent Hospitalized'] = {name: 'PercentHospitalized', category: null};


  for (var key in categories) {
    if (categories.hasOwnProperty(key)) {    

        console.log(key, categories[key]);
        categories[key].category = createMapCategory(key, categories[key].name, 9, corona);
        if (categories[key].category) {
          baselayers[ [key] ] = categories[key].category.layer;
        }
    }
  }


  //send the layers to the layer control
  L.control.layers(baselayers, null, {
    collapsed: true,
  }).addTo(map);

  chart.addTo(map);
  categories[defaultCategoryTitle].category.layer.addTo(map);

  curLegend = categories[defaultCategoryTitle].category.legend;
  curLabels = categories[defaultCategoryTitle].category.labels;
  curChart = categories[defaultCategoryTitle].category.chart;

  // when the user changes the baselayer, switch the legend and labels
  map.on('baselayerchange', function(eventLayer) {
    removeCurrentLayer(this, curChart, curLegend, curLabels);
    curLegend = categories[eventLayer.name].category.legend;
    curLabels = categories[eventLayer.name].category.labels;
    curChart = categories[eventLayer.name].category.chart;
    addCurrentLayer(this, curChart, curLegend, curLabels);
  });

  //fit the map to the extent of the cases layer upon drawing
  map.fitBounds(categories[defaultCategoryTitle].category.layer.getBounds());

  $(window).on("resize", function() {
    var mapDiv = d3.select("#map");
    if ($(window).width() <= 980) { 
      mapDiv.style("width", 100 + '%');
    }
    else {
      mapDiv.style("width", 75 + '%');
    }
    
    map.invalidateSize();
    map.fitBounds(categories[defaultCategoryTitle].category.layer.getBounds());
    console.log($(window).width())
    console.log(map.getPixelBounds())
    console.log(curLegend.getContainer())
    if (map.getZoom() < 3) {
      map.removeControl(curLegend);
    }

  }).trigger("resize");

}; //end drawMap function


