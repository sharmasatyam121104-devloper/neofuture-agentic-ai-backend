
import { createServer } from "http"
import express from 'express'
import cookieParser from "cookie-parser"
import cors from 'cors'
import corsConfig from "./utils/corsConfig"
import UserRouter from "./modules/user/user.routes"


const app = express()
const server = createServer(app)


app.use(cors(corsConfig))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/user', UserRouter)

app.get("/", (req, res) => {
  res.send("NeoFuture API Running")
})



export default server