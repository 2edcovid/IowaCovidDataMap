function getSlider() {
  var StartDate = new Date(2020, 2, 8);
  // Time
  var DaysSinceStart = Math.trunc((Today.getTime() - StartDate.getTime())  / (1000 * 3600 * 24)) + 1;

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
      d3.select('.value-time').text(getTitleText(sliderTime.value()));
      if (getDateString(val) != curDateString) {
        curDateString = getDateString(val);
        loadMap(getGeoJsonURL(curDateString));
      }
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
    .text(getTitleText(sliderTime.value()));

  gTime.call(sliderTime);
}
