require('../src/db/mongoose')
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5e07f3904eb1b6719405e11d').then(res => {
//     return Task.countDocuments({completed: false})
// }).then(res => {
//     console.log(res);
// }).catch(e => {
//     console.log(e);
// })

const deleteAndCount = async (id) => {
    const deletedUser = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false})
    return count;
}

deleteAndCount('5e1da963ac08632ad840879b').then(res => {
    console.log(res);
}).catch(e => {
    console.log(e);
})