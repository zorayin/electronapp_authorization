
import CryptoJS from 'crypto-js'

export const DESENCRY = {

    //DES加密
    encryptByDES: function (message, key) {
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString();
  },
  //DES加密
 decryptByDES:function(ciphertext, key) {
      let keyHex = CryptoJS.enc.Utf8.parse(key);
      let decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
      },
      keyHex,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    let result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
  }
  

}
