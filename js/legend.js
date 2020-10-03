function getLegend(title, stop) {
  var legend = L.control({
    position: 'bottomleft'
  });
  legend.onAdd = function(map) {
    return populateLegend(stop, title);
  };
  return legend;
};
 
function populateLegend(stops, title) {
  var div = L.DomUtil.create('div', 'info legend')
  var grades = [];
  for (var i = 0; i < stops.length; i++) {
    var grade = ss.min(stops[i]) ? ss.min(stops[i]) : 0;
    grades.push(grade)
  }
  var labels = ["<h6>" + title +"</h6>"];
  var fixed = title.includes('Percent') ? 2 : 0;
  // loop through our intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    labels.push('<i style="background:' + getCaseColor(stops, grades[i]) + '"></i> ' +
      grades[i].toFixed(fixed) + (grades[i + 1] ? '&ndash;' + (grades[i + 1] - 1).toFixed(fixed) : '+'));
  }
  div.innerHTML = labels.join('<br>');
  return div;
};