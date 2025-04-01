import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    VideoFile: {
        type: String
    },
    thumbnail: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)