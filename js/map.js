var categories = null;
var curLegend = null;
var curLabels = null;
var curChart = null;
var layerControl = null;
var baselayers = {};

function resetMap() {
  if (categories && curLegend && curLabels && curChart && layerControl) {
    removeCurrentLayer(map, curChart, curLegend, curLabels);

    for (var key in categories) {
      if (categories.hasOwnProperty(key && baselayers[ [key] ])) {    
        layerControl.removeLayer(baselayers[ [key] ])
      }
    }

    map.removeControl(layerControl);
    categories = null;
    curLegend = null;
    curLabels = null;
    curChart = null;
    layerControl = null;
    baselayers = {};
  }

}

//provide instructions for drawing the map
function drawMap(err, corona) {
  //define layers
  baselayers = {};

  var title = getTitle();
  title.addTo(map);
 
  var defaultCategoryTitle = 'Confirmed Cases';
  categories = new Map();

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

        // console.log(key, categories[key]);
        categories[key].category = createMapCategory(key, categories[key].name, 9, corona);
        if (categories[key].category) {
          baselayers[ [key] ] = categories[key].category.layer;
        }
    }
  }

  //send the layers to the layer control
  layerControl = L.control.layers(baselayers, null, {
    collapsed: true,
  });
  layerControl.addTo(map);

  
  categories[defaultCategoryTitle].category.layer.addTo(map);

  curLegend = categories[defaultCategoryTitle].category.legend;
  curLabels = categories[defaultCategoryTitle].category.labels;
  curChart = categories[defaultCategoryTitle].category.chart;

  // when the user changes the baselayer, switch the legend and labels
  map.on('baselayerchange', function(eventLayer) {
    if (curChart && curLegend && curLabels) {
      removeCurrentLayer(this, curChart, curLegend, curLabels);
    }
    
    curLegend = categories[eventLayer.name].category.legend;
    curLabels = categories[eventLayer.name].category.labels;
    curChart = categories[eventLayer.name].category.chart;
    addCurrentLayer(this, curChart, curLegend, curLabels);
  });

  //fit the map to the extent of the cases layer upon drawing
  map.fitBounds(categories[defaultCategoryTitle].category.layer.getBounds());

  map.on('zoomstart zoom zoomend', function(ev){
    // console.log('Zoom level: ' + map.getZoom())
    var multiplier = (map.getZoom() - 5)/2;
    d3.selectAll("h3").style("font-size", multiplier * 1.2 + "em")
    d3.selectAll("h2").style("font-size", multiplier * 1.2 + "em")
  })

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
    // console.log($(window).width())
    // console.log(map.getPixelBounds())
    // console.log(curLegend.getContainer())
    if (map.getZoom() < 3) {
      map.removeControl(curLegend);
    }

  }).trigger("resize");

}; //end drawMap function

