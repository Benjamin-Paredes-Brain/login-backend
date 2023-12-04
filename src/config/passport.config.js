import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from "passport-github2"
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

export const initializedPassport = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const user = await userModel.findOne({ email: username });
                if (user) {
                    console.log("user already exists")
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userModel.create(newUser);
                return done(null, result)
            } catch (error) {
                return done('User Not fount' + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {

            try {
                const user = await userModel.findOne({ email: email });
                console.log(' User login ' + user)
                if (!user) {
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    return done(null, false)
                }

                return done(null, user)
            } catch (error) {
                return done(null, false)
            }
        }
    ))

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.e31b3cd0b703a785",
        clientSecret: "58ded98950a6bfebdaba387ddfb2621920c40ae5",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    name: profile._json.name,
                    last_name: "",
                    age: 18,
                    email: profile._json.email,
                    password: ""
                }
                let result = await userModel.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (err) {
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })
}