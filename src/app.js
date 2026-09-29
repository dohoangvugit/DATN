require('dotenv').config()

const cookieParser = require('cookie-parser')

const express = require('express')

const session = require('express-session')

const app = express()

const port = process.env.PORT || 3000

const { engine } = require('express-handlebars')

const path = require('path')

const route = require('./routes/index')

app.use(session({

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: { secure: false }

}))

app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))

app.use(express.json());

app.engine(

    '.hbs',

    engine({

        extname: '.hbs',
        defaultLayout: false,
        helpers: {

            json: (x) => JSON.stringify(x),

            eq: (a, b) => a === b,

            formatPrice: (v) => v.toLocaleString(),

            multiply: (a,b) => a*b,

        },

    }),

)

app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, 'views'))

route(app)

app.listen(port, () => {

    console.log(`Example app listening on port http://localhost:${port}`)

})