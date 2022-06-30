const mongoose = require('mongoose')
const db = process.env.database

mongoose.connect(db).then(()=>console.log("connected")).catch(error=>console.log(error))