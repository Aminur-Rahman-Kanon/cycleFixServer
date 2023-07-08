const express = require('express');
const router = express.Router();
const contactQueryModel = require('../schema/schema').contactQueryModel;

//this route will create a contact query in the contact collection
router.post('/', async (req, res) => {
    const { name, phone, email, message } = req.body;

    await contactQueryModel.create({
        name, phone, email, message
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }));
})

module.exports = router;
