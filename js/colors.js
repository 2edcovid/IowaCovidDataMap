function getCaseColor(stops, d) {
  if (stops.length == 9) {
   return d >= ss.min(stops[8]) ? '#651d27' :
      d >= ss.min(stops[7]) ? '#8b1d2c' :
      d >= ss.min(stops[6]) ? '#ae2a2f' :
      d >= ss.min(stops[5]) ? '#cf3236' :
      d >= ss.min(stops[4]) ? '#ef5144' :
      d >= ss.min(stops[3]) ? '#f97a5e' :
      d >= ss.min(stops[2]) ? '#fac1aa' :
      d >= ss.min(stops[1]) ? '#fce2d5' :
      d >= ss.min(stops[0]) ? '#fdf4f0' :
      'rgba(0,0,0,0.0)';
  }
  return 'rgba(0,0,0,0.0)';
};

// Add a function to style the counties by their confirmed deaths (ck means)
function getDeathColor(stops, d) {
   return d >= ss.min(stops[4]) ? '#08519c' :
      d >= ss.min(stops[3]) ? '#3182bd' :
      d >= ss.min(stops[2]) ? '#6baed6' :
      d >= ss.min(stops[1]) ? '#bdd7e7' :
      d >= ss.min(stops[0]) ? '#eff3ff' :
      'rgba(0,0,0,0.0)';
};

// Add a function to style the counties by their confirmed deaths (ck means)
function getActiveColor(stops, d) {
   return d >= ss.min(stops[6]) ? '#366946' :
      d >= ss.min(stops[5]) ? '#488C5D' :
      d >= ss.min(stops[4]) ? '#5baf75' :
      d >= ss.min(stops[3]) ? '#7BBF90' :
      d >= ss.min(stops[2]) ? '#9CCFAC' :
      d >= ss.min(stops[1]) ? '#BDDFC7' :
      d >= ss.min(stops[0]) ? '#DEEFE3' :
      'rgba(0,0,0,0.0)';
};


function lightOrDark(color) {

  // Variables for red, green, blue values
  var r, g, b, hsp;
  
  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {

      // If RGB --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      
      r = color[1];
      g = color[2];
      b = color[3];
  } 
  else {
      
      // If hex --> Convert it to RGB: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace( 
      color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
  }
  
  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
  0.299 * (r * r) +
  0.587 * (g * g) +
  0.114 * (b * b)
  );

  // Using the HSP value, determine whether the color is light or dark
  if (hsp>170) {

      return '3';
  } 
  else {

      return '2';
  }
}