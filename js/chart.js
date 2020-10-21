function sortData(data, property) {
  data.sort(function(a, b) {
    return a.properties[property] - b.properties[property];
  });
};

function formatData(data, property) {
  data.forEach(function(d) {
    d.properties[property] = +d.properties[property];
  });
};

function getDataMax(data, property) {
  return d3.max(data, function(d){ return d.properties[property]; });
};

function formatName(data, property) {
  return data.map(function(d) { return d.properties.Name + "(" + d.properties[property] + ")"; });
};

function getFillColor(stops, d, property) {
  return getCaseColor(stops, d.properties[property]);
};

function getWidth(x, d, property) {
  return x(d.properties[property]);
};

function getLabels(y, d, property) {
  return y(d.properties.Name + "(" + d.properties[property] + ")");
};

function getChartContents(property, data, stops, title, total) {
  var chartConents = L.d3SvgOverlay();
  chartConents.onAdd = function(map) {
    return populateChartContents(property, data, stops, title, total);
  };
  chartConents.onRemove = function(map) {
    d3.selectAll(".svg-content").remove();
  };
  return chartConents;
};
  
function populateChartContents(property, data, stops, title, total) {
  var baseWidth = 370;
  var baseHeight = 2000;
  var margin = {top: 10, right: 20, bottom: 10, left: 115};
  var width = baseWidth - margin.left - margin.right;
  var height = baseHeight - margin.top - margin.bottom;
  
  sortData(data, property);
  formatData(data, property);
 
  var maxDataPoint = getDataMax(data, property);
  
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var chart = d3.select("#chart")
              .append("svg")
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 " + baseWidth + " " + baseHeight)
              .classed("svg-content", true)
              .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
  
  var y = d3.scaleBand()
          .range([height, 0])
          .domain(formatName(data, property));
  var yAxis = d3.axisLeft(y);

  var x = d3.scaleLinear()
          .range([0, width])
          .domain([0, maxDataPoint]);
  var xAxis = d3.axisTop(x)
              .ticks(5);

  var bar = chart.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect');

  bar.attr("class", "bar")
    .attr("fill", function(d) { return getFillColor(stops, d, property); } )
    .attr("width", function(d) { return getWidth(x, d, property); } )
    .attr("y", function(d) { return getLabels(y, d, property); } )
    .attr("height", y.bandwidth())
    .attr("transform", "translate(0,35)");

  // add the x Axis
  chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,35)")
        .call(xAxis);
   
  // add the y Axis
  chart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,35)")
      .call(yAxis);

  chart.append("text")
    .attr("class", "svg-title")
    .attr("y", 10)
    .text(title + ": " + total);
}
