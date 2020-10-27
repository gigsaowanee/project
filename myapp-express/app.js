const expressFunction = require('express');
const mongoose = require('mongoose');
var expressApp = expressFunction();

const url = 'mongodb://localhost:27017/db_it';
const config = {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};
var Schema = require("mongoose").Schema;
const Employee = Schema({
   
   emid: String,
   name: String,
   phone: String,
 
},{
    collection: 'employee'
});

let Em
try{
    Em = mongoose.model('employee')
} catch(error){
    Em = mongoose.model('employee',Employee);
}

expressApp.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Option, Authorization')
    return next()
});

expressApp.use(expressFunction.json());
expressApp.use((req, res, next) => {
    mongoose.connect(url, config)
    .then(()=>{
        console.log('Connected to MongoDB...');
        next();
    })
    .catch(err => {
        console.log('Cannot connect to MongoDB');
        res.status(501).send('Cannot connect to MongoDB')
    });
});

const addEmployee = (EmData) => {
    return new Promise ((resolve,reject)=>{
        var new_em = new Em(
            EmData
        );
        new_em.save((err,data)=>{
            if(err){
                reject(new Error('Cannot insert employee to DB!'));
            }else{
                resolve({message: 'Employee added successfully'});
            }
        });
    });
}

const getEmployee = () =>{
    return new Promise ((resolve, reject)=>{
        Em.find({},(err,data) =>{
            if(err){
                reject(new Error('Cannot get employee!'));
            }else{
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot get employee!'));
                }
            }
        })
    });
}




expressApp.post('/employee/add',(req,res)=>{
    console.log('add');
    addEmployee(req.body)
        .then(result=>{
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
        })
});

expressApp.get('/employee/get',(req,res)=>{
    //console.log('get');
    getEmployee()
        .then(result => {
            //console.log(result);
            res.status(200).json(result);
        })
        .catch(err =>{
            console.log(err);
        })
});



expressApp.get('/employee/getsome/:id',(req,res)=>{
    //console.log('getsome');
    //console.log(req.params.id)
    //getsomeEmployee(req.params.id)
    Em.findById(req.params.id)
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err =>{
            console.log(err);
        })
});


expressApp.put('/employee/update/:id',(req,res)=>{
    //console.log('update');
    //console.log(req.params.id)
    console.log(req.body);

    const id = req.params.id;
    //getsomeEmployee(req.params.id)
    Em.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(result => {
            console.log(result);


            res.status(200).json(result);
        })
        .catch(err =>{
            console.log(err);
        })
});

expressApp.delete('/employee/delete/:id',(req,res)=>{
    //console.log('update');
    //console.log(req.params.id)
    console.log(req.body);

    const id = req.params.id;
    //getsomeEmployee(req.params.id)
    Em.findByIdAndRemove(id, req.body, )
        .then(result => {
            console.log(result);


            res.status(200).json(result);
        })
        .catch(err =>{
            console.log(err);
        })
});

expressApp.listen(3000,function(){
    console.log('Listening on port 3000');
});


