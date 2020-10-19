var StartDate = new Date(2020, 2, 8);
var Today = getDate(fallBackToYesterday(getGeoJsonURL()));
var DaysSinceStart = Math.trunc((Today.getTime() - StartDate.getTime())  / (1000 * 3600 * 24)) + 1;

var curDateString = getDateString(Today);

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
    if (getDateString(val) != curDateString) {
      curDateString = getDateString(val);
      resetMap();
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
  .text(getTitleText(sliderTime));

gTime.call(sliderTime);

function getTitleText(sliderTime) {
  var titleText = `Data as of ${d3.timeFormat('%m/%d/%Y')(sliderTime.value())}`;
  return titleText;
}


function getDate(yesterday=false) {
  var d = new Date();
  
  if (d.getMonth() < 10) {
    d.setHours(d.getHours() + 1)
  }
  
  if (d.getHours() <= 11 || yesterday) {
    // console.log('yesterday')
    d.setDate(d.getDate() - 1); 
  }

  return d;
}

function getDateString(date) {
  var dateString = date.getFullYear() + "-" + `${date.getMonth() + 1}`.padStart(2, "0") + "-" + `${date.getDate()}`.padStart(2, "0");
  return dateString; 
}

function fallBackToYesterday(url) {
  var ret = false;
  var request = new XMLHttpRequest();  
  request.open('GET', url, true);
  request.onreadystatechange = function(){
      if (request.readyState === 4){
          if (request.status === 404) {  
            ret = true;
          }  
      }
  };
  request.send();
  return ret;
}

function getGeoJsonURL(overrideDate=null) {
  var prefix = 'https://raw.githubusercontent.com/2edcovid/CovidDataAutomation/data/historical/data_file_';
  var ext = '.geojson';
  var url = '';
  var date = getDate();

  if (overrideDate) {
    url = prefix + overrideDate + ext;
  }
  else {
    url = prefix + getDateString(date) + ext;
    date = getDate(fallBackToYesterday(url))
    url = prefix + getDateString(date) + ext;
  }

  console.log(url)
  return url;
}
