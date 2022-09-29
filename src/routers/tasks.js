const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require("../middleware/auth")


router.post('/tasks', auth , async (req,res) =>{
        const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
      await task.save()
      res.status(201).send(task) 
    }catch(e){
        res.status(400).send(e)
    }
})//GET / tasks?completed = false
// GET/ tasks?limit=10&skip=0
// GET/tasks?sortBy=createdAt_desc
router.get('/tasks', auth ,  async (req,res)=>{
    const match = {}
    const sort ={}
    if(req.query.completed){
        match.completed = req.query.completed ==='true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1: 1
    }
    try{
         //tasks = await Task.find({ owner:req.user.id})
         //res.send(tasks)
         await req.user.populate({
             path:'tasks',
             match,
             options:{
                 limit:parseInt(req.query.limit),
                 skip:parseInt(req.query.skip),
                 sort
             }
         }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})
router.get('/tasks/:id',auth,  async (req,res) =>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})
router.patch('/tasks/:id',auth,  async (req, res)=>{
    const update = Object.keys(req.body)
    const allowToUpdate = ['descriptioin', 'completed']
    const validate = update.every((updates)=> allowToUpdate.includes(updates))
    if(!validate){
        return  res.status(400).send({"Error":'invalid updates'})
    }
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        //const task = await Task.findById(req.params.id)
        //task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
        if (!task){
            return res.status(404).send()
        }
        update.forEach((updates)=> task[updates] = req.body[updates])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
 router.delete('/tasks/:id',auth, async (req, res)=>{
        try{
            task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
            if(!task){
                return res.status(404).send()
            }
            res.send(task)
        }catch(e){
            res.status(500).send()
        }
 })
 

 module.exports = router