function getTitle() {
  var title = L.control({
    position: 'topleft'
  });
  title.onAdd = function(map) {
    return L.DomUtil.create('div', 'title');
  };
  return title;
};
 
function populateTitle() {
  var title = getDateString(fallBackToYesterday(getGeoJsonURL())) + " as of 11 am";
  var div = L.DomUtil.create('div', 'title')

  // <div class="slidecontainer">
  // <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
  //   </div>
  var labels = ["<h6>" + title +"</h6>"];
  div.innerHTML = labels.join('<br>');

  var slider = L.DomUtil.create('div', 'slider', div);
  L.DomUtil.addClass(slider, 'slidecontainer');
  slider.innerHTML = '<input type="range" min="1" max="100" value="50" class="slider" id="myRange">';
  return div;
};

function getDateString(yesterday=false) {
  var d = new Date();
  
  if (d.getMonth() < 10) {
    d.setHours(d.getHours() + 1)
  }
  
  if (d.getHours() <= 11 || yesterday) {
    // console.log('yesterday')
    d.setDate(d.getDate() - 1); 
  }

  var dateString = d.getFullYear() + "-" + `${d.getMonth() + 1}`.padStart(2, "0") + "-" + `${d.getDate()}`.padStart(2, "0");
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
  var url = prefix + getDateString() + ext;

  url = prefix + getDateString(fallBackToYesterday(url)) + ext;
  
  return url;
}
