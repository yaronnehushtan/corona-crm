const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let customers=[];
let id=1;

const today = new Date();
const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();


app.put('/customer', (req,res)=>{       //Create customer

    if (req.body.fullName.split(' ').length<2 || req.body.email.indexOf('@')===-1){
        res.status(400).json({"error": "Invalid input"});
        return
    }


    customers.push({
        id: id,     //changed from .length because in case of delete customer it repeats ids
		fullName: req.body.fullName,
		email: req.body.email,
		birthDate: req.body.birthDate,
		notes: req.body.notes,
        ctreatedDate: date
    });

    id++;
    res.status(201).send();
})

app.get('/customer', (req,res)=>{       //Get all customers
    res.json(customers);
})


app.get('/customer/:id',(req,res)=>{          //Get a customers by id
    const requestedCustomer = customers.find(customer=>{
        return customer.id === parseInt(req.params.id);
    });

    if (!requestedCustomer){
        res.status(404).send();
        return;
    };
    
    res.json(requestedCustomer); 
})


app.post('/customer/:id', (req,res)=>{      //edit customer
    const requestedCustomer= customers.find(customer=>{
        return customer.id === parseInt(req.params.id);
    })

    if (!requestedCustomer){
        res.status(404).send();
        return
    }

    if (req.body.fullName.split(' ').length<2 || req.body.email.indexOf('@')===-1){
        res.status(400).json({"error": "Invalid input"});
        return
    }

    
    requestedCustomer.fullName=req.body.fullName;
    requestedCustomer.email=req.body.email;
    requestedCustomer.birthDate=req.body.birthDate;
    requestedCustomer.notes=req.body.notes;

    res.status(200).send();
})


app.delete('/customer/:id', (req,res)=>{    //delete customer
    const requestedCustomer = customers.find(customer=>{
        return customer.id === parseInt(req.params.id);
    })

    if (!requestedCustomer){
        res.status(404).send();
        return
    }

    const index = customers.indexOf(requestedCustomer);
    customers.splice(index,1);
    res.status(204).send();

})


app.listen(port, () => {
	console.log('App is listening on port ' + port);
});