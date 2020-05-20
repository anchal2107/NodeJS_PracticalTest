// Function to generate OTP 
//can use this function but using package npm install otp-generator --save
// var otpGenerator = require('otp-generator') 
//otpGenerator.generate(6, { upperCase: false, specialChars: false });

function generateOTP() { 
    // Declare a string variable  
    // which stores all string 
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    let OTP = ''; 
      
    // Find the length of string 
    var len = string.length; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += string[Math.floor(Math.random() * len)]; 
    } 
    return OTP; 
} 
  
