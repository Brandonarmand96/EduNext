import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import express from "express";
import type { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors"
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoutes";
 
dotenv.config()


const app: Application = express();
const PORT = process.env.PORT || 5000;


//security middleware/headers + listen to file changes

app.use(helmet()) //set various http headers for app
app.use(express.json()) //parse JSON bodies
app.use(express.urlencoded({extended: true})) //parse url-encoded bodies 
app.use(cookieParser()) //parse cookies

//log http request to console 
if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

//CORS
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
}))

//health check route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({status:"OK", message: "Server is healthy"})
})

//import user routes
app.use("/api/users", userRoutes)

//global error handler middleware
app.use((
    err: Error, req: Request, res: Response, next: Function) => {
        console.error(err.stack)
        res.status(500).json({status: "Error", message: err.message})
    }
)

//connect to db

connectDB().then(() => {
    app.listen(PORT, () => {
        connectDB()
        console.log(`Server is running on port ${PORT}`)
    })

})
