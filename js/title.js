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
  var title = getDateString() + " as of 11 am";
  var div = L.DomUtil.create('div', 'title')
  var labels = ["<h6>" + title +"</h6>"];
  div.innerHTML = labels.join('<br>');
  return div;
};

function getDateString() {
  var d = new Date();
  
  if (d.getMonth() < 10) {
    d.setHours(d.getHours() + 1)
  }
  
  if (d.getHours() <= 11) {
    d.setDate(d.getDate() - 1); 
  }

  console.log(d.getMinutes())

  var dateString = d.getFullYear() + "-" + `${d.getMonth() + 1}`.padStart(2, "0") + "-" + `${d.getDate()}`.padStart(2, "0");

  return dateString; 
}

function getGeoJsonURL() {
  var prefix = 'https://raw.githubusercontent.com/2edcovid/CovidDataAutomation/data/historical/data_file_';
  var ext = '.geojson';
  var url = prefix + getDateString() + ext;
  return url;
}
