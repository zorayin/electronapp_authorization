<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <div class="info-input">
      <!-- <span>授权码</span>
      <el-input v-model="authorizationCode"></el-input> -->
      <el-input placeholder="请输入" v-model="authorizationCode">
        <template slot="prepend">授权码</template>
        <el-button slot="append" @click="submit">验证</el-button>
      </el-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
const { exec, execFile } = require("child_process");
import { RSAENCRY,PUBLIC_KEY,PRIVATE_KEY } from "../utils/RSAEncryption";
import { DESENCRY } from "../utils/DESEncrytion";
import { MD5ENCRY } from "../utils/MD5Encrytion";
import { JSEncrypt } from "jsencrypt/lib/JSEncrypt";
import CryptoJS from "crypto-js";
const data=require("../data/Info.json")
const NodeRSA = require("node-rsa");
const crc = require("crc")


@Component({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {
  private authorizationCode: string = "";
  private UUID="";
  private CPI_ID="";

  mounted() {
    const { exec, execFile, execSync } = require("child_process");
    Vue.prototype.$MACHINE_FINGERPRINT = "";
    exec(
      "wmic csproduct get UUID",
      {},
      (error: any, stdout: any, stderr: any) => {
        let res = stdout.toString().replace(/\s/g, "");
        console.log("主板UUID", res);
       this.UUID=res;
      }
    );

    exec(
      "wmic cpu get processorid",
      {},
      (error: any, stdout: any, stderr: any) => {
        let res = stdout.toString().replace(/\s/g, "");
        console.log("CPU ID", res);
       this.CPI_ID=res;
      }
    );

    setTimeout(() => {
      let machineInfo = this.CPI_ID+this.UUID;
      console.log("机器码明文", machineInfo);

      //DES密钥
      let desKey = "123456";
      let machineEncryptByDes = DESENCRY.encryptByDES(machineInfo, desKey);
      console.log("机器码密文", machineEncryptByDes);
      console.log("crc",crc.crc32(MD5ENCRY.encryptByMD5(machineInfo)).toString(16))

      /**
       * 以下是授权机生成激活码的步骤
       */

      //授权时间
      let authorizationStart = "2023-02-02 09:00:00";
      let authorizationEnd = "2023-02-10 09:00:00";
      console.log("授权开始时间", authorizationStart);
      console.log("授权结束时间", authorizationEnd);

      // License = AesKey16 + AesEnc(data).length + AesEnc(data) + RsaSign(AesEnc(data));

      //随机生成16位AES密钥
      // let AesKey16 = this.getKey(16);
      let AesKey16="IO64ASLEKLTKTF9O";
      console.log("ASE密钥", AesKey16);

      
      console.log((JSON.stringify(data)));
      let newData=(JSON.stringify(data))
      // let newData="这是加密串啊";

      // 测试AES-256-CBC
      var cbcEncrypt = this.AES_CBC_ENCRYPT(newData, AesKey16);
      console.log("cbc加密", cbcEncrypt);
      var cbcDecrypt = this.AES_CBC_DECRYPT(cbcEncrypt, AesKey16);
      console.log("cbc结果比较---", machineInfo === cbcDecrypt,cbcDecrypt);

      let ecb=this.AES_ECB_ENCRYPT(newData, AesKey16);
      console.log("ecb",ecb)
      console.log("ecb解密",this.AES_ECB_DECRYPT(ecb, AesKey16))


      // bZLY6jpSoKc2QV+w4FnRWd28fDSnYKzH6rRs7EhwfyI=


      let RsaSign=RSAENCRY.addSignatureByPrivateKey(ecb) as string
      console.log(RsaSign)
      console.log(ecb.length)

      let ecbLength=ecb.length.toString(16);
      console.log("十六进制长度",ecbLength)
      

      let license=AesKey16+"00"+ecbLength+ecb+RsaSign;
      console.log("最终授权码",license)

      console.log("明文",newData);


      // let res= RSAENCRY.addSignatureByPrivateKey(newData) as string;

      // console.log("加签结果",res);
      const tempData="LGcU2Jb/O0PtQlhhz/5/V1YT9GIdm70LCbn5pGaCCWwewAJ9sYOwewmsqRnPyMjCsBwewerwerwedoKaiQ0cl1zg5W9wofdyS0swntG7rsdsdsdsfqweq"
      const enData=RSAENCRY.encryptByPublicKey(newData);
      const decData=RSAENCRY.decryptByPrivateKey(enData as string);
      console.log(this.GetLen(tempData))
      

      console.log("加密结果：",enData);
      console.log("解密结果：",decData);

      let decRes=RSAENCRY.analysisSignatureByPublicKey(ecb,RsaSign)
      console.log("验签结果",decRes)


      //给加密机器码加签
      // let res = RSAENCRY.addSignatureByPublicKey(cbcEncrypt);
      // console.log("------加签结果-----", res);
      // let license = `${AesKey16}${cbcEncrypt.length}${cbcEncrypt}${res}`;
      // console.log("------激活码------", license);
      // let shiliujinzhi = this.str2hex(license);
      // console.log("十进制", shiliujinzhi);
      // console.log(shiliujinzhi.length);

      // for(let i=0;i<shiliujinzhi.length/10;i++){
      //   // console.log(i);
      //   let groupVal=parseInt(shiliujinzhi.slice(10*i,10*(i+1)));
      //   let count=0;
      //   let value=0;
      //   do {
      //   count++;      //   value = Math.pow(count, 2);
      // } while (value<groupVal);
      // console.log(i,count,value,value-groupVal);
      // }

      //最终需要转为32进制  (即大写字母加数字形式)

      //转二进制

      // const zlib = require("zlib");

      // //参数一表示要压缩的数据，可以是string或buffer
      // zlib.gzip(license, function (err: any, buffer: any) {
      //   if (err) {
      //     console.log(err);
      //   }

      //   //buffer就是压缩后的数据
      //   console.log(buffer.toString());

      //   //对buffer数据进行解压
      //   zlib.unzip(buffer, function (err: any, buffer: any) {
      //     console.log(buffer.toString());
      //   });
      // });
    }, 2000);
  }

 GetLen(str:string) { 
  var regEx = /^[\u4e00-\u9fa5\uf900-\ufa2d]+$/; 
  if (regEx.test(str)) { 
   return str.length * 2; 
  } else { 
   var oMatches = str.match(/[\x00-\xff]/g); 
   var oLength = str.length * 2 - oMatches.length; 
   return oLength; 
  } 
}; 

  // 字符串转16进制
  str2hex(str: string) {
    if (str === "") {
      return "";
    }
    var arr = [];
    // arr.push("0x");
    for (var i = 0; i < str.length; i++) {
      arr.push(str.charCodeAt(i).toString(10));
    }
    return arr.join("");
  }

  /**
   * 生成指定长度密钥
   */
  getKey(n: number) {
    var chars = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    if (n == null) {
      n = 8;
    }
    var res = "";
    for (var i = 0; i < n; i++) {
      var id = Math.ceil(Math.random() * 35);
      res += chars[id];
    }
    return res;
  }

  /**
   * AES-256-CBC对称加密
   * @param text {string} 要加密的明文
   * @param secretKey {string} 密钥，43位随机大小写与数字
   * @returns {string} 加密后的密文，Base64格式
   */
  AES_CBC_ENCRYPT(text: string, secretKey: string) {
    var keyHex = CryptoJS.enc.Base64.parse(secretKey);
    var ivHex = keyHex.clone();
    // 前16字节作为向量
    ivHex.sigBytes = 16;
    ivHex.words.splice(4);
    var messageHex = CryptoJS.enc.Utf8.parse(text);
    var encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }


  /**
   * AES-256-CBC对称解密
   * @param textBase64 {string} 要解密的密文，Base64格式
   * @param secretKey {string} 密钥，43位随机大小写与数字
   * @returns {string} 解密后的明文
   */
  AES_CBC_DECRYPT(textBase64: string, secretKey: string) {
    var keyHex = CryptoJS.enc.Base64.parse(secretKey);
    var ivHex = keyHex.clone();
    // 前16字节作为向量
    ivHex.sigBytes = 16;
    ivHex.words.splice(4);
    var decrypt = CryptoJS.AES.decrypt(textBase64, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Utf8.stringify(decrypt);
  }

    /**
     * ECB加密
     */
    AES_ECB_ENCRYPT (encryptString:string,secretKey: string):string {
            var key = CryptoJS.enc.Utf8.parse(secretKey);
            var srcs = CryptoJS.enc.Utf8.parse(encryptString);
            var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
            return encrypted.toString();
        }

          AES_ECB_DECRYPT (decryptString:string,secretKey: string):string {
            var key = CryptoJS.enc.Utf8.parse(secretKey);
            var decrypt = CryptoJS.AES.decrypt(decryptString, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
            return CryptoJS.enc.Utf8.stringify(decrypt).toString();
        }

  // mounted() {
  //   let encrypt = new JSEncrypt();
  //   let sPrivateKey = encrypt.getPrivateKey();
  //   let sPublicKey = encrypt.getPublicKey();
  //   console.log("客户端生成的私钥：", sPrivateKey);
  //   console.log("客户端生成的公钥：", sPublicKey);

  //   let data = "想要发送asdasdasdaf67868的报文内容";
  //   let dataEncrypt = encrypt.encrypt(data);

  //   if (typeof dataEncrypt === "string") {
  //     let sendData = `${dataEncrypt}${sPrivateKey}`;
  //     console.log(dataEncrypt.length);
  //     console.log("发送给服务端的加签加密报文:", sendData);
  //   }

  //   const os = require("os");
  //   let interfaces = os.networkInterfaces();
  //   console.log("网卡mac地址", interfaces);
  //   Vue.prototype.$MACHINE_FINGERPRINT = interfaces["以太网"][0].mac;

  //   // exec 仅在 Windows 上
  //   const { exec, execFile, execSync } = require("child_process");
  //   exec(
  //     "wmic csproduct get UUID",
  //     {},
  //     (error: any, stdout: any, stderr: any) => {
  //       let res = stdout.toString().replace(/\s/g, "");
  //       console.log("主板UUID", res);
  //       Vue.prototype.$MACHINE_FINGERPRINT =
  //         Vue.prototype.$MACHINE_FINGERPRINT + res;
  //     }
  //   );

  //   exec(
  //     "wmic cpu get processorid",
  //     {},
  //     (error: any, stdout: any, stderr: any) => {
  //       let res = stdout.toString().replace(/\s/g, "");
  //       console.log("CPU ID", res);
  //       Vue.prototype.$MACHINE_FINGERPRINT =
  //         Vue.prototype.$MACHINE_FINGERPRINT + res;
  //     }
  //   );

  //   exec(
  //     "wmic diskdrive get serialnumber",
  //     {},
  //     (error: any, stdout: any, stderr: any) => {
  //       let res = stdout.toString().replace(/\s/g, "");
  //       console.log("硬盘序列号", res);
  //       Vue.prototype.$MACHINE_FINGERPRINT =
  //         Vue.prototype.$MACHINE_FINGERPRINT + res;
  //     }
  //   );
  //   // console.log(Vue.prototype.$MACHINE_FINGERPRINT);
  //   setTimeout(() => {
  //     console.log(Vue.prototype.$MACHINE_FINGERPRINT);
  //     let data = Vue.prototype.$MACHINE_FINGERPRINT;

  //     //用MD5加密生成唯一机器码  作为密钥种子
  //     let machineCode = MD5ENCRY.encryptByMD5(data);
  //     console.log("机器码", machineCode);

  //     //序列号

  //     //本次加密DES密钥
  //     let desSecretKey = DESENCRY.encryptByDES("123123", machineCode);
  //     console.log("DES密钥", desSecretKey);

  //     let desEn = DESENCRY.decryptByDES(desSecretKey, machineCode);
  //     console.log(desEn);

  //     // let encryDataByDes=DESENCRY.encryptByDES(data,)
  //     let encryptDataByPublicKey = RSAENCRY.encryptByPublicKey(data) as string;
  //     console.log("encryptDataByPublicKey: ", encryptDataByPublicKey);

  //     let decryptDataByPrivateKey = RSAENCRY.decryptByPrivateKey(
  //       encryptDataByPublicKey
  //     );
  //     console.log("decryptDataByPrivateKey:", decryptDataByPrivateKey);
  //     console.log(decryptDataByPrivateKey);
  //   }, 1000);
  // }

  async submit() {
    console.log(this.authorizationCode);
    //判断授权码是否正确
    if (true) {
      //使用主板UUID作为主标识，当UUID返回无效的值时，进一步采用CPU ID、BIOS序列号、MachineGUID等方式作为次标识
      // exec 仅在 Windows 上
      // const { exec, execFile } = require("child_process");
    } else {
    }
  }
}
</script>

<style lang="less">
.home {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 500px;
  align-items: center;
  .info-input {
    // display: flex;
    // flex-direction: row;
  }
}
</style>
