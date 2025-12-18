const express = require('express');
const LoginRounter = express.Router();
const bodyParser = require('body-parser');//to post call
const jwt = require('jsonwebtoken');// to generate to token
const bcrypt = require('bcryptjs')// encrypt the password
const config = require('../config');
const AmazonUsers = require('../Model/userModel');
const userModel = require('../Model/userModel');

LoginRounter.use(bodyParser.urlencoded({ extended: true }));
LoginRounter.use(bodyParser.json());


LoginRounter.get('/', (req, res) => {
    res.send('Hii Login API');
})

//get all users
LoginRounter.get('/users', async (req, res) => {
    try {
        const data = await AmazonUsers.find({});

        res.send(data);
    } catch (error) {
        res.status(400).send(error.message);
    }

})

// user registration
LoginRounter.post("/register", async (req, res) => {

    try {
        
        const alrRegUser = AmazonUsers.find({email:req.body.email});

        if((await alrRegUser).length>0){
            res.send({auth:false,msg:"Email already exist"});
        }
        else{
            let hashpassword = bcrypt.hashSync(req.body.password, 8)//encrypt the password
            //create and insert into mongo with Schema's create method from mongoose we're going to send the mongoose
            await AmazonUsers.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashpassword,
                role: req.body.role ? req.body.role : 'user'
            })
    
            res.status(200).send({ success: true, msg: "Registration succesfull" });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
})

//user login
LoginRounter.post('/login', async(req, res) => {
    try {
        const user = await AmazonUsers.findOne({ email: req.body.email });
        if (!user) {
            return res.send({ auth: false, token: 'no user found' });
        }
        else {
            const passIsValid = bcrypt.compareSync(req.body.password, user.password);//decrypt password
            if (!passIsValid) {
                return res.send({ auth: false, token: 'Invalid password' })
            }
            //in case of both correct
            let token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 })// expire in 24 hours
            return res.status(200).send({ auth: true, token: token })
        }
    } catch (error) {
        return  res.status(200).send({ auth: false, token: "error while logging" });
    }
    // try {
    //     AmazonUsers.findOne({ email: req.body.email }, (err, user) => {
    //       if (err) {
    //         res.send({ auth: false, token: "Error while Logging" });
    //       } else if (!user) {
    //         res.send({ auth: false, token: 'No User Found' });
    //       } else {
    //         const passIsValid = bcrypt.compareSync(req.body.password, user.password);
    //         if (!passIsValid) {
    //           res.send({ auth: false, token: 'Invalid Password' });
    //         } else {
    //           let token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
    //           res.send({ auth: true, token: token });
    //         }
    //       }
    //     });
    //   } catch (error) {
    //     res.send({ auth: false, token: "Error while Logging" });
    //   }
})

//userinfo
LoginRounter.get('/userinfo',async (req,res)=>{
    try {
        let token = req.headers['x-access-token'];
        if (!token) {
          throw new Error('No Token Provided');
        }
    
        //jwt verify
        const user = jwt.verify(token, config.secret);
    
        const result = await userModel.findById(user.id);
        res.send(result);
      } catch (err) {
        res.send({ auth: false, error: err.message });
      }
})


module.exports = LoginRounter;