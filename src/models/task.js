const mongoose = require('mongoose');

// HERE THE SCHEMA IS DIRECTLY GIVEN AS SECOND PARAMETER OF MODEL FUNCTION
// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     completed: {
//         type: Boolean,
//         default: false,
//     },
//     // CREATE A REAL FIELD AND THE LINK WITH THE TASK
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     }
// })
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    // CREATE A REAL FIELD AND THE LINK WITH THE TASK
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task =  mongoose.model('Task', taskSchema);

module.exports = Task;