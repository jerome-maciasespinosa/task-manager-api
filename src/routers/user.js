const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const {sendWelcomeEmail, sendCancellationEmail} = require('./../emails/account');


const router = new express.Router();

const User = require('./../models/user');
const auth = require('../middlewares/auth')


router.get('/users/me', auth, (req, res) => {
    res.send(req.user); 
})

router.post('/users',  async (req, res, next) =>{
    const user = new User(req.body);
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user){
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

// router.patch('/users/:id', auth,  async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['name', 'age', 'email', 'password'];
//     const isValidOperation = updates.every(item => allowedUpdates.includes(item));
//     if (!isValidOperation) return res.status(400).send({error: 'Invalid updates'})
//     try {
//         // in place of findByIdAndUpdate, we need to get it and then save it and so execute some stuff before saving in middleware
//         const user = await User.findById(req.params.id);
//         updates.forEach((update) => user[update] = req.body[update])  
//         await  user.save();
//         // const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true})
//         if (!user) return res.status(404).send();
//         res.send(user);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every(item => allowedUpdates.includes(item));
    if (!isValidOperation) return res.status(400).send({error: 'Invalid updates'})

    try {
        updates.forEach((update) => req.user[update] = req.body[update])  
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
        // const user = await User.findOneAndDelete(req.user._id);
        // if (!user) return res.status(404).send();
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user);

    } catch (error) {
        res.status(500).send(error);      
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password) // Custom method
        if (!user) return res.status(404).send({error: 'user not found'})
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/logoutAll',auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(item => item.token !== req.token);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return callback(new Error('format must be jpg, jpeg, png'))
        callback(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // req.user.avatar = req.file.buffer;

    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    console.log('delete');
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/users/:id/avatar',     async (req, res) => {
    try {
        console.log('user   )')
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) return res.status(404).send();
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send(error);
    }
})
module.exports = router;
