// 1.
var array = ["РџСЂРёРІРµС‚,", "РјРёСЂ", "!"];

var helloWorld = "";
for (let i=0; i < array.length; i++) {
    helloWorld += array[i];
}

console.log(helloWorld);

// 2.
var language = prompt("Р’РІРµРґРёС‚Рµ СЏР·С‹Рє (ru/en): ");
var arrayRu = ["РїРѕРЅРµРґiР»РѕРє", "РІiРІС‚РѕСЂРѕРє", "СЃРµСЂРµРґР°", "С‡РµС‚РІРµСЂРі", "Рї'СЏС‚РЅРёС†СЏ", "СЃСѓР±РѕС‚Р°", "РЅРµРґiР»СЏ"];
var arrayEn = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var array = [];

if (language == "ru") {
    array = array.concat(arrayRu);
} else if (language == "en") {
    array = array.concat(arrayEn);
}

console.log(String(array));

array = [];
switch (language) {
    case "ru":
        array = array.concat(arrayRu);
        break;
    case "en":
        array = array.concat(arrayEn);
        break;
}

console.log(String(array));

var arr = [
    ['arrayRu', 'arrayEn'],
]

if (language == "ru") {
    console.log(String(arr[0][0]));
} else if (language == "en") {
    console.log(String(arr[0][1]));
}

      (language == "ru") ? console.log(arr[0][0]): 
      (language == "en") ? console.log(arr[0][1]);
      

// 3.

var floor = +prompt("Р’РІРµРґРёС‚Рµ РєРѕР»РёС‡РµСЃС‚РІРѕ СЌС‚Р°Р¶РµР№ РІ РґРѕРјРµ");
var entrance = +prompt("Р’РІРµРґРёС‚Рµ РєРѕР»РёС‡РµСЃС‚РІРѕ РїРѕРґСЉРµР·РґРѕРІ РІ РґРѕРјРµ");
var numberOfApartments = +prompt("Р’РІРµРґРёС‚Рµ РєРѕР»РёС‡РµСЃС‚РІРѕ РєРІР°СЂС‚РёСЂ РЅР° СЌС‚Р°Р¶Рµ");
var apartment = +prompt("Р’РІРµРґРёС‚Рµ РЅРѕРјРµСЂ РєРІР°СЂС‚РёСЂС‹");
 
var findApartment = function(){
    var apartmentsInEntrance = floor * numberOfApartments;
    
    var findEntrance = Math.floor(apartment / apartmentsInEntrance + 1);
    
    var findFloor;

    if (apartment > apartmentsInEntrance) {
        findFloor = Math.floor((apartment / numberOfApartments) / floor + 1);
    } else if (apartment <= apartmentsInEntrance && apartment > numberOfApartments) {
        findFloor = Math.floor(apartment / numberOfApartments + 1);
    } else if (apartment <= apartmentsInEntrance && apartment <= numberOfApartments) {
        findFloor = Math.floor(apartment / numberOfApartments);
    }
    

    if(apartment > 0 && findFloor !== "NaN" && findFloor > 0 && findEntrance !== "NaN" && findEntrance > 0) {
        console.log(`РљРІР°СЂС‚РёСЂР° в„–"${apartment} РЅР°С…РѕРґРёС‚СЃСЏ РЅР° ${findFloor} СЌС‚Р°Р¶Рµ ${findEntrance} РїРѕРґСЉРµР·РґР°`);
    } else {
        console.log("Р’С‹ РІРІРµР»Рё РЅРµРґРѕРїСѓСЃС‚РёРјРѕРµ Р·РЅР°С‡РµРЅРёРµ");
    }
};

findApartment();
