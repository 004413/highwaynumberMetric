var CANVAS_HORZ_SIZE = 999;
var CANVAS_VERT_SIZE = 999;
var LEFT_MARGIN = 18;
var TOP_MARGIN = 27;
var canvas = Raphael(0,0,CANVAS_HORZ_SIZE,CANVAS_VERT_SIZE);

var COLORS = ['#000000','#FF8000','#0000FF','#FF0000','#008000'];

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

/* number: highway number
 * minVal: minimum number of highway of opposite parity
 * maxVal: maximum number of highway of opposite parity
 * parallel: list of tuples for parallel intersections
 * nonInt: list of non-intersecting highways of opposite parity in range */
function drawInterstate(number,minVal,maxVal,parallel,nonInt){
  var colorSelector = number%5;
  if(number%2===0){
    var parseString = parseLine(oddConvert(minVal),evenConvert(number),oddConvert(maxVal),evenConvert(number));
    var interLine = canvas.path(parseString).attr({'stroke':COLORS[colorSelector]});
    for(var i=0;i<parallel.length;i++){
      var intersect = parallel[i];
      var parseString = parseLine(oddConvert(intersect[1]),evenConvert(number),oddConvert(intersect[1]),evenConvert(intersect[0]));
      var intersectLine = canvas.path(parseString).attr({'stroke-dasharray':'.'});
    }
  }else{
    var parseString = parseLine(oddConvert(number),evenConvert(minVal),oddConvert(number),evenConvert(maxVal));
    var interLine = canvas.path(parseString).attr({'stroke':COLORS[colorSelector]});
    for(var i=0;i<parallel.length;i++){
      var intersect = parallel[i];
      var parseString = parseLine(oddConvert(number),evenConvert(intersect[1]),oddConvert(intersect[0]),evenConvert(intersect[1]));
      var intersectLine = canvas.path(parseString).attr({'stroke-dasharray':'.'});
    }
  }
}

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
var highway49 = drawInterstate(49,10,21,[],[]); // check for non-intersects; ridiculous
var highway55 = drawInterstate(55,10,95,[],[]);
var highway57 = drawInterstate(57,23,94,[[55,23]],[]);
var highway59 = drawInterstate(59,10,24,[[65,20]],[]); // check city at north end
var highway65 = drawInterstate(65,10,90,[],[]);
var highway69 = drawInterstate(69,64,97,[[75,97]],[74]); // check for non-intersects; ridiculous
var highway71 = drawInterstate(71,64,90,[[65,64],[75,73]],[]);
var highway73 = drawInterstate(73,40,74,[[85,39]],[64,70]);
var highway75 = drawInterstate(75,1,100,[[85,20]],[]);
var highway77 = drawInterstate(77,20,90,[[85,31],[81,54]],[]); // check for non-intersects
var highway79 = drawInterstate(79,65,91,[[77,65]],[]);
var highway81 = drawInterstate(81,40,100,[],[]);
var highway83 = drawInterstate(83,71,77,[[81,77]],[]);
var highway85 = drawInterstate(85,17,62,[[65,20],[95,62]],[]);
var highway87 = drawInterstate(87,79,100,[[95,80]],[80]);
var highway89 = drawInterstate(89,93,100,[[93,93],[91,95]],[]);
var highway91 = drawInterstate(91,82,100,[[95,82]],[]);
var highway93 = drawInterstate(93,89,98,[[95,89]],[]);
var highway95 = drawInterstate(95,1,100,[],[]);
var highway97 = drawInterstate(97,66,69,[],[]);
var highway99 = drawInterstate(99,70,80,[],[]);

var highway2 = drawInterstate(2,68,69,[],[]); // this is the crazy 69
var highway4 = drawInterstate(4,74,95,[],[]);
var highway8 = drawInterstate(8,4,18,[[10,18]],[]);
var highway10 = drawInterstate(10,3,95,[],[]);
var highway12 = drawInterstate(12,52,59,[[10,52],[10,59]],[]);
var highway16 = drawInterstate(16,75,96,[],[]);
var highway20 = drawInterstate(20,26,95,[[10,26]],[]);
var highway24 = drawInterstate(24,57,75,[[40,65]],[]); // check for non-intersects
var highway26 = drawInterstate(26,80,97,[[40,63],[20,77]],[81]); // check for non-intersects
var highway30 = drawInterstate(30,34,52,[[20,34],[40,52]],[]);
var highway40 = drawInterstate(40,15,99,[],[]);
var highway44 = drawInterstate(44,29,56,[[70,56],[40,35]]); // check for non-intersects
var highway64 = drawInterstate(64,54,97,[[70,55]],[]);
var highway66 = drawInterstate(66,81,94,[],[]);
var highway68 = drawInterstate(68,79,80,[[70,80]],[]);
var highway70 = drawInterstate(70,15,93,[],[]);
var highway72 = drawInterstate(72,53,57,[],[]);
var highway74W = drawInterstate(74,53,75,[[80,53],[70,65]],[]);
var highway74M = drawInterstate(74,77,78,[],[]); // check for non-intersects;
var highway74E = drawInterstate(74,85,95,[],[]); // check for non-intersects; south of 40; also intersects 73
var highway76W = drawInterstate(76,25,27,[[70,25],[80,27]],[]);
var highway76E = drawInterstate(76,71,96,[[80,78],[70,79],[70,80]],[]); // check for non-intersects; also intersects 79; 70-76 concurrency
var highway78 = drawInterstate(78,81,96,[],[]);
var highway80 = drawInterstate(80,3,95,[[90,66],[90,76]],[]); // 80-90 concurrency
var highway82 = drawInterstate(82,7,8,[[90,7],[84,8]],[]);
var highway84W = drawInterstate(84,5,16,[[80,16]],[]);
var highway84E = drawInterstate(84,81,92,[[90,92]],[]);
var highway86W = drawInterstate(86,13,15,[[84,13]],[]);
var highway86E = drawInterstate(86,79,80,[[90,79]],[79]);
var highway88W = drawInterstate(88,37,54,[],[]);
var highway88E = drawInterstate(88,81,86,[[90,86]],[]);
var highway90 = drawInterstate(90,3,97,[],[]);
var highway94 = drawInterstate(94,24,76,[[90,24],[90,38],[90,40],[90,54],[90,56],[80,58],[80,66]]); // 80-94 concurrency from 58 to 66
var highway96 = drawInterstate(96,67,75,[[94,75]],[]);
