const app = require('./app')
const port = process.env.PORT


app.listen(port, () =>{
    console.log('server is up on port ' + port)
})
// const main = async ()=>{
//     // const task = await Task.findById("60576f9ddb5cde3eb0d0db18")
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById('6058dbb237cd041b2883664b')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()