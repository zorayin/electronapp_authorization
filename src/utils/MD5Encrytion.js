
import CryptoJS from 'crypto-js'
export const MD5ENCRY = {

    //MD5加密
    encryptByMD5: function (message) {
       return CryptoJS.MD5(message).toString();
  }
 

}
