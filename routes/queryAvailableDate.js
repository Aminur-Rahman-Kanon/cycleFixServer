const express = require('express');
const router = express.Router();
const bookingModel = require('../schema/schema').bookingModel;

//this route query all the booking from the database and send it to the client
router.get('/', async (req, res) => {
    await bookingModel.find({}, {date: 1, _id: 0}).then(async response => {
        const dates = response.map(date => date.date);
        res.json({ status: 'success', data: dates})
    }).catch(err => res.json({ status: 'failed' }));
})

module.exports = router;
