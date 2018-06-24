const express = require('express');
const fs = require('fs');
let app = express();

let passport = require('passport')
let database = require('./db/database')

app.use(require('cors')({
    origin: 'http://localhost:1024'
}))
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ 
  secret: 'keyboard cat', 
  resave: true, 
  saveUninitialized: true 
}));
//app.use("/", require("./routes/router")(database))
app.use("/authenticate", require("./authenticate/authenticator")(database))

app.listen(3000)