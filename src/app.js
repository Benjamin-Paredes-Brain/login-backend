import express from "express";
import handlebars from "express-handlebars"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose";
import { router as viewsRouter } from "./routes/views.router.js";
import { router as sessionRouter } from "./routes/session.router.js";
import passport from "passport";
import { initializedPassport } from "./config/passport.config.js";

const app = express()
app.listen(8080, () => console.log("Server is running in port 8080"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(process.cwd() + "/public"))

app.engine("handlebars", handlebars.engine({
  defaultLayout: 'main',
  extname: '.handlebars',
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
}))
app.set("views", process.cwd() + "/src/views")
app.set("view engine", "handlebars")

app.use(cookieParser())

mongoose.connect('mongodb+srv://Benjamin:1234@firstcluster.0frk82c.mongodb.net/login?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database: " + error);
    process.exit(1);
  });

app.use(session({
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://Benjamin:1234@firstcluster.0frk82c.mongodb.net/login?retryWrites=true&w=majority",
  }),
  secret: "secret-code",
  resave: false,
  saveUninitialized: false
}))

initializedPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/", viewsRouter)
app.use("/api/sessions", sessionRouter)

app.get("/", (req, res) => {
  res.send("Implementación de Login, vistas disponibles: /profile, /register, /login, /restartPassword")
})