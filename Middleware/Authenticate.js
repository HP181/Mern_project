const jwt = require("../node_modules/jsonwebtoken")
const User = require("../models/UserSchema")


const Authenticate = async (req,res, next) => {
    try {
        // const token = req.cookies.jwt_token;
      const token = req.cookies.jwt_token;
        // console.log("Authenticate token : ", token)
        const verifyToken =  jwt.verify(token, process.env.SECRET_KEY);
        // console.log('Verified token : ', verifyToken);

        const rootUser = await User.findOne({_id: verifyToken._id, "tokens.token": token});
    
        if(!rootUser){
            throw new Error('User not found')
       
        }
            else if(rootUser){
                console.log(" User verified Successfully")}
        

        req.token = token;
        req.rootUser = rootUser;
        req.UserId = rootUser._id
        next();


    } catch (error) {
        console.log(error);
        res.status(401).send({Error : "Unauthorized - No token provided"})
    }
} 

module.exports = Authenticate;