const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const client = require('./db/config');
const connecToMongoDb = require('./db/connect')
const ObjectID = require('mongodb').ObjectID;

const app = express();
const port = 3003;

// express middlware seciton 
// area to add modification to existing servers to handle addtional changes
app.use(bodyParser.urlencoded({ extended: true })); // inorder to understand the data sent from react app is json format we need this to be added
app.use(bodyParser.json()); // inorder to understand the data sent from react app is json format we need this to be added

app.use(cors({ origin: '*'  }));

let db;

// connecting to mongodb database
client.connect((dbconnerror, client) => {
    if (dbconnerror) {
        throw dbconnerror;
    } else {
        db = client.db('zenfoods-database');
    }
})



// performing CRUD operations API endpoints 
// create endpoint
app.post('/addfooddetails', (req, res) => {

    if (db) {
        db.collection('foodDetails').insertOne(req.body, (err, result) => {

            if (err) {
                res.send({
                    message: 'Server side  error!',
                    status: 500
                });
            } else {

                res.send({ status: 200, message: "food details added successfully" })
            }
        })
    } else {
        res.send({
            message: 'Db connection error!',
            status: 500
        });
    }


})

// read endpoint
app.get('/viewfooddetails', (req, res) => {
    db.collection('foodDetails').find().toArray((err, result) => {
        if (err) {
            throw err;
        } else {

            res.send({ status: 200, message: "food details retrieved successfully", data: result })
        }
    })
})
// update endpoint
app.put('/updatefooddetails', (req,res) => {
    db.collection('foodDetails').updateOne({ _id: ObjectID(req.body.id) }, {
        $set: {
            name: req.body.name,
            flatNo: req.body.flatNo,
            BuildingName: req.body.BuildingName,
            amount: req.body.amount
        }
    }, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send({ status: 200, message: "food details added successfully" })
        }
    })
})
// delete endpoint
app.delete('/deletefooddetails', (req,res) => {
   
    if (db) {
        db.collection('foodDetails').deleteOne({ _id: ObjectID(req.body.id) }, (err, result) => {
            if (err) {
                res.send({
                    message: 'Server side  error!',
                    status: 500
                });
            } else {

                res.send({ status: 200, message: "food details deleted successfully" })
            }
        })
    } else {
        res.send({
            message: 'Db connection error!',
            status: 500
        });
    }
})

app.listen(port, () => {
    console.log("server has started via port:", port)
})

