
import { createServer } from "http"
import express from 'express'
import cookieParser from "cookie-parser"
import cors from 'cors'
import corsConfig from "./utils/corsConfig"
import UserRouter from "./modules/user/user.routes"
import ChatRouter from "./modules/chat/chats.routes"
import MessageRouter from "./modules/message/message.routes"


const app = express()
const server = createServer(app)


app.use(cors(corsConfig))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/user', UserRouter)
app.use('/chat', ChatRouter)
app.use('/message', MessageRouter)

app.get("/", (req, res) => {
  res.send("NeoFuture API Running")
})



export default server