require('../src/db/mongoose');
const User = require('../src/models/user'); 
//5e07f08bcafbfa687c215f77

// User.findByIdAndUpdate('5e126ead571b5c4de8e91991', {age: 1}).then(user => {
//     console.log(user);
//     return User.countDocuments({age: 1})
// }).then(users => {
//     console.log(users);
// }).catch(e => {
//     console.log(e);
// })

const updateAgeAndCount = async (id, age) => {
    const deletedUser = await User.findByIdAndUpdate(id);
    const count = await User.countDocuments({age})
    return count;
}
updateAgeAndCount('5e07f08bcafbfa687c215f77', 1).then(count => {
    console.log(count);
}).catch(e => {
    console.log(e);
})