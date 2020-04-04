const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let customers=[];
const today = new Date();
const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();


app.put('/customer', (req,res)=>{       //Create customer
    const fullName=req.body.fullName;
    const email=req.body.email;
    const birthDate=req.body.birthDate;
    const notes=req.body.notes;

    if (fullName.split(' ').length<2 || email.indexOf('@')===-1){
        res.status(400).json({"error": "Invalid input"}).send();
        return
    }

    customers.push({
        id: customers.length+1,
        fullName: fullName,
        email: email,
        birthDate: birthDate,
        notes: notes,
        ctreatedDate: date
    });

    res.status(201).send();
})

app.get('/customer', (req,res)=>{       //Get all customers
    res.json(customers);
})


app.get('/customer/:id',(req,res)=>{          //Get a customers by id
    const requestedCustomer = customers.find(customer=>{
        console.log(req.params.id);
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

    const index = customers.indexOf(requestedCustomer);
    customers[index].fullName=req.body.fullName;
    customers[index].email=req.body.email;
    customers[index].birthDate=req.body.birthDate;
    customers[index].notes=req.body.notes;

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