import express from "express";
import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import restaurant from "./services/restaurant.js";
import pgPromise from 'pg-promise';

const app = express()

const DATABASE_URL = 'postgresql://postgres:Delegates13@localhost:5432/restuarantdb';

const connectionString = process.env.DATABASE_URL || DATABASE_URL;
const db = pgPromise()(connectionString);

let restuarantService = restaurant(db);

app.use(express.static('public'));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.get("/", async (req, res) => {
    let tables = await restuarantService.getTables();
    // console.log(tables);

    // res.render('index', { tables : [{}, {}, {booked : true}, {}, {}, {}]})
    res.render('index', { tables });
});

app.post('/book', async (req, res) => {

    //book table using the values that come from the form
    await restuarantService.bookTable({
        tableName: req.body.tableId,
        username: req.body.username,
        phoneNumber: req.body.phone_number,
        seats: req.body.booking_size
    });

    res.redirect('/')
})

app.get("/bookings", async (req, res) => {
    let tables = await restuarantService.getBookedTables();

    res.render('bookings', { tables })
});

var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});