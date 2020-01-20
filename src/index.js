const express = require('express');
const app = express();

require('./db/mongoose');

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task');

// THIS IS AN EXPRESS MIDDLEWARE - IT CAN BE USE ALSO ON EACH ROUTE
// app.use((req, res, next) => { 
//     console.log(req.method);
//     if(req.method === 'GET') {
//         res.send('get methods are disabled')
//     } else{
//         next();
//     }
// })

// CONVERT JSON TO OBJECT AUTOMATICALLY
app.use(express.json())

// USE ROUTES CREATED IS SEPERATED FILES
app.use(userRouter);
app.use(taskRouter);

const multer = require('multer');
const upload = multer({
    dest:'images',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
        console.log(file.mimetype)
        // if (!file.originalname.endsWith('.pdf')) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return callback(new Error('please upload a word document'));
        }
        callback(undefined, true);
        // callback(new Error('file must be a PDF'))
        // callback(undefined, true);
        // callback(undefined, false);

    }
})

app.post('/upload', upload.single('upload') , (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message })
})

const port = process.env.PORT;
app.listen(port, () => {
    console.log('server is listenning on port ', + port)
})

// EXAMPLE
// PROUVE THAT toJSON IS CALLED BEFORE JSON.stringlify
// SO WE CAN CHANGE AN ENDPOINT RESPONSE WITHOUT CALL ANY METHOD
// SEE userSchema.methods.toJSON IN USER MODEL
// THEN, EACH TIME THE USER IS RETURNED TO CLIENT, DATA IS FORMATTED AUTOMATICALLY
// const pet = {
//     name: 'name',
// }
// pet.toJSON  = function () {
//     return {...this, hehe: 'hehe'}
// }
// console.log(JSON.stringify(pet))

// PROUVE THAN WE CAN RETRIVE RELATED TASKS FROM USER
// NEED TO BE CONFIGURE IN MODEL
// SEE VIRTUAL TASKS IN USER MODEL 
// SEE OWNER IN TASK MODEL
// const Task = require('./models/task');
// const User = require('./models/user');
// const main = async () => {
//     const task = await Task.findById('5e23b12e924d5034f0131be4');
//     await task.populate('owner').execPopulate();
//     console.log(task.owner);

//     const user = await User.findById('5e23b05168db5d4340de6f1b')
//     await user.populate('tasks').execPopulate(); // see user model (virtual)
//     console.log(user.tasks);

// }
// main(); 
