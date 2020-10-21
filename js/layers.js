
function createMapCategory(layerTitle, layerName, layerBreaks, corona) {
  var mapCategory = null;

  console.log(layerName)
  if (layerName.includes("Percent"))
  {
    previousTotal = getTotal(layerName.replace("Percent", ""), corona.features);
    var layerTotal = getTotalPercent(previousTotal, corona.features);
  } else {
    var layerTotal = getTotal(layerName, corona.features);
  }
  console.log(layerTotal)

  if (layerTotal > 0) {
    var layerLabels = [];
    var layerStops = getStops(layerName, layerBreaks, corona.features);
    var layerLayer = getLayer(corona, layerName, layerStops, layerTitle, layerTotal, layerLabels);
    var layerLegend = getLegend(layerTitle, layerStops, layerTotal);
    var layerChart = getChartContents(layerName, corona.features, layerStops, layerTitle, layerTotal);
  
    var mapCategory = {
      title: layerTitle,
      labels: layerLabels,
      name: layerName,
      total: layerTotal,
      stops: layerStops,
      layer: layerLayer,
      legend: layerLegend,
      chart: layerChart
    };
  }


  return mapCategory;
}

function removeCurrentLayer(map, curChart, curLegend, curLabels) {
  map.removeControl(curChart);
  map.removeControl(curLegend);
  for (i = 0; i < curLabels.length; i++) {
    map.removeControl(curLabels[i]);
  }
}
  
function addCurrentLayer(map, curChart, curLegend, curLabels) {
  curLegend.addTo(map);
  curChart.addTo(map);
  for (i = 0; i < curLabels.length; i++) {
    curLabels[i].addTo(map);
  }
}

function styleFeature(color) {
  return {
    stroke: 1,
    color: "grey",
    weight: 1,
    fillColor: color,
    fillOpacity: .75
  };
};
 
function getPopup(props, title, name, total) {
  return '<h4><b>' + props.Name + ' County' +
  '<br>' + 'Population: ' + props.pop_est_2018 + '</b>' +
  '<br><br>' + title + ': ' + props[name] +
  '<br>Statewide Total: ' + total +
  '<br>Last Updated: ' + props.last_updated.substring(0, props.last_updated.length - 8) +
  '</h4>';
};
 
function getLabel(layer, props, name, style) {
  return L.marker(layer.getBounds().getCenter(), {
    icon: L.divIcon({
      className: 'label',
      html: '<h' + style + '><b>' + props.Name + '<br>(' + props[name] + ')</b></h' + style + '>',
      iconSize: [100, 40]
    })
  });
};
 
function getLayer(corona, name, stops, title, total, labels) {
  var popup = {
    maxHeight: 300,
    minWidth: 150,
    maxWidth: 200,
  };
  
  let style = '3'
 
  return L.geoJson(corona, {
    style: function(feature) {
      var color = getCaseColor(stops, feature.properties[name]);
      return styleFeature(color);
    },
  
    onEachFeature: function(feature, layer) {
      // bind a popup window
      var color = getCaseColor(stops, feature.properties[name]);
      style = lightOrDark(color)
      layer.bindPopup(getPopup(feature.properties, title, name, total), popup);
  
      var label = getLabel(layer, feature.properties, name, style);
      labels.push(label);
    }
  });
};

 