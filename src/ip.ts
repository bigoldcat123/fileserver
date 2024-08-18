import os from 'node:os'
const ifaces:any = os.networkInterfaces();
let locatIp = '';
try {
    for (let dev in ifaces) {
        if (dev === '本地连接' || dev === '以太网') {
            for (let j = 0; j < ifaces[dev].length; j++) {
                if (ifaces[dev][j].family === 'IPv4') {
                    locatIp = ifaces[dev][j].address;
                    break;
                }
            }
        }
    }
}catch(e) {
    console.log('warning: waitting for network');
    console.log(e)
}
export default locatIp