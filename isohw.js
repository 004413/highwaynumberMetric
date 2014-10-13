var CANVAS_HORZ_SIZE = 999;
var CANVAS_VERT_SIZE = 999;
var LEFT_MARGIN = 18;
var TOP_MARGIN = 27;
var CITY_MARGIN = 3;
var canvas = Raphael(0,0,CANVAS_HORZ_SIZE,CANVAS_VERT_SIZE);

var COLORS = ['#000000','#FF8000','#0000FF','#FF0000','#008000'];
var X_SIZE = 6;
var LINE_WIDTH = 2;

var LIGHT_RED = '#FF8080';
var LIGHT_GREEN = '#80FF80';
var LIGHT_BLUE = '#8080FF';
var LIGHT_MAGENTA = '#FF80FF';
var LIGHT_CYAN = '#80FFFF';
var LIGHT_YELLOW = '#FFFF80';

function oddConvert(hwNumber){
  return 9*hwNumber + LEFT_MARGIN;
}

function evenConvert(hwNumber){
  return 900-9*hwNumber + TOP_MARGIN;
}

/* produces string to represent a line from (x1,y1) to (x2,y2) */
function parseLine(x1,y1,x2,y2){
  var lineString = "m";
  lineString += x1;
  lineString += ",";
  lineString += y1;
  lineString += "l";
  lineString += x2-x1;
  lineString += ",";
  lineString += y2-y1;
  return lineString;
}

/* draws an X occupying an X_SIZE-by-X_SIZE square centered at point inputted */
function drawX(x,y){
  var bottomLeftUpperRightLine = canvas.path(parseLine(x-X_SIZE/2,y+X_SIZE/2,x+X_SIZE/2,y-X_SIZE/2));
  var upperLeftBottomRightLine = canvas.path(parseLine(x-X_SIZE/2,y-X_SIZE/2,x+X_SIZE/2,y+X_SIZE/2));
}

/* number: highway number
 * minVal: minimum number of highway of opposite parity
 * maxVal: maximum number of highway of opposite parity
 * parallel: list of tuples for parallel intersections
 * nonInt: list of non-intersecting highways of opposite parity in range */
function drawInterstate(number,minVal,maxVal,parallel,nonInt){
  var colorSelector = number%5;
  if(number%2===0){
    var parseString = parseLine(oddConvert(minVal),evenConvert(number),oddConvert(maxVal),evenConvert(number));
    var interLine = canvas.path(parseString).attr({'stroke':COLORS[colorSelector]}).attr({'stroke-width':LINE_WIDTH});
    for(var i=0;i<parallel.length;i++){
      var intersect = parallel[i];
      var parseString = parseLine(oddConvert(intersect[1]),evenConvert(number),oddConvert(intersect[1]),evenConvert(intersect[0]));
      var intersectLine = canvas.path(parseString).attr({'stroke-dasharray':'.'});
    }
    for(var j=0;j<nonInt.length;j++){
      var xMarker = drawX(oddConvert(nonInt[j]),evenConvert(number));
    }
  }else{
    var parseString = parseLine(oddConvert(number),evenConvert(minVal),oddConvert(number),evenConvert(maxVal));
    var interLine = canvas.path(parseString).attr({'stroke':COLORS[colorSelector]}).attr({'stroke-width':LINE_WIDTH});
    for(var i=0;i<parallel.length;i++){
      var intersect = parallel[i];
      var parseString = parseLine(oddConvert(number),evenConvert(intersect[1]),oddConvert(intersect[0]),evenConvert(intersect[1]));
      var intersectLine = canvas.path(parseString).attr({'stroke-dasharray':'.'});
    }
    for(var j=0;j<nonInt.length;j++){
      var xMarker = drawX(oddConvert(number),evenConvert(nonInt[j]));
    }
  }
}

/* makes number label for each line corresponding to an interstate */
function makeNumLabel(highwayNumber){
  var colorSelector = highwayNumber%5;
  if(highwayNumber%2===0){
    var xCoordLeft = oddConvert(1.5);
    var xCoordRight = oddConvert(101);
    var yCoord = evenConvert(highwayNumber);
    var numLabelLeft = canvas.text(xCoordLeft,yCoord-1,highwayNumber).attr({'fill':COLORS[colorSelector]});
    var numLabelRight = canvas.text(xCoordRight,yCoord-1,highwayNumber).attr({'fill':COLORS[colorSelector]});
  }else{
    var xCoord = oddConvert(highwayNumber);
    var yCoordTop = evenConvert(101);
    var yCoordBottom = evenConvert(-1);
    var numLabelTop = canvas.text(xCoord,yCoordTop,highwayNumber).attr({'fill':COLORS[colorSelector]});
    var numLabelBottom = canvas.text(xCoord,yCoordBottom,highwayNumber).attr({'fill':COLORS[colorSelector]});
  }
}

/* name: name of city
 * left: interstate number on left side
 * right: interstate number on right side
 * up: interstate number on top side
 * down: interstate number on bottom side
 * color: color for the city */
function makeCity(name,left,right,up,down,color){
  var leftCoord = oddConvert(left);
  var rightCoord = oddConvert(right);
  var topCoord = evenConvert(up);
  var bottomCoord = evenConvert(down);
  var cityRect = canvas.rect(leftCoord-CITY_MARGIN,topCoord-CITY_MARGIN,rightCoord-leftCoord+2*CITY_MARGIN,bottomCoord-topCoord+2*CITY_MARGIN,CITY_MARGIN).attr({'fill':color});
}

var highways = [2,4,5,8,10,12,15,16,17,19,20,22,24,25,26,27,29,30,35,37,39,40,43,44,45,49,55,57,59,64,65,66,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,93,94,95,96,97,99];
for(var num=0;num<highways.length;num++){
  makeNumLabel(highways[num]);
}

var Dallas = makeCity("Dallas",35,45,30,20,LIGHT_RED);

var highway5 = drawInterstate(5,0,100,[],[]);
var highway15 = drawInterstate(15,8,100,[],[]);
var highway17 = drawInterstate(17,10,41,[],[]);
var highway19 = drawInterstate(19,0,10,[],[]);
var highway25 = drawInterstate(25,10,90,[],[]);
var highway27 = drawInterstate(27,30,40,[],[]);
var highway29 = drawInterstate(29,70,100,[[35,70]],[]);
var highway35 = drawInterstate(35,1,98,[],[]);
var highway37 = drawInterstate(37,6,11,[[35,11]],[]);
var highway39 = drawInterstate(39,74,97,[[55,74]],[]);
var highway43 = drawInterstate(43,90,97,[[39,90]],[]);
var highway45 = drawInterstate(45,9,30,[],[]);
var highway49S = drawInterstate(49,10,20,[],[]); // check for non-intersects; ridiculous
var highway49M = drawInterstate(49,21,23,[],[]);
var highway49N = drawInterstate(49,26,30,[],[]);
var highway49NN = drawInterstate(49,40,42,[],[]);
var highway49NNN = drawInterstate(49,43,68,[],[]);
var highway55 = drawInterstate(55,10,95,[],[]);
var highway57 = drawInterstate(57,23,94,[[55,23]],[]);
var highway59 = drawInterstate(59,10,24,[[65,20]],[]); // check city at north end
var highway65 = drawInterstate(65,10,90,[],[]);
var highway69SSS = drawInterstate(69,2,3,[],[]);
var highway69SS = drawInterstate(69,11,13,[],[]);
var highway69S = drawInterstate(69,21,21,[[55,21]],[]);
var highway69M = drawInterstate(69,24,25,[],[]);
var highway69N = drawInterstate(69,64,97,[[75,97]],[]); // check for non-intersects; ridiculous
var highway71 = drawInterstate(71,64,90,[[65,64],[75,73]],[]);
var highway73 = drawInterstate(73,39,74,[[85,39]],[]);
var highway75 = drawInterstate(75,1,100,[[85,20]],[]);
var highway77 = drawInterstate(77,20,90,[[85,31],[81,54]],[]); // check for non-intersects
var highway79 = drawInterstate(79,65,91,[[77,65]],[]);
var highway81 = drawInterstate(81,40,100,[],[]);
var highway83 = drawInterstate(83,71,77,[[81,77]],[]);
var highway85 = drawInterstate(85,17,74,[[65,17],[95,62]],[]);
var highway87 = drawInterstate(87,79,100,[[95,80]],[]);
var highway89 = drawInterstate(89,93,100,[[93,93],[91,95]],[]);
var highway91 = drawInterstate(91,82,100,[[95,82]],[]);
var highway93 = drawInterstate(93,89,98,[[95,89]],[]);
var highway95 = drawInterstate(95,1,100,[],[]);
var highway97 = drawInterstate(97,66,69,[],[]);
var highway99 = drawInterstate(99,70,80,[],[]);

var con80and90 = [];
for(var loc=66;loc<=76.2;loc+=0.2){
  con80and90.push([90,loc]);
}
var con80and94 = [];
for(var loc=58;loc<=66.2;loc+=0.2){
  con80and94.push([94,loc]);
}
var con90and94 = [];
for(var loc=38;loc<=41.2;loc+=0.2){
  con90and94.push([94,loc]);
}
var con90and94two = [];
for(var loc=54;loc<=56.2;loc+=0.2){
  con90and94two.push([94,loc]);
}

var highway2 = drawInterstate(2,68,69,[],[]); // this is the crazy 69
var highway4 = drawInterstate(4,74,95,[],[]);
var highway8 = drawInterstate(8,4,18,[[10,18]],[]);
var highway10 = drawInterstate(10,3,95,[],[]);
var highway12 = drawInterstate(12,52,59,[[10,52],[10,59]],[]);
var highway16 = drawInterstate(16,75,96,[],[]);
var highway20 = drawInterstate(20,26,95,[[10,26]],[]);
var highway22 = drawInterstate(22,56,58,[],[]);
var highway24 = drawInterstate(24,57,75,[[40,65],[40,66]],[]); // check for non-intersects
var highway26 = drawInterstate(26,77,97,[[40,80],[20,78]],[]); // check for non-intersects
var highway30 = drawInterstate(30,34,52,[[20,34],[40,52]],[]);
var highway40 = drawInterstate(40,15,99,[],[]);
var highway44 = drawInterstate(44,29,56,[[70,56],[40,34]],[]); // check for non-intersects
var highway64 = drawInterstate(64,54,97,[[70,55]],[73,85]);
var highway66 = drawInterstate(66,81,94,[],[85]);
var highway68 = drawInterstate(68,79,80,[[70,80]],[]);
var highway70 = drawInterstate(70,15,99,[],[69,73,85,95]);
var highway72 = drawInterstate(72,53,57,[],[]);
var highway74W = drawInterstate(74,53,75,[[80,53],[70,65]],[69,71]);
var highway74M = drawInterstate(74,77,78,[],[]); // check for non-intersects;
var highway74E = drawInterstate(74,85,95,[],[]); // check for non-intersects; south of 40; also intersects 73
var highway76W = drawInterstate(76,24,27,[[70,24],[80,27]],[]);
var highway76E = drawInterstate(76,71,99,[[80,78],[70,79],[70,80]],[]); // check for non-intersects; also intersects 79; 70-76 concurrency
var highway78 = drawInterstate(78,81,96,[],[]);
var highway80 = drawInterstate(80,3,99,con80and90.concat(con80and94),[87]); // 80-90 concurrency
var highway82 = drawInterstate(82,7,8,[[90,7],[84,8]],[]);
var highway84W = drawInterstate(84,5,16,[[80,16]],[]);
var highway84E = drawInterstate(84,81,92,[[90,92]],[]);
var highway86W = drawInterstate(86,13,15,[[84,13]],[]);
var highway86M = drawInterstate(86,79,80,[[90,79]],[79]);
var highway86E = drawInterstate(86,81,82,[],[]);
var highway88W = drawInterstate(88,37,54,[],[]);
var highway88E = drawInterstate(88,81,86,[[90,86]],[]);
var highway90 = drawInterstate(90,3,97,[[80,76]].concat(con90and94).concat(con90and94two),[]);
var highway94 = drawInterstate(94,24,76,[[90,24],[90,38],[90,41],[90,54],[90,56],[80,58],[80,66]],[]); // 80-94 concurrency from 58 to 66
var highway96 = drawInterstate(96,67,75,[[94,75]],[]);
