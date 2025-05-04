import mongoose, { Schema } from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    subscriber : { // who is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel : { // whom to 'subscriber' is subscribing to
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true});


export const Subscription = mongoose.model("Subscription",subscriptionSchema);