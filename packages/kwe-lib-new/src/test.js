// import pkg from 'rtf.js';
// const { RTFJS } = pkg;
// const { RTFJS } = require('rtf.js');

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

const rtf = `{\\rtf1\\ansi\\ansicpg949\\deff0{\\fonttbl{\\f0\\fnil\\fcharset129 \\'b1\\'bc\\'b8\\'b2;}}
{\\colortbl ;\\red255\\green0\\blue0;}
\\viewkind4\\uc1\\pard\\cf1\\lang1042\\b\\f0\\fs18 /// \\'c1\\'d6\\'c0\\'c7 /////  Origin : \\'c1\\'df\\'b1\\'b9 \\'bd\\'c3\\'be\\'c8(XIY), \\'c3\\'e6\\'c4\\'aa(CKG) \\'b0\\'c7\\'c0\\'ba 
\\par                                 \\'b9\\'e9\\'b8\\'b6\\'bf\\'a1\\'bc\\'ad \\'ba\\'b8\\'bc\\'bc\\'bf\\'ee\\'bc\\'db. (2019.04.02~  )
\\par    => \\'bb\\'e7\\'be\\'f7\\'ba\\'ce\\'b4\\'d9\\'b8\\'a7 !!, [ \\'bf\\'f8\\'ba\\'bb: \\'ba\\'bb\\'bb\\'e7. \\'b9\\'e8\\'c1\\'a4 : BM ] \\cf0\\b0 
\\par ----------------------------------------------------
\\par 
\\par \\'bd\\'ac\\'c6\\'db\\'b0\\'a1 CORNING\\'c0\\'cc\\'b8\\'e9 \\'b9\\'ab\\'c1\\'b6\\'b0\\'c7 20218861
\\par 
\\par \\cf1\\b * F/H\\'b8\\'e9 \\'b9\\'e8\\'c1\\'a4\\'c8\\'ae\\'c0\\'ce\\'c7\\'cf\\'b1\\'e2 : DDP\\'b4\\'c2 \\'c8\\'ad\\'c1\\'d6\\'bf\\'cd CHECK, DAP,DDU\\'b4\\'c2 HN\\cf0\\b0 
\\par 
\\par \\'b5\\'b5\\'c2\\'f8\\'c0\\'cf \\'b1\\'e2\\'c1\\'d8, "\\'bf\\'dc\\'c8\\'af\\'c0\\'ba\\'c7\\'e0 \\'c3\\'d6\\'c3\\'ca\\'b0\\'ed\\'bd\\'c3/ \\'bc\\'db\\'b1\\'dd(\\'c0\\'fc\\'bd\\'c5\\'c8\\'af)/ \\'ba\\'b8\\'b3\\'bb\\'bd\\'c7 \\'b6\\'a7"
\\par COLLECT \\'b0\\'c7 BILL TO : 30296323 
\\par \\'c0\\'ce\\'ba\\'b8\\'c0\\'cc\\'bd\\'cc \\'c7\\'cf\\'bd\\'c7\\'b6\\'a7\\'b4\\'c2 FCFAD / FCFOAD / H/C \\'b0\\'a1 \\'b0\\'a2\\'b0\\'a2\\'c0\\'c7 \\'c0\\'ce\\'ba\\'b8\\'c0\\'cc\\'bd\\'cc 
\\par 
\\par PPD \\'be\\'c6\\'bb\\'ea\\'b0\\'c7(VALUE\\'c1\\'a6\\'bf\\'dc 20218861) \\'c7\\'cf\\'b3\\'aa\\'b7\\'ce \\'b4\\'eb\\'b3\\'b3(COD), 
\\par BILL TO 30283459
\\par 
\\par IC/V(04002549) \\'c1\\'b6\\'c1\\'a4\\'bf\\'ac\\'c2\\'f7\\'c0\\'e5\\'b4\\'d4 (2014.07.29)  BILL TO 302246943 
\\par gregg \\'c0\\'cc \\'ba\\'b8\\'b3\\'bb\\'c1\\'d6\\'b4\\'c2 \\'c7\\'c1\\'b8\\'ae\\'be\\'f3\\'b6\\'f9  low value high value \\'c0\\'cc\\'b7\\'b1\\'b0\\'d4 \\'ba\\'ea\\'b8\\'b5\\'bd\\'ba\\'b0\\'c5
\\par 
\\par \\'c7\\'cf\\'b3\\'aa\\'b7\\'ceTNS\\'bf\\'a1\\'bc\\'ad \\'b0\\'c7\\'b0\\'c7\\'c0\\'cc \\'b0\\'e8\\'bb\\'ea\\'bc\\'ad \\'b9\\'df\\'c7\\'e0 \\'bf\\'e4\\'c3\\'bb \\'c7\\'cf\\'bf\\'b4\\'b0\\'ed, \\'c0\\'d4\\'b1\\'dd\\'b5\\'b5 \\'b0\\'c7\\'b0\\'c7\\'c0\\'cc
\\par (2013\\'b3\\'e2 8\\'bf\\'f91\\'c0\\'cf\\'ba\\'ce\\'c5\\'cd \\'c0\\'fb\\'bf\\'eb) 
\\par PPD \\'b1\\'b8\\'b9\\'cc\\'b0\\'c7 \\'b5\\'bf\\'be\\'c6 \\'b4\\'eb\\'b3\\'b3 (COD) BILL TO 30283578
\\par 
\\par NON-UFS \\'c0\\'d4\\'b7\\'c2\\'bd\\'c3 SHPR - KANTHAL\\'b0\\'c7\\'c0\\'ba SHPR CODE 10011997 
\\par \\'b5\\'da\\'bf\\'a1 \\'b3\\'aa\\'b8\\'d3\\'c1\\'f6 \\'bb\\'f3\\'c8\\'a3\\'b1\\'ee\\'c1\\'f6 BL\\'bf\\'a1 \\'c0\\'d6\\'b4\\'c2\\'b5\\'a5\\'b7\\'ce \\'c0\\'d4\\'b7\\'c2\\'c7\\'d2\\'b0\\'cd
\\par }
`;


// var test = () => {

//   function stringToArrayBuffer(string) {
//     const buffer = new ArrayBuffer(string.length);
//     const bufferView = new Uint8Array(buffer);
//     for (let i = 0; i < string.length; i++) {
//       bufferView[i] = string.charCodeAt(i);
//     }
//     return buffer;
//   }
//   const doc = new RTFJS.Document(stringToArrayBuffer(rtf), {});
//   console.log(doc);
// };


// const rtfToHTML = require('@iarna/rtf-to-html')

// const test2 = () => {
//     rtfToHTML.fromString(rtf, (err, html) => {
//         console.log(html)
//         // prints a document containing:
//         // <p><strong>hi there</strong></p>
//       })
// }

// test2();


import CryptoJS from 'crypto-js';

/* TODO 
    1. secretKey 모듈화(env)
*/

const secretKey = 'Zwm18jRcFUOu1JoZtQw1ZgFY1fO/EDTSlttuoVEG25E='; // 32바이트 길이의 비밀 키를 입력합니다.

// 암호화 함수
export const encrypt = (plaintext) => {
    const cipherText = CryptoJS.AES.encrypt(plaintext, secretKey);
    return cipherText.toString();
  }
  
  // 복호화 함수
export const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

console.log("!"  +decrypt('U2FsdGVkX1+oWwvTzK2I37m479bFdEkp2uJxj7W8o5I=') + "!!!!!", encrypt('1q2w#E$R'), decrypt('U2FsdGVkX1/Pss8ICQpyNYsmuDZH2STGaNqo7Ctk7As=') === encrypt('1q2w#E$R'))