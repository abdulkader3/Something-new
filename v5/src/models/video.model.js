import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: [true, 'There is no fun without nay thumbnail']
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, "Its very important to give your video a title"]
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean
    }
},{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video" , videoSchema)