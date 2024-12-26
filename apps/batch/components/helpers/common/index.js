const os = require('os');
const fs = require("fs/promises");

/**
 * @Function
 * 현재 서버 IP 구하기
 */
const getServerIP = () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }

    return addresses[0];
}

/**
* @Function
* 경로 접근 확인 및 경로 생성 함수.
*/
const checkDirectory = (directory, path, fileData) => {
    fs.access(directory, fs.constants.F_OK)
      .then((_) => {
        if(!insertFileToDirectory(path, fileData)) {
            return "";
        }      
      })
      .catch((_) => {
        fs.mkdir(directory, { recursive: true })
          .then((_) => {
              if(!insertFileToDirectory(path, fileData)) {
                return "";
              }       
          })
          .catch((_) => {
            return "";
          });
    });

    return path;
}

  /**
 * @FUNCTION
 * 전달된 경로 파일 업로드 함수.
 */
const insertFileToDirectory = (filePath, fileData) => {
    fs.writeFile(filePath, Buffer.from(fileData))
      .then((_) => {
        return true;
      })
      .catch((_) => {
        return false;
      });
    
    return true;
  }

module.exports = {
    getServerIP,
    checkDirectory
}