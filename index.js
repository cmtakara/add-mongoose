// first bring in express, which we already installed
// you can see it in your package.json
const express = require('express');
// create your application
const app = express();
// set port
const dotenv = require('dotenv');
dotenv.config();

// import the fruit routes that I need
const fruitRoutes = require('./routes/fruits');

// import db/conn.js works with .mjs files, but we are using .js
const db = require('./db/conn');
// Import the body-parser package
// This package contains middleware that can handle 
// the parsing of many different types of data,
// making it easier to work with data in routes that 
// accept data from the client (POST, PATCH)
const bodyParser = require('body-parser');
// in order to use the jsx view engine, i need to bring it in
const jsxViewEngine = require('jsx-view-engine');
// method-override is used to be able to do more than GET and POST
const methodOverride = require('method-override');
// you have to have a port defined so that the application has somewhere to listen
const PORT = process.env.PORT || 5050;

// import the data from the fake database files
const Fruit = require('./models/fruits');

// set up the view engine to be able to use it
app.set('view engine', 'jsx');
app.set('views', './views');
app.engine('jsx', jsxViewEngine());

// ========== MIDDLEWARE ==========
// this is imported middleware, meaning that we are using code that someone else wrote
// we use the body-parser middleware first so that 
// we have access to the parsed data within our routes.
// the parsed data will be located in req.body
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json({ extended: true}));

app.use(methodOverride('_method'));

app.use(express.static('public'));

// below is custom middleware, meaning that we wrote the code that we wanted to be executed
app.use((req, res, next) => {
    console.log('Middleware: I run for all routes');
    next();
})

app.use((req, res, next) => {
    const time = new Date();
    console.log(
        `-----
        ${time.toLocaleDateString()}: Received a ${req.method} request to ${req.url}.`
    );

    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Containing the data:');
        console.log(`${JSON.stringify(req.body)}`);
    }
    next();
})

// ========== ROUTES ==========

// We are going to create a full CRUD application
// Server-side rendering, you also need the views for someone to input to put or post
// INDUCES
// I - Index    - GET       - READ - display all of the elements
// N - New      - GET       - *  CREATE * but this is a view that allows user inputs
// D - Delete   - DELETE    - DELETE
// U - Update   - PUT       - UPDATE * this updates the data
// C - Create   - POST      - CREATE * this adds new data 
// E - Edit     - GET       - *  UPDATE * but this a view that allows user inputs
// S - Show     - GET       - READ - displays one of the elements

// add in the fruit routes that were imported
app.use('/api/fruits', fruitRoutes);

// create routes to represent the different requests
// define the route
// define the method
// start with the get request
// general format of the request
// app.get(route, function)
// the route is what the client or user types in for the request
// the function is how we respond
app.get('/', (req, res) => {
    res.send(
        '<div>this is my home</div>'
    );
})

app.get('/index', (req, res) => {
    res.send(
        '<h1>This is an index</h1>'
    )
})

app.get('/fruits', async (req, res) => {
    try {
        const foundFruits = await Fruit.find({});
        res.status(200).render('fruits/Index', { fruits: foundFruits })
    } catch (err) {
        res.send(err).status(400);
    }
})

// ***** ABOVE HERE are NON-API routes

// ***** BELOW is what you would typically see in an API with a clear split 
// *****        between frontend and backend

// N - NEW - allows a user to input a new fruit
app.get('/fruits/new', (req, res) => {
    // the 'fruits/New' in the render needs to be pointing to something in my views folder
    res.render('fruits/New');
})

// E - Edit
app.get('/fruits/:id/edit', async (req, res) => {
    try {
        const foundFruit = await Fruit.findById(req.params.id);
        res.render('fruits/Edit', { fruit: foundFruit, id: req.params.id});
    } catch (err) {
        res.status(400).send(err);
    }
})

// Custom 404 (not found) middleware
// since we place this last, it will only process 
// if no other routes have already sent a response
// We also don't need a next in this VERY SPECIAL instance
// because it is the last stop along the request-response cycle
app.use((req, res) => {
    console.log('I am only in this middleware if no other routes have sent a response.')
    res.status(404);
    res.json({ error: 'Resource not found'});
})


// have your application start and listen for requests
// this is a server, so will be listening for requests and responding
app.listen(PORT, () => {
    console.log('listening');
})