const { Schema, model, Types } = require("mongoose");
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dataSchema = new Schema({
    name:{
        type: String,
        required: [true, 'user.name.required'],
        maxLength: [30 , 'user.name.lenght']
    },
    email:{
        type: String,
        required: [true, 'user.email.required'],
        unique: true,
        validate: [validator.isEmail, 'user.email.invalid']
    },
    password:{
        type: String,
        required: [true, 'user.password.required'],
        minLength: [6 , 'user.password.lenght'],
        select: false
    },
    role:{
        type: String,
        default: 'CHEM',
        enum: ['CHEM', 'Salud','IGM']
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    status:{
        type: String,
        default: 'Verify',
        enum: ['Verify', 'Available', 'Expired','Disabled']
    },
    verifyPin: {
        type:String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    deletedAt: Date
});

dataSchema.pre('save', async function(next){
    if(!this.isModified('password'))
        next()
    
    console.log('llega aqui')
    this.password = await bcrypt.hash(this.password, 10)
 });


//  compare password
dataSchema.methods.comparePassword = async function (enteredPassword){
   console.log(this.password)
    return await bcrypt.compare(enteredPassword,this.password)
};

//  return JWT
dataSchema.methods.getJwtToken = function (){
    return jwt.sign({
        id:this._id
    },process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESTIME
    });
};

module.exports =  model('User',dataSchema);