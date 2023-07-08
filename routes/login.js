const express = require('express');
const router = express.Router();
const registrationModel = require('../schema/schema').registrationModel;
const bcrypt = require('bcrypt');

//this route check for user email in the collection
//and return to the client to complete the login process
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    //checking for user email in the collection
    const checkForUser = await registrationModel.findOne({ email });

    if (checkForUser !== null) {
        //if user found then check for the password to match
        const passwordCheck = await bcrypt.compare(password, checkForUser.password);
        
        //if password matches then return the user information
        if (passwordCheck) {
            return res.json({ status: 'success', data: checkForUser });
        }
        //otherwise saying that password incorrect
        else {
            return res.json({ status: 'bad password' });
        }
    }
    //if user not found then abort
    else {
        return res.json({ status: 'user not found' })
    }
})

module.exports = router;
