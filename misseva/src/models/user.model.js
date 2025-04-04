import mongoose, { Schema } from "mongoose";
import jsonwabtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        lowercase: true,
        time: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        time: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        time: true,
        index: true
    },
    avatar: {
        type: String, //url from cloudniry 
        required: true
    },
    coverImage: {
        type: String,

    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: [true, "password id required"],
    },
    refreshToken: {
        type: String,
    }

},{timestamps: true})

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password , 10)
})

userSchema.method.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET ,
        {
            expireIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.method.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET ,
        {
            expireIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema)