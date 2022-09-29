const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true, 
    useFindAndModify:false
})


// const me = new User({
//     name:'    Balogun   ',
//     email: 'BALOGUNJAMIU49@GMAIL.COM  ',
//     password: 'balogunjamiu'
// })

// me.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log("Error",error)
// })
// const task = new tasks({
//     description:"reading",
    
// })

// task.save().then((result) =>{
//     console.log(result)
// }).catch((error) =>{
//     console.log("Error", error)
// })

