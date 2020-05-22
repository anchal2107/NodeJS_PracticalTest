const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        //using this like syn function can be use like asyn
        // how to pass token in header 
        // in header {"key":"Authorization","value":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e
        // yJlbWFpbCI6ImFuY2hhbEB5YWhvby5jb20iLCJ1c2VybmFtZSI6ImFuY2hhbDEiLCJ1c2VyaWQiOiI1ZDc4Y2U1MD
        // Y1NWEyODc3MmNkOTI1NzYiLCJpYXQiOjE1NjgyMDIxMDYsImV4cCI6MTU2ODIwNTcwNn0.RZkzqUJf5mzMx6FCmeSgCS
        // el-pJKPxQru5QtMOTU8nw"}

        // that means {"key":"Authorization","value":"Bearer <<tokenvaluehere>>"}
        //bearer is passed just like that its just a convention to pass So html know its token just that.
        //'authorization' is keyword already there in header Anchal suppose so. And i saw this in postman also
        //console.log(` token value in checkauth token token ${req.headers.authorization}`)
        const token = req.headers.authorization.split(' ')[1];
        //console.log(` token value in checkauth token token ${token}`)
        const decoded = jwt.verify(token,require('../../constants').jwt_PrivateKey , null);
        //const decoded = jwt.verify(token, process.env.JWT_PrivateKey, null);
        req.userDataDecoded = decoded;
        //next if success not call next if 
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Authentication Failed!' });
    }
};



//// token from body which not recomment token must come from header
// module.exports= (req,res,next)=>{
//     try {
//         //using this like syn function can be use like asyn
//         const decoded =jwt.verify(req.body.token,process.env.JWT_PrivateKey,null);
//         req.userDataDecoded=decoded;
//         //next if success not call next if 
//         next();

//     } catch (error) {
//         return res.status(401).json({message:'Authentication Failed!'});
//     }  


// };