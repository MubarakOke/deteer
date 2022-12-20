const app= require('./app');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path: './.env'})

if(process.env.NODE_ENV==='development'){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
}

let db

// Connect database
if (process.env.NODE_ENV==='development'){
    db= process.env.DATABASE
}
else{
    const {
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME,
      } = process.env
      db= `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
}

mongoose.connect(db,{})
    .then((con)=>{
        console.log("DB connection successful")
    })
    .catch((err)=>{
        console.log("DB connection unsuccessful")
    })


// Start Server
const server= app.listen(process.env.PORT, ()=>{
    console.log("App running on port ", process.env.PORT)
})


//Handle unhandles rejections
process.on('unhandledRejection', err=>{
    console.log('UNHANDLED! REJECTION! Shutting down')
    console.log(err.name, err.message)
    server.close(()=>{
        process.exit(1)
    })
})
