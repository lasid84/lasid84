const CryptoJS = require('crypto-js');

const secretKey = 'Zwm18jRcFUOu1JoZtQw1ZgFY1fO/EDTSlttuoVEG25E='; // 32바이트 길이의 비밀 키를 입력합니다.

// 암호화 함수
function encrypt(plaintext) {
    const cipherText = CryptoJS.AES.encrypt(plaintext, secretKey);
    return cipherText.toString();
  }
  
  // 복호화 함수
  function decrypt(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

module.exports = {
    encrypt,
    decrypt
}

// console.log(encrypt("1q2w#E$R"));
// console.log(decrypt("U2FsdGVkX1/KowzvJxLaFQHcWI2nI7QLrJMK/V8gn+c="));