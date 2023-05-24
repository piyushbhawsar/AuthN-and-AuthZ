require("dotenv").config()
const { default: mongoose } = require("mongoose");

exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true ,
    })
        .then(console.log('DB Connection Successfull'))
        .catch(e => {
            console.log('Failed DB Connection')
            console.error(e.message)
            process.exit(1)
        })
}