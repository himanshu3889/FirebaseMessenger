import CryptoJS from "crypto-js";

const secretKey = process.env.REACT_APP_ENCRYPTION_DECRYPTION_SECRET_KEY;
function Encrypt(word){
    return CryptoJS.AES.encrypt(word,secretKey).toString();
}

function Decrypt(word){
    return CryptoJS.AES.decrypt(word,secretKey).toString(CryptoJS.enc.Utf8);
}

export {Encrypt,Decrypt}