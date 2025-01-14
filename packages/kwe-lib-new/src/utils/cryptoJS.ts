import CryptoJS from 'crypto-js';

/* TODO 
    1. secretKey 모듈화(env)
*/

const secretKey = 'Zwm18jRcFUOu1JoZtQw1ZgFY1fO/EDTSlttuoVEG25E='; // 32바이트 길이의 비밀 키를 입력합니다.

// 암호화 함수
export const encrypt = (plaintext: string) => {
    const cipherText = CryptoJS.AES.encrypt(plaintext, secretKey);
    return cipherText.toString();
  }
  
  // 복호화 함수
export const decrypt = (cipherText: string) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

// console.log(encrypt("1q2w#E$R"));
// console.log(decrypt("U2FsdGVkX1/KowzvJxLaFQHcWI2nI7QLrJMK/V8gn+c="));