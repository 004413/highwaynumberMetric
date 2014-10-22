var CANVAS_HORZ_SIZE = 999;
var CANVAS_VERT_SIZE = 999;
var LEFT_MARGIN = 18;
var TOP_MARGIN = 27;
var CITY_MARGIN = 3;
var canvas = Raphael(0,0,CANVAS_HORZ_SIZE,CANVAS_VERT_SIZE);

var COLORS = ['#000000','#FF8000','#0000FF','#FF0000','#008000'];
var X_SIZE = 6;
var LINE_WIDTH = 2;

var WHITE = '#FFFFFF';
var GRAY = '#808080';
var LIGHT_RED = '#FF8080';
var LIGHT_GREEN = '#80FF80';
var LIGHT_BLUE = '#8080FF';
var LIGHT_MAGENTA = '#FF80FF';
var LIGHT_CYAN = '#80FFFF';
var LIGHT_YELLOW = '#FFFF80';

var NORMAL_OF_LIGHT = {'#FF8080':'#FF0000','#80FF80':'#008000','#8080FF':'#0000FF','#FF80FF':'#FF00FF','#80FFFF':'#008080','#FFFF80':'#808000'};

function oddConvert(hwNumber){
  return 9*hwNumber + LEFT_MARGIN;
}

function evenConvert(hwNumber){
  return 900-9*hwNumber + TOP_MARGIN;
}

/* dictionary NORMAL_OF_LIGHT is currently used instead of this function */
function getNormalOfLightColor(hexCode){
  var newColor = "#";
  for(var position=1;position<7;position++){
    if(hexCode[position]==='0'||hexCode[position]==='F'){
      newColor += hexCode[position];
    }else{
      newColor += '0';
    }
  }
  return newColor;
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
    var xCoordLeft = oddConvert(-1);
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
 * color: color for the city 
 * labelH: even interstate equivalent of label
 * labelV: odd interstate equivalent of label
 * labelSize: font size of the label
 * align: 'start', 'middle', or 'end' for alignment
 */
function makeCity(name,left,right,up,down,color,labelV,labelH,labelSize,align){
  var leftCoord = oddConvert(left);
  var rightCoord = oddConvert(right);
  var topCoord = evenConvert(up);
  var bottomCoord = evenConvert(down);
  var labelHCoord = evenConvert(labelH);
  var labelVCoord = oddConvert(labelV);
  var cityRect = canvas.rect(leftCoord-CITY_MARGIN,topCoord-CITY_MARGIN,rightCoord-leftCoord+2*CITY_MARGIN,bottomCoord-topCoord+2*CITY_MARGIN,CITY_MARGIN).attr({'fill':color});
  var cityLabel = canvas.text(labelVCoord,labelHCoord,name).attr({'font-family':'Ubuntu'}).attr({'font-size':labelSize+'px'}).attr({'text-anchor':align}).attr({'fill':NORMAL_OF_LIGHT[color]});
}

var highways = [2,4,5,8,10,12,15,16,17,19,20,22,24,25,26,27,29,30,35,37,39,40,43,44,45,49,55,57,59,64,65,66,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,93,94,95,96,97,99];
for(var num=0;num<highways.length;num++){
  makeNumLabel(highways[num]);
}

var NewYork = makeCity("NEW YORK",87,97,79,78,LIGHT_GREEN,92,80.8,10,'middle');
var NewYorkCover = canvas.rect(oddConvert(87)-2*CITY_MARGIN,evenConvert(78)-2*CITY_MARGIN,oddConvert(97)-oddConvert(87)+2*CITY_MARGIN,4*CITY_MARGIN).attr({'fill':WHITE}).attr({'stroke-width':0});

var Seattle = makeCity("SEATTLE",4,5,90,90,LIGHT_GREEN,4.5,91,9,'end');
var Tacoma = makeCity("TACOMA",5,5,89,89,LIGHT_GREEN,4.5,88.5,8,'end');
var Spokane = makeCity("SPOKANE",10,10,90,90,LIGHT_GREEN,10,89,9,'middle');
var Portland = makeCity("PORTLAND",5,5,84,84,LIGHT_BLUE,4.5,84,8,'end');
var Eugene = makeCity("EUGENE",5,5,83,83,LIGHT_BLUE,4.5,83,8,'end');
var CoeurdAlene = makeCity("COEUR D'ALENE",11,11,90,90,LIGHT_CYAN,11,91,8,'middle');
var Boise = makeCity("BOISE",10,10,84,84,LIGHT_CYAN,10,85,9,'middle');
var Pocatello = makeCity("POCATELLO",15,15,86,86,LIGHT_CYAN,15.5,86,9,'start');
var SanFranciscoSanText = canvas.text(oddConvert(1.5),evenConvert(80),"SAN").attr({'font-family':'Ubuntu'}).attr({'font-size':'9px'}).attr({'text-anchor':'middle'}).attr({'fill':NORMAL_OF_LIGHT[LIGHT_YELLOW]})
var SanFrancisco = makeCity("FRANCISCO",3,3,80,80,LIGHT_YELLOW,1.5,79,9,'middle');
var SanJose = makeCity("SAN JOSE",3,3,76,76,LIGHT_YELLOW,2,77,9,'middle');
var Sacramento = makeCity("SACRAMENTO",5,5,80,80,LIGHT_YELLOW,5.5,79,9,'start');
var Stockton = makeCity("STOCKTON",5,5,75,75,LIGHT_YELLOW,4.5,74.5,8,'end');
var Fresno = makeCity("FRESNO",9,9,52,52,LIGHT_YELLOW,9,53,9,'middle');
var Bakersfield = makeCity("BAKERSFIELD",7,7,41,41,LIGHT_YELLOW,9,42,9,'middle');
var Barstow = makeCity("BARSTOW",15,15,40,40,LIGHT_YELLOW,14.2,40,8,'end');
var SantaClarita = makeCity("SANTA CLARITA",5,5,20,20,LIGHT_YELLOW,5.5,20,9,'start');
var LosAngeles = makeCity("LOS ANGELES",3,5,12,10,LIGHT_YELLOW,5.5,12.5,12,'start');
var Ontario = makeCity("ONTARIO",13,13,10,10,LIGHT_YELLOW,12.5,11,9,'end');
var SantaAna = makeCity("SANTA ANA",5,5,9,9,LIGHT_YELLOW,5.5,9.2,9,'start');
var SanDiego = makeCity("SAN DIEGO",4,15,8,0,LIGHT_YELLOW,10,4,16,'middle');
var Reno = makeCity("RENO",8,8,80,80,LIGHT_RED,8,81,9,'start');
var LasVegas = makeCity("LAS VEGAS",15,15,50,50,LIGHT_RED,14.5,50,9,'end');
var Ogden = makeCity("OGDEN",15,15,84,84,LIGHT_BLUE,15.5,84.8,8,'start');
var SaltLakeCity = makeCity("SALT LAKE CITY",15,15,80,80,LIGHT_BLUE,15.5,79,9,'start');
var Provo = makeCity("PROVO",15,15,77,77,LIGHT_BLUE,14.5,77,9,'end');
var StGeorge = makeCity("ST GEORGE",15,15,55,55,LIGHT_BLUE,14.5,55,8,'end');
var Flagstaff = makeCity("FLAGSTAFF",17,17,40,40,LIGHT_MAGENTA,17.3,41,9,'start');
var Phoenix = makeCity("PHOENIX",17,17,10,10,LIGHT_MAGENTA,17.5,12,10,'start');
var Tucson = makeCity("TUCSON",19,19,10,10,LIGHT_MAGENTA,19.5,11,9,'start');
var Nogales = makeCity("NOGALES",19,19,0,0,LIGHT_MAGENTA,19.5,0.5,8,'start');
var GreatFalls = makeCity("GREAT FALLS",15,15,95,95,LIGHT_RED,15.8,95,8,'start');
var Butte = makeCity("BUTTE",15,15,90,90,LIGHT_RED,15.5,89,9,'start');
var Billings = makeCity("BILLINGS",23,23,90,90,LIGHT_RED,23,91,9,'end');
var Casper = makeCity("CASPER",25,25,84,84,LIGHT_MAGENTA,24.2,84,8,'end');
var Cheyenne = makeCity("CHEYENNE",25,25,80,80,LIGHT_MAGENTA,24.8,80.8,9,'end');
var GrandJunction = makeCity("GRAND JUNCTION",20,20,70,70,LIGHT_YELLOW,20,69,8,'middle');
var Denver = makeCity("DENVER",24,25,76,70,LIGHT_YELLOW,23.5,73,9,'end');
var ColoradoSprings = makeCity("COLORADO SPRINGS",25,25,64,64,LIGHT_YELLOW,24.2,64,8,'end');
var Pueblo = makeCity("PUEBLO",25,25,59,59,LIGHT_YELLOW,24.2,59,9,'end');
var SantaFe = makeCity("SANTA FE",25,25,43,43,LIGHT_GREEN,24.5,43,9,'end');
var Albuquerque = makeCity("ALBUQUERQUE",25,25,40,40,LIGHT_GREEN,24.7,39,9,'end');
var LasCruces = makeCity("LAS CRUCES",25,25,10,10,LIGHT_GREEN,23,9,8,'middle');
var ElPaso = makeCity("EL PASO",26,26,10,10,LIGHT_RED,26,11,9,'start');
var WichitaFalls = makeCity("WICHITA FALLS",29,29,44,44,LIGHT_RED,30,45,9,'middle');
var Amarillo = makeCity("AMARILLO",27,27,40,40,LIGHT_RED,26,41,9,'start');
var Lubbock = makeCity("LUBBOCK",27,27,30,30,LIGHT_RED,26,29,9,'start');
var Abilene = makeCity("ABILENE",32,32,20,20,LIGHT_RED,32,21,9,'end');
var SanAntonio = makeCity("SAN ANTONIO",35,37,12,10,LIGHT_RED,35.5,13,10,'start');
var Austin = makeCity("AUSTIN",35,35,14,14,LIGHT_RED,34.5,14,9,'end');
var Dallas = makeCity("DALLAS",35,45,30,20,LIGHT_RED,40,25,20,'middle');
var Houston = makeCity("",45,45,10,10,LIGHT_RED,44.5,9,12,'end');
var Houston2 = makeCity("",69,69,12,10,LIGHT_RED,69,7,12,'middle');
var CorpusChristi = makeCity("CORPUS CHRISTI",37,37,6,6,LIGHT_RED,37.5,5.5,9,'start');
var Laredo = makeCity("LAREDO",35,35,1,1,LIGHT_RED,34.2,1,9,'end');
var Brownsville = makeCity("BROWNSVILLE",69,69,1,1,LIGHT_RED,68.5,1,9,'end');
var OklahomaCity = makeCity("OKLAHOMA CITY",34,35,44,40,LIGHT_CYAN,35.5,42,9,'start');
var Tulsa = makeCity("TULSA",43,43,44,44,LIGHT_CYAN,43,45,9,'middle');
var Wichita = makeCity("WICHITA",35,35,62,62,LIGHT_BLUE,34.5,62,9,'end');
var Topeka = makeCity("TOPEKA",28,28,70,70,LIGHT_BLUE,28,69,9,'middle');
var Omaha = makeCity("OMAHA",28,28,80,80,LIGHT_RED,27,81,9,'middle');
var SiouxFalls = makeCity("SIOUX FALLS",29,29,90,90,LIGHT_GREEN,28.5,91,8,'end');
var Fargo = makeCity("FARGO",29,29,94,94,LIGHT_YELLOW,28.5,93,8,'end');
var GrandForks = makeCity("GRAND FORKS",29,29,97,97,LIGHT_YELLOW,28.2,97,8,'end');
var Duluth = makeCity("DULUTH",35,35,98,98,LIGHT_MAGENTA,35,99,8,'middle');
var Minneapolis = makeCity("MINNEAPOLIS",35,35,94,94,LIGHT_MAGENTA,33,95,9,'middle');
var SiouxCity = makeCity("SIOUX CITY",29,29,85,85,LIGHT_CYAN,29.5,85,8,'start');
var DesMoines = makeCity("DES MOINES",35,35,80,80,LIGHT_CYAN,34.5,79,8,'end');
var KansasCity = makeCity("KANSAS CITY",29,49,70,68,LIGHT_MAGENTA,35.5,69,10,'start');
var StLouis = makeCity("ST LOUIS",55,56,70,44,LIGHT_MAGENTA,54,57,9,'end');
var Fayetteville = makeCity("FAYETTEVILLE",49,49,41,41,LIGHT_BLUE,48.5,41,8,'end');
var LittleRock = makeCity("LITTLE ROCK",52,52,40,30,LIGHT_BLUE,51.2,35,9,'end');
var Shreveport = makeCity("SHREVEPORT",49,49,20,20,LIGHT_YELLOW,50,20.8,8,'middle');
var BatonRouge = makeCity("BATON ROUGE",52,52,12,10,LIGHT_YELLOW,53,9,9,'end');
var NewOrleans = makeCity("NEW ORLEANS",57,57,10,10,LIGHT_YELLOW,57,9,9,'middle');
var Gulfport = makeCity("GULFPORT",61,61,10,10,LIGHT_MAGENTA,59.5,11,9,'start');
var Jackson = makeCity("JACKSON",55,55,20,20,LIGHT_MAGENTA,54.5,19,9,'end');
var Mobile = makeCity("MOBILE",66,66,10,10,LIGHT_BLUE,65.5,9,9,'end');
var Montgomery = makeCity("MONTGOMERY",65,85,17,17,LIGHT_BLUE,70,18,9,'middle');
var MontgomeryCover = canvas.rect(oddConvert(75)-2*CITY_MARGIN,evenConvert(17)-CITY_MARGIN-1,4*CITY_MARGIN,2*CITY_MARGIN+2).attr({'fill':WHITE}).attr({'stroke-width':0});
var Birmingham = makeCity("BIRMINGHAM",59,65,20,20,LIGHT_BLUE,62,19,8,'middle');
var Miami = makeCity("MIAMI",75,95,1,1,LIGHT_CYAN,85,2,10,'middle');
var Tampa = makeCity("TAMPA",74,74,4,4,LIGHT_CYAN,73.5,4,9,'end');
var Orlando = makeCity("ORLANDO",88,88,4,4,LIGHT_CYAN,88,5,9,'middle');
var Tallahassee = makeCity("TALLAHASSEE",72,72,10,10,LIGHT_CYAN,74.5,9,9,'end');
var Jacksonville = makeCity("JACKSONVILLE",95,95,10,10,LIGHT_CYAN,94.5,9,12,'end');
var Macon = makeCity("MACON",75,75,16,16,LIGHT_RED,75.5,15,9,'start');
var Savannah = makeCity("SAVANNAH",95,96,16,16,LIGHT_RED,94.5,15,9,'end');
var Atlanta = makeCity("ATLANTA",75,85,20,20,LIGHT_RED,81,21,10,'middle');
var AtlantaCover = canvas.rect(oddConvert(77)-2*CITY_MARGIN,evenConvert(20)-CITY_MARGIN-1,4*CITY_MARGIN,2*CITY_MARGIN+2).attr({'fill':WHITE}).attr({'stroke-width':0});
var Greenville = makeCity("GREENVILLE",85,85,25,25,LIGHT_MAGENTA,85.5,24.5,9,'start');
var Columbia = makeCity("COLUMBIA",77,77,26,20,LIGHT_MAGENTA,78,23,9,'start');
var Charleston = makeCity("CHARLESTON",97,97,26,26,LIGHT_MAGENTA,95.5,25,8,'start');
var Greensboro = makeCity("GREENSBORO",73,85,40,40,LIGHT_GREEN,72.5,41,9,'end');
var GreensboroCover = canvas.rect(oddConvert(74),evenConvert(40)-CITY_MARGIN-1,25*CITY_MARGIN,2*CITY_MARGIN+2).attr({'fill':WHITE}).attr({'stroke-width':0});// 10, from 84-74
var Asheville = makeCity("ASHEVILLE",80,80,40,26,LIGHT_GREEN,81,25,9,'middle');
var Charlotte = makeCity("CHARLOTTE",77,85,31,31,LIGHT_GREEN,85.5,31,9,'start');
var Raleigh = makeCity("RALEIGH",90,90,40,40,LIGHT_GREEN,90,39,9,'middle');
var Durham = makeCity("DURHAM",85,85,42,42,LIGHT_GREEN,85.5,42,9,'start');
var Wilmington = makeCity("WILMINGTON",99,99,40,40,LIGHT_GREEN,98.5,41,8,'middle');
var Knoxville = makeCity("KNOXVILLE",75,75,40,40,LIGHT_CYAN,74.5,38.5,9,'end');
var Chattanooga = makeCity("CHATTANOOGA",75,75,24,24,LIGHT_CYAN,74.5,23,9,'end');
var Nashville = makeCity("NASHVILLE",65,66,40,24,LIGHT_CYAN,66.5,32,10,'start');
var Memphis = makeCity("MEMPHIS",55,55,40,40,LIGHT_CYAN,54.5,41,9,'end');
var Louisville = makeCity("LOUISVILLE",65,71,64,64,LIGHT_RED,68,63,9,'middle');
var LouisvilleCover = canvas.rect(oddConvert(69)-2*CITY_MARGIN,evenConvert(64)-CITY_MARGIN-1,4*CITY_MARGIN,2*CITY_MARGIN+2).attr({'fill':WHITE}).attr({'stroke-width':0});
var Lexington = makeCity("LEXINGTON",75,75,64,64,LIGHT_RED,73.5,62,9,'end');
var Springfield = makeCity("SPRINGFIELD",55,55,72,72,LIGHT_CYAN,54.5,73,9,'end');
var Champaign = makeCity("CHAMPAIGN",57,57,74,72,LIGHT_CYAN,57.5,73,9,'start');
var Peoria = makeCity("PEORIA",54,54,74,74,LIGHT_CYAN,52.8,74,9,'end');
var Chicago = makeCity("CHICAGO",55,57,94,80,LIGHT_CYAN,54,86,14,'end');
var Madison = makeCity("MADISON",39,39,94,90,LIGHT_GREEN,39.3,89.3,9,'start');
var Milwaukee = makeCity("MILWAUKEE",43,43,94,94,LIGHT_GREEN,43.3,93.3,9,'start');
var GreenBay = makeCity("GREEN BAY",43,43,97,97,LIGHT_GREEN,43,98,9,'middle');
var Flint = makeCity("FLINT",69,75,97,97,LIGHT_MAGENTA,72,98,9,'middle');
var Lansing = makeCity("LANSING",69,69,96,96,LIGHT_MAGENTA,69.3,95.3,9,'start');
var GrandRapids = makeCity("GRAND RAPIDS",68,68,96,96,LIGHT_MAGENTA,68,97,9,'end');
var Detroit = makeCity("DETROIT",75,75,96,94,LIGHT_MAGENTA,75.5,95,9,'start');
var Gary = makeCity("GARY",65,65,94,80,LIGHT_YELLOW,65,95,9,'middle');
var Indianapolis = makeCity("INDIANAPOLIS",65,69,74,70,LIGHT_YELLOW,64.5,71.5,9,'end');
var Cincinnati = makeCity("CINCINNATI",71,75,74,73,LIGHT_BLUE,73,72,9,'middle');
var CincinnatiCover = canvas.rect(oddConvert(73)-2*CITY_MARGIN,evenConvert(74)-CITY_MARGIN-1,4*CITY_MARGIN,4*CITY_MARGIN+6).attr({'fill':WHITE}).attr({'stroke-width':0});
var Columbus = makeCity("COLUMBUS",71,71,70,70,LIGHT_BLUE,71,69,9,'middle');
var Akron = makeCity("AKRON",77,77,76,76,LIGHT_BLUE,77,77,9,'middle');
var Cleveland = makeCity("CLEVELAND",71,77,90,90,LIGHT_BLUE,72,91,9,'middle');
var ClevelandCover = canvas.rect(oddConvert(75)-2*CITY_MARGIN,evenConvert(90)-CITY_MARGIN-1,4*CITY_MARGIN,2*CITY_MARGIN+2).attr({'fill':WHITE}).attr({'stroke-width':0});
var Toledo = makeCity("TOLEDO",75,75,90,90,LIGHT_BLUE,75.5,92,9,'start');
var CharlestonWV = makeCity("CHARLESTON",77,77,64,64,LIGHT_YELLOW,77.5,63,9,'start');
var Richmond = makeCity("RICHMOND",95,95,64,64,LIGHT_MAGENTA,94.5,63,9,'end');
var Norfolk = makeCity("NORFOLK",97,97,64,64,LIGHT_MAGENTA,97.5,65,9,'middle');
var VirginiaBeach = makeCity("VIRGINIA BEACH",99,99,64,64,LIGHT_MAGENTA,96,63,8,'start');
var Washington = makeCity("WASHINGTON",94,95,66,66,LIGHT_CYAN,94.7,67,9,'end');
var Baltimore = makeCity("BALTIMORE",95,95,70,70,LIGHT_YELLOW,94.5,71,9,'end');
var WilmingtonDE = makeCity("WILMINGTON",95,95,73,73,LIGHT_BLUE,94.5,73,9,'end');
var Philadelphia = makeCity("PHILADELPHIA",95,95,76,76,LIGHT_RED,94.5,75,9,'end');
var Harrisburg = makeCity("HARRISBURG",81,83,77,77,LIGHT_RED,83.5,77,9,'start');
var Allentown = makeCity("ALLENTOWN",88,88,78,78,LIGHT_RED,86.5,78.7,9,'end');
var Pittsburgh = makeCity("PITTSBURGH",79.5,79.5,73,73,LIGHT_RED,79.5,72,9,'middle');
var Erie = makeCity("ERIE",79,79,91,91,LIGHT_RED,78.5,91,8,'end');
var Scranton = makeCity("SCRANTON",81,81,83,83,LIGHT_RED,81.5,83,8,'start');
var Newark = makeCity("NEWARK",95,95,78,78,LIGHT_MAGENTA,94.5,77,9,'end');
var JerseyCity = makeCity("JERSEY CITY",96,96,78,78,LIGHT_MAGENTA,95.5,77,8,'start');
var Paterson = makeCity("PATERSON",85,85,80,80,LIGHT_MAGENTA,84,81,8,'middle');
var Albany = makeCity("ALBANY",87,87,90,90,LIGHT_GREEN,86.7,89.3,8,'end');
var Buffalo = makeCity("BUFFALO",79.7,79.7,90,90,LIGHT_GREEN,78,89,8,'middle');
var Rochester = makeCity("ROCHESTER",80.3,80.3,90.5,90.5,LIGHT_GREEN,80.5,91,8,'start');
var Syracuse = makeCity("SYRACUSE",81,81,90,90,LIGHT_GREEN,81.5,88.6,8,'start');
var NewHaven = makeCity("NEW HAVEN",91,95,82,82,LIGHT_BLUE,95.5,81.3,8,'start');
var Hartford = makeCity("HARTFORD",91,91,84,84,LIGHT_BLUE,90.3,85,8,'start');
var Providence = makeCity("PROVIDENCE",95,95,87,87,LIGHT_RED,95.5,87,8,'start');
var Boston = makeCity("BOSTON",93,97,90,90,LIGHT_CYAN,95.5,91,9,'start');
var BostonCover = canvas.rect(oddConvert(95)-2*CITY_MARGIN,evenConvert(90)-CITY_MARGIN-1,4*CITY_MARGIN,2*CITY_MARGIN+2).attr({'fill':WHITE}).attr({'stroke-width':0});
var SpringfieldMA = makeCity("SPRINGFIELD",91,91,89,89,LIGHT_CYAN,91,88,8,'middle');
var Burlington = makeCity("BURLINGTON",89,89,98,98,LIGHT_YELLOW,88.5,98,8,'end');
var Manchester = makeCity("MANCHESTER",93,93,92,92,LIGHT_BLUE,92.5,92,8,'end');
var Concord = makeCity("CONCORD",89,93,93,93,LIGHT_BLUE,91,94,8,'middle');
var ConcordCover = canvas.rect(oddConvert(91)-2*CITY_MARGIN,evenConvert(93)-CITY_MARGIN-1,4*CITY_MARGIN,2*CITY_MARGIN+2).attr({'fill':WHITE}).attr({'stroke-width':0});
var PortlandME = makeCity("PORTLAND",95,95,95,95,LIGHT_RED,95.5,95,8,'start');
var Bangor = makeCity("BANGOR",95,95,98,98,LIGHT_RED,95.5,98,8,'start');

var HoustonText = canvas.text(oddConvert(57),evenConvert(5),"HOUSTON").attr({'font-family':'Ubuntu'}).attr({'font-size':'18px'}).attr({'fill':NORMAL_OF_LIGHT[LIGHT_RED]});

/* Lines to draw later: Phoenix, Houston, Lexington, Toledo, Syracuse */

var PhoenixLine = canvas.path(parseLine(oddConvert(18),evenConvert(11.5),oddConvert(17)+0.7*CITY_MARGIN,evenConvert(10)-0.7*CITY_MARGIN)).attr({'stroke':NORMAL_OF_LIGHT[LIGHT_MAGENTA]});
var HoustonLine1 = canvas.path(parseLine(oddConvert(52),evenConvert(5),oddConvert(45)+0.7*CITY_MARGIN,evenConvert(9)+0.7*CITY_MARGIN)).attr({'stroke':NORMAL_OF_LIGHT[LIGHT_RED]});
var HoustonLine2 = canvas.path(parseLine(oddConvert(62),evenConvert(5),oddConvert(68)-0.7*CITY_MARGIN,evenConvert(10)+0.7*CITY_MARGIN)).attr({'stroke':NORMAL_OF_LIGHT[LIGHT_RED]});
var LexingtonLine = canvas.path(parseLine(oddConvert(73.5),evenConvert(62.5),oddConvert(75)-0.7*CITY_MARGIN,evenConvert(64)+0.7*CITY_MARGIN)).attr({'stroke':NORMAL_OF_LIGHT[LIGHT_RED]});
var ToledoLine = canvas.path(parseLine(oddConvert(76),evenConvert(91.5),oddConvert(75)+0.7*CITY_MARGIN,evenConvert(90)-0.7*CITY_MARGIN)).attr({'stroke':NORMAL_OF_LIGHT[LIGHT_BLUE]});
var SyracuseLine = canvas.path(parseLine(oddConvert(82),evenConvert(89),oddConvert(81)+0.7*CITY_MARGIN,evenConvert(90)+0.7*CITY_MARGIN)).attr({'stroke':NORMAL_OF_LIGHT[LIGHT_GREEN]});

var highway5 = drawInterstate(5,0,100,[],[]);
var highway15 = drawInterstate(15,8,100,[],[]);
var highway17 = drawInterstate(17,10,41,[],[]);
var highway19 = drawInterstate(19,0,10,[],[]);
var highway25 = drawInterstate(25,10,90,[],[]);
var highway27 = drawInterstate(27,30,40,[],[]);
var highway29 = drawInterstate(29,70,100,[[35,70]],[]);
var highway35 = drawInterstate(35,1,98,[],[]);
var highway37 = drawInterstate(37,6,11,[[35,11]],[]);
var highway39 = drawInterstate(39,75,97,[[55,75]],[]);
var highway43 = drawInterstate(43,90,97,[[39,90]],[]);
var highway45 = drawInterstate(45,9,30,[],[]);
var highway49S = drawInterstate(49,10,20,[],[]); // check for non-intersects; ridiculous
var highway49M = drawInterstate(49,21,23,[],[]);
var highway49N = drawInterstate(49,26,30,[],[]);
var highway49NN = drawInterstate(49,40,42,[],[]);
var highway49NNN = drawInterstate(49,43,69,[],[]);
var highway55 = drawInterstate(55,10,95,[],[]);
var highway57 = drawInterstate(57,23,94,[[55,23]],[]);
var highway59 = drawInterstate(59,10,24,[[65,20]],[]); // check city at north end
var highway65 = drawInterstate(65,10,94,[],[]);
var highway69SSSS = drawInterstate(69,1,3,[],[]);
var highway69SSS = drawInterstate(69,11,13,[],[]);
var highway69SS = drawInterstate(69,21,20.5,[],[]);
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
var highway93 = drawInterstate(93,89,98,[[95,89],[91,98]],[]);
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
var con70and76 = [];
for(var loc=79.5;loc<=80.3;loc+=0.2){
  con70and76.push([76,loc]);
}

var highway2 = drawInterstate(2,68,69,[],[]); // this is the crazy 69
var highway4 = drawInterstate(4,74,95,[],[]);
var highway8 = drawInterstate(8,4,18,[[10,18]],[]);
var highway10 = drawInterstate(10,3,95,[],[]);
var highway12 = drawInterstate(12,52,59,[[10,52],[10,59]],[]);
var highway16 = drawInterstate(16,75,96,[],[]);
var highway20 = drawInterstate(20,28,95,[[10,28]],[]);
var highway22 = drawInterstate(22,57,58,[],[]);
var highway24 = drawInterstate(24,57,75,[[40,65],[40,66]],[]); // check for non-intersects
var highway26 = drawInterstate(26,77,97,[[40,80],[20,78]],[]); // check for non-intersects
var highway30 = drawInterstate(30,34,52,[[20,34],[40,52]],[]);
var highway40 = drawInterstate(40,15,99,[],[57]);
var highway44 = drawInterstate(44,29,56,[[70,56],[40,34]],[]); // check for non-intersects
var highway64 = drawInterstate(64,54,98,[[70,55]],[73,85]);
var highway66 = drawInterstate(66,81,94,[],[85]);
var highway68 = drawInterstate(68,79,80.5,[[70,80.5]],[]);
var highway70 = drawInterstate(70,15,99,con70and76,[69,73,85,95]);
var highway72 = drawInterstate(72,53,57,[],[]);
var highway74W = drawInterstate(74,53,75,[[80,53],[70,65]],[69,71]);
var highway74M = drawInterstate(74,77,78,[],[]); // check for non-intersects;
var highway74E = drawInterstate(74,85,95,[],[]); // check for non-intersects; south of 40; also intersects 73
var highway76W = drawInterstate(76,24,27,[[70,24],[80,27]],[]);
var highway76E = drawInterstate(76,71,99,[[80,78],[70,79.5],[70,80.1]],[]); // check for non-intersects; also intersects 79; 70-76 concurrency
var highway78 = drawInterstate(78,81,97,[],[]);
var highway80 = drawInterstate(80,3,99,con80and90.concat(con80and94),[87]); // 80-90 concurrency
var highway82 = drawInterstate(82,7,8,[[90,7],[84,8]],[]);
var highway84W = drawInterstate(84,5,16,[[80,16]],[]);
var highway84E = drawInterstate(84,81,92,[[90,92]],[]);
var highway86W = drawInterstate(86,13,15,[[84,13]],[]);
var highway86M = drawInterstate(86,79,80,[[90,79]],[79]);
var highway86E = drawInterstate(86,81,82,[],[]);
var highway88W = drawInterstate(88,37,54,[],[]);
var highway88E = drawInterstate(88,81,86,[[90,86]],[]);
var highway90 = drawInterstate(90,4,97,[[80,76]].concat(con90and94).concat(con90and94two),[]);
var highway94 = drawInterstate(94,24,76,[[90,24],[90,38],[90,41],[90,54],[90,56],[80,58],[80,66]],[]); // 80-94 concurrency from 58 to 66
var highway96 = drawInterstate(96,67,75,[[94,75]],[]);

var wywingText = canvas.text(oddConvert(50),evenConvert(2),"wywing.wordpress.com").attr({'font-family':'Ubuntu'}).attr({'font-style':'italic'}).attr({'font-size':'15px'}).attr({'fill':GRAY});
