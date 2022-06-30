const jwt = require("../node_modules/jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("../node_modules/bcryptjs");
require("../db/conn");
const User = require("../models/UserSchema");
const Authenticate = require("../Middleware/Authenticate");

// router.get("/", (req, res) => {
//   res.send("its a home page");
// });

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
      res.status(421).json({ message: "please enter all fields" });
    }

    const UserExist = await User.findOne({ email });
    // console.log(UserExist);
    if (UserExist) {
      res.status(422).json({ message: "User already exist" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      const UserSaved = await user.save();
      // console.log(req.body);

      if (UserSaved) {
        res.status(201).json({ message: "User created successfuslly 😁" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(422).json({ message: "please enter all fields" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      const isMatch = await bcrypt.compare(password, userExist.password);

      // req.cookiess
      // console.log(cook);ss
      if (isMatch) {
        token = await userExist.generateAuthToken();
        // console.log("token is : ", token);
        const cook = res.cookie("jwt_token", token, {
          expires: new Date(Date.now() + 2592000000),
          httpOnly: true,
        });
        // console.log(cook)
        res.status(200).json({ message: "login successfully 😁" });
      } else {
        res.status(422).send("incorrect password");
      }
    } else {
      res.status(422).send("user not found");
      console.log("user not found");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", Authenticate, (req, res) => {
  // console.log("its About page Authenticating with JWT");
  // console.log("below is ROOTUSER");
  console.log("its about page");
  res.send(req.rootUser);
  // console.log("its console rootUser from About page :  ", req.rootUsssser);
});

router.get("/getContactData", Authenticate, (req, res) => {
  console.log("get contact data");
  res.send(req.rootUser);
  // console.log("its console rootUser from About page :  ", req.rootUsssser);
});



router.post("/contact", Authenticate, async (req, res) => {
  try {


    const {name, email, message} = req.body

    if(!name || !email || !message){
      console.log("please fill all contact details")
    return  res.status(421).json({error : "please fill all contact details"})
    }

      const contactData = await User.findOne({_id:req.UserId })
    

      if(contactData){
            const userData = await contactData.sendMessage(name, email, message);
            const userDataSaved = await contactData.save();

            if(userDataSaved){
              console.log("contact data send succussfully")
            res.status(200).json({message : "contact data send succussfully"})
            }
            else{
              res.status(400).json({error : "error in sending contact data"})
            }
      }
      else{
        res.status(400).json({error : "User not found"})
      }
    
  } catch (error) {
    console.log("sending contact data error is : ", error);
  }
});



router.get('/logout', (req, res)=> {
  res.clearCookie('jwt_token', {path: '/'});
  res.status(200).send({message : "logout successfully"})
})

module.exports = router;
