import mongoose, { Schema }  from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from 'bcrypt';


const userSchema = new Schema({

    userName : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName : {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required:true
    },
    coverImage: {
        type: String
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "video"
    },
    password: {
        type: String,
        required: [true, 'Password is required']

    },
    refreshToken: {
        type: String
    }


    // ,
    // Id: {
    //     type: String pk?
    // }


},{timestamps: true})


userSchema.pre("save", async function (next) {

    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrectj = async function (password) {

    return await bcrypt.compare(password , this.password)
    
}

userSchema.method.generateAccessToken =  function(){
    return Jwt.sing(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expireIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.method.generateRefreshToken =  function(){
    return Jwt.sing(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expireIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)