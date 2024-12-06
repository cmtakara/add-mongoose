const express = require('express');
const router = express.Router();
const Fruit = require('../models/fruits');

// add a seed route temporarily
router.get('/seed', async (req, res) => {
    try {
        await Fruit.create([
            {
                name: 'grapefruit',
                color: 'pink',
                readyToEat: true
            },
            {
                name: 'grapes',
                color: 'purple',
                readyToEat: true
            },
            {
                name: 'apple',
                color: 'green',
                readyToEat: false
            },
            {
                name: 'fig',
                color: 'yellow',
                readyToEat: true
            },
            {
                name: 'grapes',
                color: 'green',
                readyToEat: false
            },
        ])

        res.status(200).redirect('/api/fruits');
    } catch (err) {
        res.status(400).send(err);
    }
 })

// INDEX
// this is called an index route, where you can see all of the data
// THIS is one version of READ
// READ many
// this is only practical when you have small amounts of data
// but you you can also use an index route and limit the number of responses
router.get('/', async (req, res) => {
    try {
        const foundFruits = await Fruit.find({});
        res.status(200).json(foundFruits);
    } catch (err) {
        res.status(400).send(err);
    }
})

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const deletedFruit = await Fruit.findByIdAndDelete(req.params.id);
        console.log(deletedFruit);
        res.status(200).redirect('/api/fruits');
    } catch (err) {
        res.status(400).send(err);
    }

    // this was all using arrays
    // if (req.params.id >= 0 && req.params.id < fruits.length) {
    //     fruits.splice(req.params.id, 1);
    //     res.json(fruits);
    // } else {
    //     res.send('<p>That is not a valid id</p>')
    // }
})

// UPDATE
// put replaces a resource
router.put('/:id', async (req, res) => {
        if (req.body.readyToEat === 'on') { // if checked, req.body.readyToEat is set to 'on'
            req.body.readyToEat = true;
        } else { // if not checked, req.body.readyToEat is undefined
            req.body.readyToEat = false;
        }

        try {
            const updatedFruit = await Fruit.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true },
            )
            console.log(updatedFruit);
            res.redirect(`/api/fruits/${req.params.id}`);
        } catch (err) {
            res.send(err).status(400);
        }
    // if (req.params.id >= 0 && req.params.id < fruits.length) {
    //     // put takes the request body and replaces the entire database entry with it
    //     // find the id and replace the entire thing with the req.body
    //     if (req.body.readyToEat === 'on') { // if checked, req.body.readyToEat is set to 'on'
    //         req.body.readyToEat = true;
    //     } else { // if not checked, req.body.readyToEat is undefined
    //         req.body.readyToEat = false;
    //     }
    //     fruits[req.params.id] = req.body;
    //     res.json(fruits[req.params.id]);
    // } else {
    //     res.send('<p>That is not a valid id</p>')
    // }

})

// CREATE
router.post('/', async (req, res) => {
    console.log(req.body)
    // you should check this when you first start, but then get rid of this console.log
    // console.log(req.body);
    // need to add logic to change the check or not checked to true or false
    if (req.body.readyToEat === 'on') { // if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { // if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
    // take this out because it worked with the array, and i want to access my database
    // fruits.push(req.body)
    try {
        const createdFruit = await Fruit.create(req.body);
        res.status(200).redirect('/api/fruits');
    } catch (err) {
        res.status(400).send(err);
    }
    // res.send('this was the post route');
    // res.json(fruits);
})

// SHOW
// another version of READ is called a show route
// in this one, we can see more information on an idividual piece of data
router.get('/:id', async (req, res) => {
    // in this case, my unique identifier is going to be the array index
    // res.send(`<div>${req.params.id}</div>`)
    // this id can be anything, so i probably want to do some checking
    // before accessing the array
    // if (req.params.id >= 0 && req.params.id < fruits.length) {
    //     res.json(fruits[req.params.id]);
    // } else {
    //     res.send('<p>That is not a valid id</p>')
    // }
    try {
        const foundFruit = await Fruit.findById(req.params.id);
        res.json(foundFruit).status(200);
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;