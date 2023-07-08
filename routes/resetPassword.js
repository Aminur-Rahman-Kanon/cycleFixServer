const express = require('express');
const router = express.Router({ mergeParams: true });
const registrationModel = require('../schema/schema').registrationModel;
const jwt = require('jsonwebtoken');

//this route checking if the requested email and jwt are valid.
//If both are valid then it will feed the index page where user may reset their password
router.get('/', async (req, res) => {
    //destructuring the id and token from params
    const { id, token } = req.params;
    
    //verifying the user email. If not exist then return a status of "not found"
    const userCheck = await registrationModel.findOne({ _id: id });
    if (!userCheck) return res.json({ status: 'not found' });

    try {
        //verifying the jwt token. If verified then feed the index page
        jwt.verify(token, process.env.JWT_SECRET);
        res.render('index', { email: userCheck.email })
    } catch (error) {
        //otherwise will send this message
        res.send("Link expired. Please try again")
    }
})

module.exports = router;
