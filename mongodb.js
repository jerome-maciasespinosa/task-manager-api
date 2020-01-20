const mongodb = require('mongodb');
const {ObjectID, MongoClient} = mongodb;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const database = 'task-manager';

// const id = new ObjectID();

MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) {
        return console.log('error during connection ', err);
    }
    console.log('connected');
    const db = client.db(database);

    // db.collection('users').deleteMany({age: {
    //     $gte: 30
    // }}).then(res => {
    //     console.log(res);
    // }).catch(err=>{
    //     console.log('err ', err);
    // })
    // db.collection('users').deleteOne({age: {
    //     $gte: 30
    // }}).then(res => {
    //     console.log(res);
    // }).catch(err=>{
    //     console.log('err ', err);
    // })

    // db.collection('tasks').updateMany({completed: false}, {$set: {completed: true}})
    // .then(res => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log('err ', err);
    // })

    // db.collection('users').updateOne({_id: new ObjectID("5e067b14f03ea8709c0c65c0")}, {$inc: {
    //     age: -2
    // }}).then((res) => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log('err ', err);
    // })

    // db.collection('users').updateOne({_id: new ObjectID("5e06790ebb896783dcb26c68")}, {$set: {
    //     name: 'loraine'
    // }}).then((res) => {
    //     console.log(res);
    // }).catch(err => {
    //     console.log('err ', err);
    // })
   
    // db.collection('tasks').find({completed: true}).toArray((err, res) => {
    //     console.log('completed task ' , res);
    // });
    // db.collection('tasks').findOne({}, {sort: {_id: -1}, limit: 1}, (err, res) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log('last entered ', res);
    // })

    // db.collection('users').findOne({_id: new ObjectID("5e0675ee5c310d739c064c8c")}, (err, res) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log(res);
    // })

    // db.collection('users').find({name: 'Jérôme'}).toArray((err, res) => {
    //     console.log(res)
    // });

    // db.collection('users').insertOne({
    //     name: 'vikram',
    //     age: 29
    // }, (err, res) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log(res.ops);
    // })

    // db.collection('users').insertMany([{
    //     name: 'jme',
    //     age:30
    // }, {
    //     name: 'jen',
    //     age: 28
    // }], (err, res) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log(res.ops);
    // })

});