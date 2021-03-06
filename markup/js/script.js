"use strict";

var i;
for (i = 0; i < 10; i++) {
  if(i%2 == 0){
    console.log("fiz");
  }else if (i%3 == 0) {
    console.log("fizbuz");
  }else {
    console.log("buz");
  }
}  


var available = 500;
var minimal = 1200;

var request = minimal * 8;

var total = Math.round( request/available+1 );
console.log( total );


var seconds = 6000;
var hoursround = Math.floor ( seconds / 3600 );
var hoursabove = seconds % 3600;
var minutesround = Math.floor ( hoursabove / 60 );
var seconds = Math.floor ( hoursabove % 60 );
var hs = 'РіРѕРґРёРЅ';
var hv = 'С…РІРёР»РёРЅ';
var sek ='СЃРµРєСѓРЅРґ';
console.log( hoursround, hs, minutesround, hv, seconds, sek );

var seconds = 25781452;
var hoursround = Math.floor ( seconds / 3600 );
var hoursabove = seconds % 3600;
var minutesround = Math.round ( hoursabove / 60 );
var seconds = Math.round ( hoursabove % 60 );
var hs = 'РіРѕРґРёРЅ';
var hv = 'С…РІРёР»РёРЅ';
var sek ='СЃРµРєСѓРЅРґ';
console.log( hoursround, hs, minutesround, hv, seconds, sek );

var seconds = 47624796224896;
var hoursround = Math.floor ( seconds / 3600 );
var hoursabove = seconds % 3600;
var minutesround = Math.round ( hoursabove / 60 );
var seconds = Math.round ( hoursabove % 60 );
var hs = 'РіРѕРґРёРЅ';
var hv = 'С…РІРёР»РёРЅ';
var sek ='СЃРµРєСѓРЅРґ';
console.log( hoursround, hs, minutesround, hv, seconds, sek );

var seconds = 4568;
var hoursround = Math.floor ( seconds / 3600 );
var hoursabove = seconds % 3600;
var minutesround = Math.floor ( hoursabove / 60 );
var seconds = Math.floor ( hoursabove % 60 );
var hs = 'РіРѕРґРёРЅ';
var hv = 'С…РІРёР»РёРЅ';
var sek ='СЃРµРєСѓРЅРґ';
console.log( hoursround, hs, minutesround, hv, seconds, sek );




var arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var month = new Date().getMonth();
console.log(arr[month]);