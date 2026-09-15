require('dotenv').config()

const express = require('express')
const session = require('express-session')
const app = express()
const port = process.env.PORT || 3000
const { engine } = require('express-handlebars')
const path = require('path')


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// app.use(session({
//     secret: process.env.SESSION_SECRET || 'fallback_secret_key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         path: '/',
//         httpOnly: true,
//         secure: false,
//         maxAge: 1000 * 60  * 3,
//     }
// }))

app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        layoutsDir: path.join(__dirname, 'views/layouts'),
        partialsDir: path.join(__dirname, 'views/partials'),
        defaultLayout: 'main',

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
