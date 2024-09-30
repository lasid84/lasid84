
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import { Request, Response } from "express";
import fs from 'fs';

import { log } from '@repo/kwe-lib/components/logHelper';
import { callFunction } from '@repo/kwe-lib/components/dbDTOHelper';

interface resultType {
    numericData: number,
    textData: string, 
    cursorData: []
}

// MailOptions 타입 정의
interface MailOptions {
    from: string;           // 발신자 이메일
    to: string;             // 수신자 이메일
    cc?: string;            // 참조
    bcc?: string;           // 숨은참조
    subject: string;        // 이메일 제목
    text?: string;          // 텍스트 본문
    html?: string;          // HTML 본문
    attachments?: {         // 첨부 파일
        filename: string;
        path: string;
    }[];
}
interface AdditionalOptions {
    autoAttachment?: {

    }
}
let transporter: Transporter | null = null;
let directory;

const createTransporter = (): Transporter => {
    if (!transporter) {
        directory = process.env.DIRECTORY_MAIL_ATTACH;
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,                     // SMTP 서버 호스트
            port: Number(process.env.SMTP_PORT),             // SMTP 서버 포트
            secure: process.env.SMTP_SECURE === 'true',      // true for 465, false for other ports
            // auth: {
            //     user: process.env.SMTP_USER,                 // SMTP 인증 사용자
            //     pass: process.env.SMTP_PASS,                 // SMTP 인증 비밀번호
            // },
        });
    }
    return transporter;
};

const defaultMailOptions = {
    from: 'all.krit@kwe.com',      // 발신자 이메일
    to: 'stephen.lim@kwe.com,lasid84@naver.com',      // 수신자 이메일
    cc: '', // 참조
    bcc: '', // 숨은 참조
    subject: 'Test Email from Node.js',     // 메일 제목
    text: 'Hello, this is a test email!',   // 메일 본문 (텍스트)
    // html: '<h1>Hello</h1><p>This is a test email!</p>'  // HTML 형식의 메일 본문

    // 파일 첨부 설정
    attachments: [
        // {
        //     filename: 'test.txt',                // 첨부 파일 이름
        //     path: path.join(__dirname, 'test.txt') // 파일 경로
        // },
        // {
        //     filename: 'image.png',
        //     path: path.join(__dirname, 'image.png'),
        //     cid: 'image@unique.cid'               // 이메일 본문에 이미지 삽입 시 필요
        // }
    ]
};

export const sendMail = async (req: Request, res: Response) => {
    try {
        const { mailOptions, user_id, ipaddr } = req.body;
        const transporter = createTransporter();
        let errMsgTotal = '';
        for (var mailContent of mailOptions) {
            let errMsg = '';
            let attach;
            let body;
            let htmlbody;
            
            if (mailContent.attachment) {
                if (!(await checkFilesExist(mailContent.attachment.split(',')))) {
                    errMsg = mailContent.attachment + ' File is not exist';
                }
                                           
                attach = mailContent.attachment
                        .split(',')
                        .map((arr) => {
                            let filename = arr.split('/').pop();
                            let filePath = arr;
                            return {
                                filename: filename,
                                // path: directory + filePath
                                path: filePath
                            };
                        });            
            }

            if (mailContent.bodyhtml === 'Y') {
                htmlbody = mailContent.body;    
            } else {
                body = mailContent.body ? mailContent.body : mailContent.text;
            }

            var from = mailContent.from_addr ? mailContent.from_addr : mailContent.from;
            var to = mailContent.to_addr ? mailContent.to_addr : mailContent.to;
            var cc = mailContent.cc_addr ? mailContent.cc_addr : mailContent.cc;
            var bcc = mailContent.bcc_addr ? mailContent.bcc_addr : mailContent.bcc;
            var subject = mailContent.subject;
            
            mailContent = {
                ...mailContent,
                from: from,
                to: to,
                cc: cc, 
                bcc: bcc,
                subject: subject,
                text: body,
                html:htmlbody, 
                attachments: attach
            }

            log("==========================mailContent1", mailContent,errMsg,  "host", process.env.SMTP_HOST);

            if (!errMsg) {
                new Promise((resolve, reject) => {
                    transporter.sendMail(mailContent, (error, info) => {
                        if (error) errMsg += (!errMsg ? '' : ' , ') + error;
                    });
                });
            } 
            
            if (mailContent.seq) {
                const inproc =  "public.f_batch01_set_sendemail"
                const inparam = ["in_key", "in_err", "in_user", "in_ipaddr"];
                const invalue = [mailContent.seq, errMsg, user_id, ipaddr];
                const result:resultType = await callFunction(inproc, inparam, invalue) as resultType;
                log("mailContent.seq", result, mailContent.seq, errMsg);
            }

            // log("==========================mailContent2", mailContent,errMsg,  "host", process.env.SMTP_HOST);
        };
        
        if (errMsgTotal) {
            log()
            res.status(502).end(errMsgTotal);
        } else {
            res.status(200).send('Success');    
        }
    } catch (ex) {
        log("sendMail ex: ",ex)
        res.status(501).send(ex);
    }
}

const checkFilesExist = async (filePaths) => {
    for (const filePath of filePaths) {
        try {
            // await fs.promises.access(directory + filePath, fs.constants.F_OK);
            await fs.promises.access(filePath, fs.constants.F_OK);
        } catch (err) {
            console.error(`File does not exist: ${directory + filePath}`);
            return false;
        }
    }
    return true;
};