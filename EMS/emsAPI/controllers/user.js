const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const model = require('../models/users');
const constants = require("../../constants");

exports.testReturn = (req, res, next) => {
  res.status(200).json("Going Good!");
};
exports.testReturn2 = (req, res, next) => {
    res.status(200).json(`Going Good! ${req.body.keys}`);
  };
exports.signup = (req, res, next) => {
  var raw_password = req.body.password;
  //console.log(`mongoose in SignUp ${mongoose.connection.readyState==2?'DBConnected':'Not Connected'}`);
  bcrypt.hash(raw_password, constants.bycrpt_Salt, (err, encryptedPassword) => {
    if (!err) {
        
        // new user object created
        var newUser= new model({
            _id: new mongoose.Types.ObjectId(),
            userName: req.body.userName,
            email: req.body.email,
            password: encryptedPassword
        });

newUser.save()
.then(result => {

    res.status(201).json({message: 'Created UserSuccessfully', status:true, result: `${result}`});
    console.log(`created user success fully ${result}`);
})
.catch(error =>{
    res.status(500).json({ message: `error occured ${err}`, status: false });
});

    }
    else {
        res.status(500).json({ Err: err, message: 'Some Internal Convertion Issues.' });
    }
  })
};
exports.signup2 = (req, res, next) => {

    var rawpasswrod = req.body.password;
    bcrypt.hash(rawpasswrod, 10, (err, hashdata) => {
        if (!err) {
            const user = new model({
                _id: new mongoose.Types.ObjectId(),
                userName: req.body.userName,
                email: req.body.email,
                password: hashdata
            });
            var findquery = { $or: [{ email: req.body.email }] }
            model.find(findquery)
                .exec()
                .then(result => {
                    if (result == null || result.length <= 0) {
                        user.save()
                            .then(result => {
                                res.status(201).json({ message: 'create user', status: true });
                                console.log(` Create User ${result}`);
                            })
                            .catch(err => {
                                res.status(500).json({ message: `error occured ${err}`, status: false });
                            })
                    }
                    else { //409 conflict //422 cannt process it
                        res.status(409).json({ message: 'Sorry  Email already Exits! ', status: false });
                    }
                })
                .catch(err => {
                    res.status(500).json({ message: `error occured ${err}`, status: false });
                });
        }
        else {
            res.status(500).json({ Err: err, message: 'Some Internal Convertion Issues.' });
        }
    })


}
