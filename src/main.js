/* eslint linebreak-style: ["error", "windows"] */
var infoBtn = document.querySelector('.infoButton');
var infoBox = document.querySelector('.infoBox');
var electricityPrice = document.querySelector('.electricityPrice');
var nowPrice = document.querySelector('.now');
var oneHourPrice = document.querySelector('.oneHour');
var cheapHourTime = document.querySelector('.cheapHour');
var cheapHourPrice = document.querySelector('.cheapPrice');
var electricityArea;
var electricitySaver;
var electricityPrices = [];
var date = new Date();
var cheapHour;
var cheapPrice;
var sumNow;
var sumOneHour;
var sumCheapHour;
var averageElectricityPrice = 0;
var showAppInformation = false;
function appInformation() {
    if (!showAppInformation) {
        showAppInformation = true;
        infoBox.style.visibility = 'visible';
    }
    else {
        showAppInformation = false;
        infoBox.style.visibility = 'hidden';
    }
}
infoBtn.addEventListener('click', appInformation);
function displayElectricityPrice() {
    electricityPrice.innerHTML = '';
    electricityPrice.innerHTML += "\n  <h2> Elpris just nu: ".concat(electricityPrices[2][date.getHours()], " \u00F6re/kWh</h2>\n  ");
    // Här räknas det billigaste priset ut samt vilken timme det är
    for (var i = 0; i < 24; i++) {
        if (Number(electricityPrices[2][i]) < cheapPrice || (typeof cheapPrice === 'undefined')) {
            cheapPrice = Number(electricityPrices[2][i]);
            cheapHour = i;
        }
        averageElectricityPrice += Number(electricityPrices[2][i]);
    }
    averageElectricityPrice /= 24;
    if (Number(electricityPrices[2][date.getHours()]) > averageElectricityPrice) {
        var e = document.querySelector('.electricityPriceBackground');
        e.style.backgroundImage = 'url(../../public/photos/frost.jpg)';
        e.style.opacity = '0.7';
        document.body.classList.add('highPrice');
    }
}
function displayActivityCost() {
    var sumToPrint = sumNow.toFixed(2);
    var sumToPrintOneHour = sumOneHour.toFixed(2);
    var sumToPrintCheapHour = sumCheapHour.toFixed(2);
    var cheapHourString = cheapHour.toString();
    var cheapHourPadded = cheapHourString;
    if (cheapHour < 10) {
        cheapHourPadded = '0'.concat(cheapHourString);
    }
    nowPrice.innerHTML = '';
    nowPrice.innerHTML += "\n  ".concat(sumToPrint, " SEK\n  ");
    oneHourPrice.innerHTML = '';
    oneHourPrice.innerHTML += "\n  ".concat(sumToPrintOneHour, " SEK\n  ");
    cheapHourTime.innerHTML = '';
    cheapHourTime.innerHTML += "\n  ".concat(cheapHourPadded, ":00 \u00E4r priset\n  ");
    cheapHourPrice.innerHTML = '';
    cheapHourPrice.innerHTML += "\n  ".concat(sumToPrintCheapHour, " SEK\n  ");
}
function getElectricityAreaPrices(area) {
    // const response = fetch('https://entsoe-cache.plsh.se/SE3.json');
    // electricityPrices = response.json() as string[];
    fetch('https://entsoe-cache.plsh.se/'.concat(area, '.json'), { cache: 'no-cache' })
        .then(function (data) { return data.json(); })
        .then(function (json) {
        console.table(json);
        electricityPrices = json;
        // return electricityPrices[0][20];
        console.log(electricityPrices[0][9]);
        displayElectricityPrice();
        window.scrollTo({
            top: 700,
            behavior: 'smooth'
        });
    })["catch"](function (err) {
        console.error('Error fetching electricity prices:', err);
    });
}
function getActivityCost(activity) {
    // formel för att omvandla elpriset till motsvarande kostnad för respektive aktivitet
    var activityCost = Number(electricityPrices[2][date.getHours()]);
    var activityCostOneHour = Number(electricityPrices[2][date.getHours() + 1]);
    var activityCostCheapHour = Number(electricityPrices[2][cheapHour]);
    console.log('activityCost: '.concat(activityCost.toString()));
    if (activity === 'shower') {
        sumNow = activityCost * 0.044; // kostnaden i kronor för aktiviteten
        sumOneHour = activityCostOneHour * 0.044; // kostnaden i kronor för aktiviteten
        sumCheapHour = activityCostCheapHour * 0.044; // kostnaden för aktiviteten i kronor
    }
    if (activity === 'dryer') {
        sumNow = activityCost * 0.05; // kostnaden i kronor för aktiviteten
        sumOneHour = activityCostOneHour * 0.05; // kostnaden i kronor för aktiviteten
        sumCheapHour = activityCostCheapHour * 0.05; // kostnaden för aktiviteten i kronor
    }
    if (activity === 'chargeCar') {
        sumNow = activityCost * 0.1; // kostnaden i kronor för aktiviteten
        sumOneHour = activityCostOneHour * 0.1; // kostnaden i kronor för aktiviteten
        sumCheapHour = activityCostCheapHour * 0.1; // kostnaden för aktiviteten i kronor
    }
    displayActivityCost();
    console.log(sumNow);
    console.log(activity);
}
function chooseElectricityArea(e) {
    /* Här lägger jag in om kunden väljer område ett visas elprisområde ett osv. */
    var element = e.currentTarget;
    switch (element.value) {
        case 'electricityArea1':
            getElectricityAreaPrices('SE1');
            break;
        case 'electricityArea2':
            getElectricityAreaPrices('SE2');
            break;
        case 'electricityArea3':
            getElectricityAreaPrices('SE3');
            break;
        case 'electricityArea4':
            getElectricityAreaPrices('SE4');
            break;
        default:
    }
    console.log(chooseElectricityArea);
}
function chooseActivity(e) {
    // Kunden får välja vilken aktivitet hen vill utföra samt om hen vill ha en notifikation om när elpriset är som lägst
    if ('Notification' in window) {
        if (true) {
            Notification.requestPermission()
                .then(function (permission) {
                if (permission === 'granted') {
                    var options = {
                        body: 'Billigaste timmen att göra detta är klockan '.concat(cheapHour.toString(), ':00'),
                        img: '../../public/photos/fire.jpg'
                    };
                    var notification = new Notification('Notification', options);
                }
            })["catch"](function () { });
        }
    }
    else {
        // API not supported
    }
    var element = e.currentTarget;
    switch (element.value) {
        case 'shower':
            getActivityCost('shower');
            break;
        case 'dryer':
            getActivityCost('dryer');
            break;
        case 'chargeCar':
            getActivityCost('chargeCar');
            break;
        default:
    }
    console.log(chooseActivity);
}
function initFields() {
    // Function to declare fields
    electricityArea = document.querySelector('.chooseElectricityArea');
    electricityArea.addEventListener('change', chooseElectricityArea);
    electricitySaver = document.querySelector('.chooseSpendingMethod');
    electricitySaver.addEventListener('change', chooseActivity);
}
initFields();
/*

Plan för elprisappen

Funktioner
- Hämta aktuella elpriser från externt API - klart
- Räkna ut medelpris/dygn aktuellt dygn och säga om priset är högt/lågt i förhållande till det - klart
- Ha ett tema för högt pris och ett för lågt pris - klart
- Visar aktuellt elpris i ett visst område - klart
- En ruta som berättar vad det kostar att ladda bilen/torktumla/något annat som drar mycket el just nu
  och hur mycket du sparar om du väntar till dygnets billigaste timme - klart
- En notis som meddelar användaren när det är möjligt att duscha för en viss summa exempelvis
- En inforuta om hur jag räknat

    TODO
    x Göra en wireframe
    x Göra bas-HTML/CSS
    x Leta reda på bilder för olika teman
    x Fundera på vilka funktioner som ska finnas i JS
    x Ta reda på var API för elpriser finns
    x Skriv funktion för att beräkna medelelpris för ett dygn

*/
