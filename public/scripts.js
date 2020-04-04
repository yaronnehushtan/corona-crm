const newCustomerForm = document.getElementById('new-customer-form');
const API_URL= 'http://localhost:3000';
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
    let nameError=document.getElementsByClassName('error-message')[0];
    let emailError=document.getElementsByClassName('error-message')[1];
    let over18Error=document.getElementsByClassName('error-message')[2];
    
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
      let idTh=document.createElement("th");
      let fullNameTd=document.createElement("td");
      let emailTd=document.createElement("td");
      let birthDateTD=document.createElement("td");
      let ctreatedDateTd=document.createElement("td");

      idTh.textContent=customer.id;
      idTh.setAttribute("scope", "row");
      fullNameTd.textContent=customer.fullName;
      emailTd.textContent=customer.email;
      birthDateTD.textContent=customer.birthDate.split('-').reverse().join('/');
      ctreatedDateTd.textContent=customer.ctreatedDate; 

      let actionTd=document.createElement("td");
      let editCustomerI=document.createElement("i");
      let deleteCustomerI=document.createElement("i");
      editCustomerI.setAttribute("class", "far fa-edit mr-2");
      deleteCustomerI.setAttribute("class", "far fa-trash-alt text-danger ml-1");
      actionTd.appendChild(editCustomerI);
      actionTd.appendChild(deleteCustomerI);
     
      row.appendChild(idTh);
      row.appendChild(fullNameTd);
      row.appendChild(emailTd);
      row.appendChild(birthDateTD);
      row.appendChild(ctreatedDateTd);
      row.appendChild(actionTd);
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
    let CORONA_DATA_API_URL='https://corona-api.com/countries/'+inputCountry;
    
    return fetch(CORONA_DATA_API_URL)
    .then(response => response.json())
    .then(coronaData => {  
    
    let israelCoronaData=coronaData.data
    countryName.textContent=israelCoronaData.name;
    totalCases.textContent=israelCoronaData.latest_data.confirmed
    casesToday.textContent=israelCoronaData.today.confirmed
    totalDeath.textContent=israelCoronaData.latest_data.deaths
    totalRecovered.textContent=israelCoronaData.latest_data.recovered

    let israelCoronaTLData=coronaData.data.timeline;

    const entries = Object.entries(israelCoronaTLData)
    let israelTLDates=[];
    let israelTLCases=[];

    entries.forEach((dayData)=>{
        let dateHebNoYearArr=dayData[1].date.split('-').reverse();
        dateHebNoYearArr.pop();
        israelTLDates.push(dateHebNoYearArr.join('/'));
        israelTLCases.push(dayData[1].confirmed);
    })

    israelTLDates=israelTLDates.reverse();
    israelTLCases=israelTLCases.reverse();
    // dont forget in install npm chart package by: npm install chart.js --save
    let coronaPerDayChart=document.getElementById('corona-per-day-chart').getContext('2d');
    let massChart = new Chart(coronaPerDayChart, {
        type: 'bar',
        data: {
            labels: israelTLDates,
            datasets: [{
                label: 'Confirmed cases',
                data: israelTLCases,
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
    })


    
}





 