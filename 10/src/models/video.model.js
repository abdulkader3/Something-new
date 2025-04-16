import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String
    }, category: {
        type: String
    }, duration: {
        type: String
    }, thumbnail: {
        type: String
    }, owner: {
        type: String
    },
},{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate);
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
