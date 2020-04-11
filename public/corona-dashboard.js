//-------------------------------
//      Corona Dashboard
//-------------------------------

const CORONA_DATA_API_URL='https://corona-api.com/countries';


// DOM
const newChooseContryForm = document.getElementById('new-choose-country-form');
const countryName=document.getElementById('country-name');
const totalCases=document.getElementById('total-cases');
const casesToday=document.getElementById('cases-today');
const totalDeath=document.getElementById('death');
const totalRecovered=document.getElementById('recovered');
const coronaPerDayChart=document.getElementById('corona-per-day-chart').getContext('2d');

// call render corona dashboard first time
 let coronaData=renderCoronaData(inputCountry=newChooseContryForm.countyChosen.value);

// call render corona dashboard after chosing a country
 newChooseContryForm.addEventListener('submit', (e) => {
     e.preventDefault();
     const inputCountry=newChooseContryForm.countyChosen.value
     let coronaData=renderCoronaData(inputCountry);
 });


// render corona dashboard function
function renderCoronaData(inputCountry){
    let coronaApiByCountry=CORONA_DATA_API_URL+'/'+inputCountry;
    
    return fetch(coronaApiByCountry)
    .then(response => response.json())
    .then(coronaData => {  
    
    let israelCoronaData=coronaData.data
    countryName.textContent=israelCoronaData.name;
    totalCases.textContent=numberWithCommas(israelCoronaData.latest_data.confirmed);
    casesToday.textContent=numberWithCommas(israelCoronaData.today.confirmed);
    totalDeath.textContent=numberWithCommas(israelCoronaData.latest_data.deaths);
    totalRecovered.textContent=numberWithCommas(israelCoronaData.latest_data.recovered);

    let updateChartVar=updateChart(coronaData.data.timeline);
    // console.log('giong to map from 47 line:' + israelCoronaData.coordinates.latitude + "&" + israelCoronaData.coordinates.longitude);
    GetMap(israelCoronaData.coordinates.latitude,israelCoronaData.coordinates.longitude);   
    }) 
}


function numberWithCommas(strNum) {
    return strNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convertToHebDayAndMonth (date){
    let dateHebNoYearArr=date.split('-').reverse();
    dateHebNoYearArr.pop();
    return dateHebNoYearArr.join('/');
}

function updateChart (timeLineData) {
    const entries = Object.entries(timeLineData)
    let timeLineDates=[];
    let timeLineCases=[];

    entries.forEach((dayData)=>{
        timeLineDates.push(convertToHebDayAndMonth(dayData[1].date));
        timeLineCases.push(dayData[1].confirmed);
    })

    timeLineDates=timeLineDates.reverse();
    timeLineCases=timeLineCases.reverse();

    let presentChartVar=presentChart(timeLineDates,timeLineCases);
    return presentChartVar
}

function presentChart (timeLineDates,timeLineCases) {     
    let massChart = new Chart(coronaPerDayChart, {
        type: 'bar',
        data: {
            labels: timeLineDates,
            datasets: [{
                label: 'Confirmed cases',
                data: timeLineCases,
                backgroundColor: '#0062cc',
                hoverBackgroundColor: 'silver'
            }]   
        },
        options:{
            legend:{
              display:false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    return massChart
}


// map

function GetMap(latitude,longitude) {
    console.log(latitude);
    if (!longitude || !latitude){
        return
    }

    let map = new Microsoft.Maps.Map('#myMap');
        map.setView({
                mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                center: new Microsoft.Maps.Location(latitude,longitude),
                zoom: 5,
                credentials: 'ApO89CjG_LmYqW3s-AivA5LLymPwoXzBogjDhfsM4LViUPe2iBsf6wiId6QmGKLa'
            }); //en-US
}

 