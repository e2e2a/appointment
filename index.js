const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
var path = require('path');
const dbConnect = require('./database/dbConnect');
const { request } = require('http');
const flash = require('express-flash');

const app = express();
const conn = dbConnect();

app.use(session({secret:'sessionsecret777'}));
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));
//flash
app.use(flash());
app.use(function(req,res,next) {
    req.db = conn;
    next();
});

require('./routes/web')(app);

app.listen(8080,()=>{
    console.log("Server is running at port 8080");
});