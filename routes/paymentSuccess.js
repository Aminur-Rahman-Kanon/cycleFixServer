const express = require('express');
const router = express.Router();
const bookingModel = require('../schema/schema').bookingModel;

//this route actually create a booking entries in the database when the payment success
router.post('/', async (req, res) => {
    const { userData } = req.body;

    //defining the total price
    const totalPrice = await userData.totalPrice / 100;
    userData.totalPrice = totalPrice;

    //making an entry in the database
    await bookingModel.create({
        ...userData
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }));
})

module.exports = router;
