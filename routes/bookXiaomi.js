const express = require('express');
const router = express.Router();
const xiaomiModel = require('../schema/schema').xiaomiModel;


//this route create a xiaomi booking in the database
router.post('/', async (req, res) => {
    const { service, price, date, name, email, phone } = req.body;

    try {
        await xiaomiModel.create({
            service, price, date, name, email, phone
        }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
    } catch (error) {
        res.json({ status: 'error' })
    }
})

module.exports = router;
