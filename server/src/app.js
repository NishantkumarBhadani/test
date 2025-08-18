import express from "express";
import cors from "cors";

const app=express();

//configuring cors
app.use(cors({
    origin:"*",
    credentials:true
}))

//middlewares
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public")) 

import urlRouter from "./routes/url.routes.js"
app.use("/api/v1/url", urlRouter);

export {app};