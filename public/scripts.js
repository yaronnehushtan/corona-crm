const newCustomerForm = document.getElementById('new-customer-form');
const newEditForm=document.getElementById("edit-customer-form");
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

function createCustomer(customer) {
	return fetch(API_URL + '/customer', {
		method: 'PUT',
		body: JSON.stringify(customer),
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

// check all validations

function validate(form){
    let nameError=form.querySelector('.error-message-fullName');
    let emailError=form.querySelector('.error-message-email');
    let over18Error=document.getElementById('error-message-over18')
    

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


// render customer list
function renderCustomersList(){

    return fetch(API_URL+'/customer')
    .then(response => response.json())
    .then(customersList => {   
    
      tBody.innerHTML = '';
      
      customersList.forEach((customer)=>{
        const row= buildCustomerRow(customer)

        tBody.appendChild(row);
    })

})

}

function buildCustomerRow(customer) {
    const row = document.createElement('tr');
    customer.birthDate=customer.birthDate.split('-').reverse().join('/');
	row.innerHTML = `
		<td class="customerId">${customer.id}</td>
		<td class="fullName">${customer.fullName}</td>
		<td>${customer.email}</td>
        <td>${customer.birthDate}</td>
        <td>${customer.ctreatedDate}</td>
		<td class="">
            <button class="btn btn-sm btn-edit"><i class="far fa-edit mr-1 btn-edit"></i></button>
            <button class="btn btn-sm btn-delete"><i class="far fa-trash-alt text-danger btn-delete"></i></button>
        </td>`;
	row.querySelector('.btn-edit').addEventListener('click', () => {
        let check=uploadCustomerData(row);
		openModal('edit');
    });
    row.querySelector('.btn-delete').addEventListener('click', () => {
        let check=deletecustomerAlert(row);
        openModal('delete');
	});
	return row;
}

function uploadCustomerData(row) {
    let index=row.querySelector('.customerId').textContent;
    let url=API_URL+'/customer/'+index;

    return fetch(url)
    .then(response => response.json())
    .then(customerDetails => {   
        newEditForm.id.value=customerDetails.id;
        newEditForm.fullName.value=customerDetails.fullName;
        newEditForm.email.value=customerDetails.email;
        newEditForm.birthDate.value=customerDetails.birthDate;
        newEditForm.notes.value=customerDetails.notes;
    })

}

newEditForm.addEventListener('submit', (e) => {
    e.preventDefault();  

    if(!validate(newEditForm)){
        return;
    }

    updateCustomer ({
        id: newEditForm.id.value,
        fullName: newEditForm.fullName.value,  
        email: newEditForm.email.value,
        birthDate: newEditForm.birthDate.value,
        notes: newEditForm.notes.value
    });

    closeEditModal();

    renderCustomersList();

});
        
function updateCustomer(customer) {
    let url=API_URL+'/customer/'+customer.id;
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(customer),
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

function deletecustomerAlert(row) {
    let index=row.querySelector('.customerId').textContent;
    let url=API_URL+'/customer/'+index;
    const deleteCustomerName=document.getElementById('delete-customer-name');
    const deleteCustomerid=document.getElementById('delete-customer-id');

    return fetch(url)
    .then(response => response.json())
    .then(customerDetails => {   
        deleteCustomerName.textContent=customerDetails.fullName;
        deleteCustomerid.textContent=customerDetails.id;
    })   
    
}

const deleteBox=document.getElementById('delete-box');


document.getElementById('close-delete-modal-yes').addEventListener('click', ()=>{
    let index=document.getElementById('delete-customer-id').textContent;

    deletCustomer(index);

    closeDeleteModal();
    renderCustomersList();

});

function deletCustomer(customerId) {
    let url=API_URL+'/customer/'+customerId;
	return fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	});
}