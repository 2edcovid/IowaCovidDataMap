function getTotal(name, data) {
  return ss.sum(data.map(function(feature) {
    if (!feature.properties[name] || feature.properties[name] == NaN) {
      return 0;
    } else {
      return feature.properties[name];
    }

  }));
}

function getStops(name, count, data) {
  return ss.ckmeans(data.map(function(feature) {
    return feature.properties[name];
  }), count);
}


function getTotalPercent(total, data) {
  return (total/getTotal('pop_est_2018', data)*100).toFixed(2);
};
