import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl:{
        type: String,
        required: true
    },
    shortUrl:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
},{timestamps:true});

urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Url = mongoose.model("Url", urlSchema);