require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

// mongodb
require("./db/conn");
const Register = require("./models/registers");

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(static_path));

// using hbs engine
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

app.get("/api", (req, res) => {
  res.json({ "users" : ["userOne", "userTwo", "userThree"] })
}); 

// home page
app.get("/", (req, res) => {
  res.render("index");
});

// secret page
app.get("/secret", (req, res) => {
  console.log(`This is the cookie ${req.cookies.jwt}`);
  res.render("secret");
});

// register page
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const registeruser_detailSchema = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        mobile: req.body.mobile,
        password: password,
        confirmpassword: req.body.confirmpassword,
      });

      console.log("The success part: " + registeruser_detailSchema);

      // password hash
      const registered = await registeruser_detailSchema.save();
      console.log("User registered successfully:", registered);
      res.status(201).render("index");
    } else {
      res.send("Passwords do not match");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// login page
app.get("/login", (req, res) => {
  res.render("login");
});

// login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Register.findOne({ email: email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid Credentials");
    }

    res.status(201).render("index");
  } catch (error) {
    res.status(400).send("Invalid Credentials");
  }
});

// server port
app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});
