import path from "node:path";
import fs from 'fs/promises';

import { FileUploadData } from './type';
import constant from './constant';

// import { log } from '@repo/kwe-lib/components/logHelper';
import { log, error } from "@repo/kwe-lib-new";

/**
 * @FUNCTION
 * 템플릿 유형에 따라 사용할 파일 구분을 위한 함수.
 */
const selectTemplateFile = (templateType:string[]) : string[] => {
  try {
  const rootDirEnv = constant.FILE_REGISTRY_PREFIX.concat(constant.TEMPLATE_FILE_REGISTRY);
  const templateFileRegistryPath = process.env[rootDirEnv.toUpperCase()];

  const typeList = [];
  for (const template of templateType) {
    // console.log("templateFileRegistryPath", templateFileRegistryPath, template, constant.XLSX_FILE_EXTENSION)
    typeList.push(path.join(templateFileRegistryPath, template.concat(constant.XLSX_FILE_EXTENSION)))
  }

  return typeList;
  } catch (ex) {
    log("Exception", ex)
  }
}

/**
 * @FUNCTION
 * 전달된 경로 파일 업로드 함수.
 */
const insertFileToDirectory = (filePath: string, fileData:Buffer): boolean => {
  fs.writeFile(filePath, Buffer.from(fileData))
    .then((_) => {
      return true;
    })
    .catch((_) => {
      return false;
    });
  
  return true;
}

/**
 * @FUNCTION
 * 배열로 전달된 Path를 String으로 변환.
 */
const treeToPath = (filePathTree: string[]): string => {
    if (filePathTree.length < 2) {
      return "";
    }
    // console.log("filePathTree : ", filePathTree);
    let filePath: string;
    for (let i=0; i<filePathTree.length-1; i++) {
      filePath = path.join(filePathTree[i], filePathTree[i+1]);
      filePathTree[i+1] = filePath;
    }
  
    return filePath;
}

/**
 * @FUNCTION
 * - 전달된 path에 folderName에 해당하는 폴더가 존재하는지 확인하며 없을 경우 생성하는 함수.
 * 
 * @returns
 * - 조회 디렉토리 경로.
 */
const uploadFile = (filePathTree: string[], file:FileUploadData): string => {
    const filePath = treeToPath(filePathTree);
    if (filePath === "") {
      return "";
    }

    const uploadFilePath = path.join(filePath, file.fileName);
  
    fs.access(filePath, fs.constants.F_OK)
      .then((_) => {
        if(!insertFileToDirectory(uploadFilePath, file.fileData)) {
          return "";
        }      
      })
      .catch((_) => {
        fs.mkdir(filePath, { recursive: true })
          .then((_) => {
              if(!insertFileToDirectory(uploadFilePath, file.fileData)) {
                return "";
              }       
          })
          .catch((_) => {
            return "";
          });
      });
  
    return uploadFilePath;
}

export default {
    selectTemplateFile,
    insertFileToDirectory,
    treeToPath,
    uploadFile
}