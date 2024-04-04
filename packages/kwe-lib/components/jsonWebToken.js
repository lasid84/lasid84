
// import jwt, { JwtPayload } from "jsonwebtoken";
const jwt = require("jsonwebtoken");

// interface SignOption {
//     expiresIn?: string | number;
// }

const DEFAULT_SIGN_OPTION = {
    expiresIn: "1d",
  };

const secret_key = "Zwm18jRcFUOu1JoZtQw1ZgFY1fO/EDTSlttuoVEG25E=";

const signJwtAccessToken = (payload, options = DEFAULT_SIGN_OPTION) => {
    // console.log("signJwtAccessToken", "1234");
    
    const token = jwt.sign(payload, secret_key, options);
    return token;
}
  
function verifyJwt(token)  {
    try {
        const decoded = jwt.verify(token, secret_key);
        // return decoded as JwtPayload;
        return decoded;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {signJwtAccessToken, verifyJwt}