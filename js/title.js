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
  var title = getDateString(getDate()) + " as of 11 am";
  var div = L.DomUtil.create('div', 'title')
  var labels = ["<h6>" + title +"</h6>"];
  div.innerHTML = labels.join('<br>');
  return div;
};

function getTitleText(date) {
  var titleText = `${getDateString(date)} as of 11 am`;
  return titleText;
}

function getDate() {
  var d = new Date();
  
  if (d.getMonth() < 10) {
    d.setHours(d.getHours() + 1)
  }
  
  if (d.getHours() <= 11 || useYesterday) {
    console.log('yesterday')
    d.setDate(d.getDate() - 1); 
  }

  return d;
}

function getDateString(date) {
  return d3.timeFormat('%Y-%m-%d')(date); 
}

function fallBackToYesterday(url) {
  var ret = false;
  var request = new XMLHttpRequest();  
  request.open('GET', url, true);
  request.onreadystatechange = function(){
    if (request.status === 404) {  
      ret = true;
    }  
  };
  request.send();
  return ret;
}


function getGeoJsonURL(overrideDate=null) {
  var prefix = 'https://raw.githubusercontent.com/2edcovid/CovidDataAutomation/data/historical/data_file_';
  var ext = '.geojson';
  var url = '';

  if (overrideDate) {
    url = prefix + overrideDate + ext;
  }
  else {
    url = prefix + getDateString(getDate()) + ext;
  }

  console.log(url)
  return url;
}
