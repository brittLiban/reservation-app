const express = require('express');
const PORT = 3000;
const app = express();


//mariaDB
const mariadb = require('mariadb')
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Black202',
    database: 'reservation'
});

// await makes the function still run while waiting for the host and sercer to run
// always need to use async to make things happen with await
async function connect() {
    try{
    let conn = await pool.getConnection();
    console.log('Connected to the database');
    return conn;
    }
    catch (err) {
        console.log('Error connecting to the database: ' + err)
    }
}
// use this to translate the information into something likeable? 
app.use(express.urlencoded({ extended: false}));

//telling the app where our css and stuff b!
// it is saying all of the static stuff is going to be in public
app.use(express.static('public'));

let confirmations = [];

// you want to do this before you get to your routes BUT after you create the app
// to run the ejs engine, it renders ejs
app.set('view engine', 'ejs');

// most of the time to visit a page it will be a get method! 
// this is defining the default route
app.get('/', (req, res) => {
    console.log("Hello, world - server");

    //sends the home 
    res.render('home');
});

// You can only access this page if you post? What does that mean? 
// post is to send info to the server
// add async 
app.post('/confirm', async (req, res) => {
    //console.log(req);
    console.log(req.body);
    // Down is EJS era
    // res.send(req.body);
    // res.sendFile(__dirname + '/confirm.html');
    // this line grabs everything from the request body
    // let details = req.body;

    // adding details to the array 
    // confirmations.push(details);


    // console.log(confirmations);
    // this below sends back everything  
    // naming the variable as array AND THEN saying its equal to the array WHICH MEANS that details is equal req.body

    const data = {
        firstName: req.body.fname,
        lastName: req.body.lname, 
    }

    const conn = await connect(); 

     conn.query(`
        INSERT INTO users (firstName, lastName)
        VALUES ('${data.firstName}', '${data.lastName}');
    `);
    
    res.render('confirm' , { details: data });
})
// when it doubt add a slash 
app.get('/confirmations', async (req, res) => {
    // how to send the array back to front end

    // need to get it to send to confirmations 
    // not seeing it


    const conn = await connect();

    const rows = await conn.query(`SELECT * FROM users`);

    res.render('confirmations', {data: rows});
}
)
// want the app weve defined above with the routes to be listening to all the routes
// on the port we passed in. How old are you? 300!
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})
