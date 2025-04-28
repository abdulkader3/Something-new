import mongoose, { Schema } from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    subscriber: { // one who is subscribing
        type: Schema.Types.ObjectId,
        ref : "User"
    },
    channel: {  // one to whom "Subscriber" is subscribing
        type: Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps: true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);