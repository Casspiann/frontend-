const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const { json } = require('body-parser');



const authenticate = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token,'secretkey');
        console.log("user>>>>>>",user.userId);
        User.findByPk(user.userId).then(user=>{
           // console.log(user);
            req.user = user;
            next()
            
        }).catch(err =>{ throw new Error(err)} )


    }
    catch(error){
        console.log(error);

    }
}

module.exports = {
    authenticate
}