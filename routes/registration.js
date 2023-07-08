const express = require('express');
const router = express.Router();
const registrationModel = require('../schema/schema').registrationModel;
const bcrypt = require('bcrypt');

//this route will create a user in the registration collection
router.post('/', async (req, res) => {
    //destructuring user information from the body sent from the client
    const {firstName, lastName, email, user, password} = req.body;

    //checking if user exist in the collection or not. If exist then abort
    const existUser = await registrationModel.findOne({ email });
    if (existUser) return res.json({ status: 'user exist' });

    //creating a hash password
    const encryptPass = await bcrypt.hash(password, 10);

    //creating a document in the registrationModel collection
    await registrationModel.create({
        firstName, lastName, email, user, password: encryptPass
    }).then(result => res.json({ status: 'user created' })).catch(err => res.json({ status: 'failed' }))
})

module.exports = router;
