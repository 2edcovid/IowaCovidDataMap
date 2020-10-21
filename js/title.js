function getTitle() {
  var title = L.control({
    position: 'topleft'
  });
  title.onAdd = function(map) {
    return populateTitle();
  };
  return title;
};
 
function populateTitle() {
  var title = getDateString(fallBackToYesterday(getGeoJsonURL())) + " as of 11 am";
  var div = L.DomUtil.create('div', 'title')
  var labels = ["<h6>" + title +"</h6>"];
  div.innerHTML = labels.join('<br>');
  return div;
};

function getDate(yesterday=false) {
  var d = new Date();
  if (d.getMonth() < 10) {
    d.setHours(d.getHours() + 1)
  }
  if (d.getHours() <= 11 || yesterday) {
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

function getGeoJsonURL() {
  var prefix = 'https://raw.githubusercontent.com/2edcovid/CovidDataAutomation/data/historical/data_file_';
  var ext = '.geojson';
  var date = getDate();
  var url = prefix + getDateString(date) + ext;	  
  date = getDate(fallBackToYesterday(url))
  url = prefix + getDateString(date) + ext;
}
