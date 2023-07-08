const express = require('express');
const router = express.Router({ mergeParams: true });
const registrationModel = require('../schema/schema').registrationModel;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    //destructuring the id and token from params
    const { id, token } = req.params;
    const { password } = req.body;
    
    //verifying the user email. If invalid then return with a status of "not found"
    const userCheck = await registrationModel.findOne({ _id: id });
    if (!userCheck) return res.json({ status: 'not found' });

    try {
        //validating the jwt token. If valid then create a hashed password and update it
        //then feed a success page where user will be notified about the update
        jwt.verify(token, process.env.JWT_SECRET);
        const encryptedPassword = await bcrypt.hash(password, 10);
        await registrationModel.updateOne({
            _id: id
        },
        {
            $set: {
                password: encryptedPassword
            }
        })
        res.render("success");
        
    } catch (error) {
        //if jwt is not varified then return a status of "somethiing went wrong"
        res.json({ status: 'something went wrong' })
    }
})

module.exports = router;
