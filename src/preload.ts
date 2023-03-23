const os = require("os");
import Vue from 'vue'

document.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string): void => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    const text = process.versions[type];
    if (text) {
      replaceText(`${type}-version`, text);
    }
  }

  // let info="";

  // let interfaces = os.networkInterfaces();
  // console.log("网卡mac地址", interfaces);
  // info=info+interfaces["以太网"][0].mac
  // Vue.prototype.$MACHINE_FINGERPRINT=interfaces["以太网"][0].mac;
  

  // console.log("CPU的字节序", os.endianness());
  // console.log("操作系统主机名", os.hostname());
  // console.log("操作系统", os.release());
  // console.log(os.constants);

  // exec 仅在 Windows 上
  // const { exec, execFile } = require("child_process");
  // exec("wmic csproduct get UUID", {}, (error:any, stdout:any, stderr:any) => {
  //   console.log("主板UUID", stdout);
  //   Vue.prototype.$MACHINE_FINGERPRINT=Vue.prototype.$MACHINE_FINGERPRINT+stdout.slice(4);
  // });

  // exec("wmic cpu get processorid", {}, (error:any, stdout:any, stderr:any) => {
  //   console.log("CPU ID", stdout);
  //   Vue.prototype.$MACHINE_FINGERPRINT=Vue.prototype.$MACHINE_FINGERPRINT+stdout;
  
  // });

  // exec("wmic diskdrive get serialnumber", {}, (error:any, stdout:any, stderr:any) => {
  //   console.log("硬盘序列号", stdout);
  //   Vue.prototype.$MACHINE_FINGERPRINT=Vue.prototype.$MACHINE_FINGERPRINT+stdout;
  // });

  // const GUID = () => {
  //   console.log("GUID");
  // };

  // exec("wmic bios get serialnumber", {}, (error:any, stdout:any, stderr:any) => {
  //   console.log("BIOS序列号", stdout);
  // });

  // exec(
  //   "wmic baseboard get Manufacturer,Product,SerialNumber,Version",
  //   {},
  //   (error:any, stdout:any, stderr:any)=> {
  //     console.log("主板信息", stdout);
  //   }
  // );

  // setTimeout(()=>{console.log(Vue.prototype.$MACHINE_FINGERPRINT)},1000)
  
  // Vue.prototype.$MACHINE_FINGERPRINT=info;
  // console.log(Vue.prototype.$MACHINE_FINGERPRINT)
  // console.log(info);

});
