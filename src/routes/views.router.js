import { Router } from "express"

export const router = Router()

router.get("/register", (req, res) => {
    res.render("register", {
        style: "index.css",
        user: req.session.user
    })
})

router.get("/login", (req, res) => {
    res.render("login", {
        style: "index.css",
        user: req.session.user
    })
})

router.get("/profile", (req, res) => {
    res.render("profile", {
        style: "index.css",
        user: req.session.user
    })
})

router.get('/restartPassword', (req, res) => {
    res.render('restartPassword', {
        style: "index.css",
        user: req.session.user
    })
})
