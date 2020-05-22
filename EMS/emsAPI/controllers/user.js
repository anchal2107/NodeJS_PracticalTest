const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const model = require("../models/users");
const constants = require("../../constants");
const jwt = require("jsonwebtoken");
var otpGenerator = require("otp-generator");
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

      var findquery = { $or: [{ email: req.body.email }] };
      model
        .find(findquery)
        .exec()
        .then((result) => {
          if (result == null || result.length <= 0) {
            var newUser = new model({
              //_id: new mongoose.Types.ObjectId(),
              userName: req.body.userName,
              email: req.body.email,
              password: encryptedPassword,
            });
            newUser.save((err, result) => {
              if (!err) {
                res.status(200).json({ status: true, result: result });
              } else {
                res.status(500).json({ message: err });
              }
            });
          } else {
            //409 conflict //422 cannt process it
           

            res
              .status(409)
              .json({ message: "Sorry  Email already Exits! ", status: false });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: `Error while Find Query : error occured ${err}`,
            status: false,
          });
        });
    } else {
      res
        .status(500)
        .json({ Err: err, message: "Some Internal Convertion Issues. in bcrypt hash function" });
    }
  });
};

exports.signin = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var findquery = { $or: [{ email: email }] };
  model
    .findOne(findquery)
    .exec()
    .then((user) => {
      if (user != null) {
        console.log(` fount user ${user}`);
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            res.status(401).json({ message: `Failed ${err}`, status: false });
            // console.log(` fount err ${err}`);
          } else {
            if (result) {
              //payload islike
              // data is there in token like username email or id
              // and it have options are there with have like validation of expiry
              var signedobject = {
                email: user.email,
                username: user.userName,
                userid: user._id,
              };
              var jwtoption = { expiresIn: "1h" };
              //     //this syn funtion
              //    const token= jwt.sign(signedobject,process.env.JWT_PrivateKey,jwtoption)
              // res.status(200).json({ message: "Auth SuccessFull", status: true,token:token });
              // for asyn one write below one
              console.log(` privatekey ${constants.jwt_PrivateKey}`);
              jwt.sign(
                signedobject,
                constants.jwt_PrivateKey,
                jwtoption,
                (err, token) => {
                  if (!err) {
                    res.status(200).json({
                      message: "Auth SuccessFull",
                      status: true,
                      token: token,
                    });
                  } else {
                    res.status(500).json({
                      message: `FROM JWT error occured ${err}`,
                      status: false,
                    });
                  }
                }
              );

              //  console.log(` fount re ${result}`);
            } else {
              res.status(401).json({ message: "Auth failed", status: false });
              // console.log(` fount re ${result}`);
            }
          }
        });
      } else {
        //401 unauthorized
        res
          .status(401)
          .json({ message: "Mail/User not Found  ", status: false });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: `error occured ${err}`, status: false });
    });
};

exports.get_all = (req, res, next) => {
  model.find({}, function (err, doc) {
    if (!err) {
      if (doc != null && doc.length > 0) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No Data Found!" });
      }
    } else {
      res.status(500).json({ message: err });
    }
  });
};

exports.create = (req, res, next) => {
  bcrpty.hash(req.body.password, 10, (err, hashdata) => {
    if (!err) {
      const user = new model({
       // _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        userName: req.body.userName,
        password: hashdata,
      });
      user.save((err, result) => {
        if (!err) {
          res.status(200).json({ status: true, result: result });
        } else {
          res.status(500).json({ message: err });
        }
      });
    } else {
      res
        .status(500)
        .json({ Err: err, message: "Some Internal Convertion Issues." });
    }
  });
};

exports.get_by_id = (req, res, next) => {
  const id = req.params.id;
  model.find({ _id: id }, function (err, doc) {
    if (!err) {
      if (doc != null && doc.length > 0) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No Data Found!" });
      }
    } else {
      res.status(500).json({ message: err });
    }
  });
};

exports.update_by_id = (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.key] = ops.value;
  }

  //[{ "key":"password","value":"321" },
  //{"key":"userName","value":"anchal jain"}]
  //              or
  //[{ "key":"password","value":"321" }]
  // this is how to pass data in post man
  // for multiple  just add more key value pair and only those will be updated
  // const courseobj ={
  //     courseName: req.body.courseName,
  //     price: req.body.price
  // }
  //var UpdateQuery ={$set:{courseName:courseobj.courseName , price:courseobj.price}};
  //for password i need to check here that if password come here for update i need to bycrypt that
  var filterQuery = { _id: id };
  var UpdateQuery = { $set: updateOps };
  model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
    if (!err) {
      res.status(200).json({ message: `updated id: ${id} SuccessFully` });
    } else {
      res.status(500).json({ message: err });
    }
  });
};

exports.delete_by_id = (req, res, next) => {
  const id = req.params.id;
  model.deleteOne({ _id: id }, function (err, doc) {
    if (!err) {
      res.status(200).json({ message: `Deleted id: ${id} SuccessFully` });
    } else {
      res.status(500).json({ message: err });
    }
  });
};

exports.updatePassword = (req, res, next) => {
  //update password with otp for a particulat email .
  //after this otp will be none and isresetapplied will be false again.

  var otp = req.body.otp;
  var email = req.body.email;
  var raw_password = req.body.password;
//can keep a type of validation like otp and email and password must not be blank.
// also can show password to update once enters write otp and email and we can fetch that and can see if it matched 
// in frontend can start a timer for that same.


  bcrypt.hash(raw_password, constants.bycrpt_Salt, (err, encryptedPassword) => {
    if (!err) {
  var paramfilterquery ={ $and: [{ email: email },{$and: [{otpForResetPassword: otp},{isResetPasswordApplied:true}]}] }; { email: email };
  var updateDictionaryList = [
    { key: "password", value: encryptedPassword },
    { key: "isResetPasswordApplied", value: false },
    { key: "otpForResetPassword", value: '' },
  ];
  const updateOps = {};
  for (const ops of updateDictionaryList) {
    updateOps[ops.key] = ops.value;
  }
  var filterQuery = paramfilterquery;
  var UpdateQuery = { $set: updateOps };
  model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
    if (!err) {
      res.status(200).json({ message: `updated SuccessFully ${doc}`, status: true, otp:otp });
    } else {
      res.status(500).json({ message: err });
     // return { message: `error occoured ${err}`, status: false };
    }

});
} else {
  res
    .status(500)
    .json({ Err: err, message: "Some Internal Convertion Issues. in bcrypt hash function" });
}
});

  }

exports.changePassword = (req, res, next) => {
  //when is user is login that time he can change his password with
  // old password and new password okay
//only a login person can do this so i can take use of jwt here and ask for id and old password and then update a password .
//i can keep update with id but for easy for now keeping it email
//copy pasting id again and again will be tedious but id is good to keep here. 
//const id = req.params.id;
const email = req.params.email;
var raw_password = req.body.password;
//can keep a type of validation like otp and email and password must not be blank.
// also can show password to update once enters write otp and email and we can fetch that and can see if it matched 
// in frontend can start a timer for that same.


bcrypt.hash(raw_password, constants.bycrpt_Salt, (err, encryptedPassword) => {
  if (!err) {
//var paramfilterquery = { _id: id };
var paramfilterquery = { email: email };
var updateDictionaryList = [
  { key: "password", value: encryptedPassword }
];
const updateOps = {};
for (const ops of updateDictionaryList) {
  updateOps[ops.key] = ops.value;
}
var filterQuery = paramfilterquery;
var UpdateQuery = { $set: updateOps };
model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
  if (!err) {
    res.status(200).json({ message: `updated SuccessFully ${doc}`, status: true, otp:otp });
  } else {
    res.status(500).json({ message: err });
   // return { message: `error occoured ${err}`, status: false };
  }

});
} else {
res
  .status(500)
  .json({ Err: err, message: "Some Internal Convertion Issues. in bcrypt hash function" });
}
});





};

//can be used for fogetpassword also
exports.resetPassword = (req, res, next) => {
  //let say a email will be sent to user not doing that in demo
  // but say a ramdom otp will be send to that user
  //So heare isresetapplied will be true with a ramdom otp.
  // var otpGenerator = require('otp-generator')
  var otp = otpGenerator.generate(6, { upperCase: true, specialChars: false });
  console.log(`OTP Generated on ResetPassword : '${otp}'`);
  var email = req.body.email;

  var paramfilterquery = { email: email };
  var updateDictionaryList = [
    { key: "otpForResetPassword", value: `${otp}` },
    { key: "isResetPasswordApplied", value: true },
  ];
  const updateOps = {};
  for (const ops of updateDictionaryList) {
    updateOps[ops.key] = ops.value;
  }
  var filterQuery = paramfilterquery;
  var UpdateQuery = { $set: updateOps };
  model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
    if (!err) {
      res.status(200).json({ message: `updated SuccessFully ${doc}`, status: true, otp:otp });
    } else {
      res.status(500).json({ message: err });
     // return { message: `error occoured ${err}`, status: false };
    }
  // updateMaster(filterQuery,updateDictionaryList,(err,data)=>{
  //   if(!err){
  //     console.log(`result of updatemaster function ${JSON.stringify(data)}`);
  //   }
  //   else
  //   {
  //     console.log(`result of updatemaster function ${JSON.stringify(err)}`);
  //   }
  // });
  
  
  // if(resultjson.status==true)
  // {
  //   res.status(200).json({ status: true, otp: `${otp}`,message: `success: ${resultjson.message}` });
  // }
  // else{
  //   res
  //   .status(500)
  //   .json({ message: `error: ${resultjson.message}` , status:false });
  // }
});
}

function updateMaster(paramfilterquery, updateDictionaryList,callback) {
  const updateOps = {};
  for (const ops of updateDictionaryList) {
    updateOps[ops.key] = ops.value;
  }
  var filterQuery = paramfilterquery;
  var UpdateQuery = { $set: updateOps };
  model.updateOne(filterQuery, UpdateQuery, function (err, doc) {
    if (!err) {
      callback(null,{ message: `updated SuccessFully ${doc}`, status: true });
     // return { message: `updated id: ${id} SuccessFully`, status: true };
    } else {
      callback(new Error(`An error has occurred ${err}`));
     // return { message: `error occoured ${err}`, status: false };
    }
  });
};