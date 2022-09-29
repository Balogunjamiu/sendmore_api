const mongoose = require('mongoose')
const validator = require('validator')
const bcrpyt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new  mongoose.Schema({
    fullname:{
        type: String,
        require: true,
        trim: true
    },
    password:{
        type : String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('password cannot be used as the password')
            }
        }

    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error ('Email is invalid')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true    
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}
userSchema.methods.geneterateAuthToken = async function (){
    const user = this 
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
    if (!user){
        throw new Error ('unable to login')         
    }
    const isMatch = await bcrpyt.compare(password, user.password)
    if (!isMatch){
        throw new Error ('unable to login')      
    }
    return user
}

// hash the plain text password before saving


userSchema.pre("save", async function(next){
    const user = this

    // console.log("just before saving")
    if (user.isModified('password')){
        user.password = await bcrpyt.hash(user.password,8)
    }
    next()
})

//Delete tasks immediately
userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})
const User = mongoose.model('User',userSchema)

module.exports = User