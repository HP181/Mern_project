const express = require('express')
const app = express();
const dotenv = require('dotenv')
dotenv.config({path:"./config.env"})
require("./db/conn")
const cors = require('cors')
const cookieParser = require('./node_modules/cookie-parser')
const path = require('path')

app.use(cookieParser())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
app.use(express.json());
app.use(require('./routes/auth'))

app.use(express.static(path.join(__dirname, './static')));

app.get('/',  (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
});


app.listen(process.env.PORT, ()=>{
    console.log(`server started on ${process.env.PORT}`);
})
