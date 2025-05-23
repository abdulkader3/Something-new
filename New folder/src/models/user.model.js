import mongoose, { Schema } from "mongoose";
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    email: {
        type: String,
    
        required: true
    },
    fullName: {
        type: String,
    
        required: true
    },
    password: {
        type: String,
      
    },
},{timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified('password')) return next();
    
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            fullName: this.fullName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken - function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)