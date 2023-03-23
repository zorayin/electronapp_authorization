/**
 * 非对称加密-RSA
 * 前端公钥加密 - 后端私钥解密
 *
 */
import { JSEncrypt } from "jsencrypt/lib/JSEncrypt";
import CryptoJS from "crypto-js";
let NodeRSA = require("node-rsa");

// export const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDKMR5Akmsnev0Tf6iqw8RZryqx
// QmD082ZP1GceO+RXat7K6xPUoVA9CxvPcK812yXQNLtE9d1DqMjXJGku7oJj6lJx
// NnKgyF6FCT9hJ/qnkRVukV7eS1Ld9gzeAa4NiINRTZdCvKtWz63O2S5ayN4w5i02
// tMUXe5KsTmya0uMugQIDAQAB
// -----END PUBLIC KEY-----`;

// export const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
// MIICXQIBAAKBgQDKMR5Akmsnev0Tf6iqw8RZryqxQmD082ZP1GceO+RXat7K6xPU
// oVA9CxvPcK812yXQNLtE9d1DqMjXJGku7oJj6lJxNnKgyF6FCT9hJ/qnkRVukV7e
// S1Ld9gzeAa4NiINRTZdCvKtWz63O2S5ayN4w5i02tMUXe5KsTmya0uMugQIDAQAB
// AoGAeqQgfXpSlLf9Gf6tCCeGyf9+HdbtiKa6wGFNywD5GC0yxlKgzLCsQtqiG8l1
// /WzYGtphXQrlE00lxZnIUzdIzsxmNl38WgZQOl4jkCA7fKKYC2ShBSXfOahrRBk2
// 4D846Qp/vP6rhHwpUWAvJAaMAmMfM8T6Z7fg8edZbaXVuAECQQD+wgUwwPKOkeDD
// a4BTybBte/QPtGbSzWLvgMN6ewOnVHqMzhOKpNBmES8O+ISR1c61r3wWIVxCvPN5
// nYxmS5RRAkEAyy18os+Pz+mXWhaOOAM8fx6Q8FpKgGAu/DYxEJUfRb3NtxhferdR
// wwMctv1/uo/FRFDc2mnypGczjHQ/N8NbMQJBAItYhsxHDaWMB1v8xiGOdXE9Vp7s
// dz2g2BfW35V0CeiR3cJ8ydWRFuhtR8cxihnW0A0y4nWcY8GhZq/DzFL7zjECQCT8
// QMX6drloUk7p8DWuESMq00ONjCZWW/c5fjEAlFLDvGDqJOdX26BePqno94lkhopr
// FekEhFD9IFsfBisGeuECQQCDn5SDHwqzEiW80zUZLnSGJYytm8qQGoNar8ux3WQ2
// qnzJJW8cqtbdtrvlcim0WnxnkBKwwjFBOBQei4AcZ2jQ
// -----END RSA PRIVATE KEY-----`;

export const PUBLIC_KEY =`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCldA7LyPozuTIRGMFdvKdt9Hl/
l3DD0qooxP3sZfN6tVZl2Fma3QzXDDb4WnOKGdN6o+YgMfLaTDBGCY5XgU+P6ksz
DxRzCUQU9J142S9mWdRCMU3yo3WHMdy94GQpE04IKhHHj4l5FUhJQDCCwK9TjuFM
BoYXTYjsARr+q9rsZwIDAQAB
-----END PUBLIC KEY-----`
export const PRIVATE_KEY =`-----BEGIN PRIVATE KEY-----
MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAKV0DsvI+jO5MhEY
wV28p230eX+XcMPSqijE/exl83q1VmXYWZrdDNcMNvhac4oZ03qj5iAx8tpMMEYJ
jleBT4/qSzMPFHMJRBT0nXjZL2ZZ1EIxTfKjdYcx3L3gZCkTTggqEcePiXkVSElA
MILAr1OO4UwGhhdNiOwBGv6r2uxnAgMBAAECgYBJx+RlOb1hXV+XQivQijU7kj6w
CC9wE7xvq9D0H06hVMYvangi2BpGt5q3y1YkqnmlAfu4Na3vbPRF9zLzkKWSdxrc
qm4VnmCJLnVIqtflsqQhtyXmV8gC3K1NTqukjw8vyEjtjIrAAGT7kHyTHucVNWdw
Gh107W5BlS6DX6Cv4QJBANZdrRagQaKtW/+n5lgiNf8YUwn9PFjg7ZOg2aALglF/
azpF5hN0KpKwH0ds5W93DJMflO1uPdm6Op/VQ6+hklECQQDFlm/pRpBMZ6byd6tK
8DmOWyedm83Uy6PRKTUclwbTkuZqxDwvvZDGggUdqs1MXX72P/+PwUBchdANZe0J
WG03AkAU9po7sTZZ+0wY50l+avIO3UkZm/sv0edJ3ZwKq7V11NkenMFQO7cCG1kj
ugGB8gl3xcnhojtINI8RHGD/JvTRAkA1//pP38gaCY334DrBPUwNmt4F1gn36Tu5
MzDfwmrMMe6lKUJlrcI+blRlmkOHZloHhNAcgq1LXArTTpLspe0bAkB+/hVwA3zS
24dQNTrvtXShtyL4doI51LnGk5qVsGWPQDYb8NyX/BjucIWInRI5WXt83QHYIVzY
4dmXZhSidPu3
-----END PRIVATE KEY-----`;

export const RSAENCRY = {
  /**
   * 加密
   * @param val 
   * @return 
   */
  encryptByPublicKey: function (val = "") {
    if (val === "") {
      return "";
    }
    let encryptor = new JSEncrypt(); 
    encryptor.setKey(PUBLIC_KEY); 
    return encryptor.encrypt(val); 
  },
  /**
   * 解密
   * @param val
   * @returns {string|false|null|PromiseLike<ArrayBuffer>}
   */
  decryptByPrivateKey: function (val = "") {
    if (val === "") {
      return "";
    }
    let decrypt = new JSEncrypt(); 
    decrypt.setKey(PRIVATE_KEY); 
    return decrypt.decrypt(val); 
  },

  /**
   * 加签 --授权机进行
   */
  addSignatureByPrivateKey: function (val = "") {
    if (val === "") {
      return "";
    }

    let signEncrypt = new JSEncrypt();
    signEncrypt.setPrivateKey(PRIVATE_KEY);
    let signature = signEncrypt.sign(val, CryptoJS.SHA256, "sha256");
    return signature;
  },

  /**
   * 解签  --桌面端进行
   */
  analysisSignatureByPublicKey: function (val = "", signature = "") {
    if (val === "") {
      return "";
    }

    let verifyEncrypt = new JSEncrypt();
    verifyEncrypt.setPublicKey(PUBLIC_KEY);
    let verified = verifyEncrypt.verify(val, signature, CryptoJS.SHA256);
    return verified;
  },
};
