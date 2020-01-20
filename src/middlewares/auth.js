const jwt = require('jsonwebtoken');
const User = require('./../models/user');

// ALLOW US TO CHECK THE AUTH TOKEN & USER 
// & RETURN USER AND TOKEN TO THE REST OF THE APP
const auth = async (req, res, next) => {
    try {
        console.log('auth');
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if (!user) throw new Error();
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({error: 'Unauthorized'})
    }
}

module.exports = auth;