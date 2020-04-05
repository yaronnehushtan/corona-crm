const newCustomerForm = document.getElementById('new-customer-form');
const API_URL= 'http://localhost:3000';
const CORONA_DATA_API_URL='https://corona-api.com/countries'
const tBody=document.getElementById("customers-list-table-body");



newCustomerForm.addEventListener('submit', (e) => {
    e.preventDefault();  

    if(!validate(newCustomerForm)){
        return;
    }

    createCustomer ({
        fullName: newCustomerForm.fullName.value,  
        email: newCustomerForm.email.value,
        birthDate: newCustomerForm.birthDate.value,
        notes: newCustomerForm.notes.value
    });

    renderCustomersList();

});

// check all validations
function validate(form){
    let nameError=document.getElementById('error-message-fullName');
    let emailError=document.getElementById('error-message-email');
    let over18Error=document.getElementById('error-message-over18');

    let validName=true;
    let validEmail=true;
    
    if (!form.over18.checked){  
        over18Error.classList.remove("d-none");   
    } else {
        over18Error.classList.add("d-none")
    }

    if (form.fullName.value.split(" ").length<2){
        nameError.classList.remove("d-none");
        validName=false;
    } else {
        nameError.classList.add("d-none")
    }

    if (form.email.value.indexOf('@')===-1){
        emailError.classList.remove("d-none"); 
        validEmail=false;
    } else {
        emailError.classList.add("d-none")
    }

    if (!validName || !validEmail || !form.over18.checked){
        return false;
    } 
       
    return true;
}


function createCustomer(customer) {
	return fetch(API_URL + '/customer', {
		method: 'PUT',
		body: JSON.stringify(customer),
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

// render customer list
function renderCustomersList(){
    return fetch(API_URL+'/customer')
    .then(response => response.json())
    .then(customersList => {   
    
      tBody.innerHTML = '';
      customersList.forEach((customer)=>{
        let row=document.createElement("tr");
        let objTd={};

        for (key in customer) {
            // create tds and set atribute

            if (key!=='notes') {
                if (key==='id') {
                    objTd[key]=document.createElement("th");
                    objTd[key].setAttribute("scope", "row")
                } else {
                    objTd[key]=document.createElement("td");
                }
        
                // Add text content
                if (key==='birthDate') {
                    objTd[key].textContent=customer[key].split('-').reverse().join('/')
                } else {
                    objTd[key].textContent=customer[key];
                }
            }       
        }

        // Add Action td
        objTd.action=document.createElement("td");
        let editCustomerI=document.createElement("i");
        let deleteCustomerI=document.createElement("i");
        editCustomerI.setAttribute("class", "far fa-edit mr-2");
        deleteCustomerI.setAttribute("class", "far fa-trash-alt text-danger ml-1");
        objTd.action.appendChild(editCustomerI);
        objTd.action.appendChild(deleteCustomerI);      
        
        //append all tds to row
        for (key in objTd) {
            row.appendChild(objTd[key]);
        }

        tBody.appendChild(row);   
    })

})

}


//-------------------------------
//      Corona Dashboard
//-------------------------------

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




 