const express= require('express');
const app=express();

//Connecting server
let server=require('./server');
let middleware=require('./middleware');

//bodyparser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//for mongodb
const MongoClient=require('mongodb').MongoClient;
//database connection
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalManagement';
let db
MongoClient.connect(url,{useUnifiedTopology: true}, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected MongoDB: ${url}`);
    console.log(`Database : ${dbName}`);
});

//Fetching hospital details
app.get('/hospitalDetails',middleware.checkToken,function(req,res){
    console.log("Fetching data from hospitalDetails collection");
    var data=db.collection('hospitalDetails').find().toArray()
    .then(result=>res.json(result));
});

//Fetching ventilator details
app.get('/ventilatorDetails',middleware.checkToken,function(req,res){
    console.log("Fetching data from ventilatorDetails collection");
    var data=db.collection('ventilatorDetails').find().toArray()
    .then(result=>res.json(result));
});

//search ventilator by status
app.post('/searchventilatorbystatus',middleware.checkToken,function(req,res){
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilatorDetails').find({"status":status}).toArray()
    .then(result=>res.json(result));
});

//search ventilator by hospital name
app.post('/searchventilatorbyhospitalname',middleware.checkToken,function(req,res){
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilatorDetails').find({'name':new RegExp(name,'i')}).toArray()
    .then(result=>res.json(result));
});

//search hospital by name
app.post('/searchhospitalbyname',middleware.checkToken,function(req,res){
    var name=req.query.name;
    console.log(name);
    var hospitaldetails=db.collection('hospitalDetails').find({'name':new RegExp(name,'i')}).toArray()
    .then(result=>res.json(result));
});

//update ventilator details
app.put('/updateventilatordetails',middleware.checkToken,function(req,res){
    var ventid={ventilatorId: req.body.ventilatorId};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection("ventilatorDetails").updateOne(ventid,newvalues,function(err,result){
        res.json("1 document updated");
        if (err) throw err;
    });
    
});

//add ventilator details
app.post('/addventilatordetails',middleware.checkToken,function(req,res){
    var hId=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    var item={"hId":hId,"ventilatorId":ventilatorId,"status":status,"name":name};
    db.collection("ventilatorDetails").insertOne(item,function(err,result){
        res.json("1 item inserted");
        if (err) throw err;
    });
    
});

//delete ventilator by ventilator id
app.delete('/deleteventilatordetails',middleware.checkToken,function(req,res){
    var myquery=req.query.ventilatorId;
    console.log(myquery);
    var myquery1={"ventilatorId":myquery};
    db.collection("ventilatorDetails").deleteOne(myquery1,function(err,result){
        res.json("1 item deleted");
        if (err) throw err;
    });
    
});

app.listen(100);
