'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, memo, RefObject, useState } from "react";
import { useCommonStore } from "./_store/store";

import { log, error } from '@repo/kwe-lib-new';
import { Button } from "@/components/button";
import * as RTFJS from 'rtf.js';
import { LabelGrid } from "@/components/label";

type Props = {
};

export default function MIGR0001(props:Props) {

    const loadDatas = useCommonStore((state) => state.loadDatas);
    const actions = useCommonStore((state) => state.actions);
    const [isRunning01, setIsRunning01] = useState(false);
    const [remainCnt01, setRemainCnt01] = useState(0);
            
    useEffect(() => {
        actions.getLoad();        
    }, []);

    const onRTFToHtml = () => {
        const count = loadDatas?.[0]?.data.length;
        setRemainCnt01(count);
        if (count > 0) setIsRunning01(true);
        (loadDatas?.[0]?.data as []).forEach((row: {cust_code:string, cust_mode:string, etc:string}, i) => {
            const { Document } = RTFJS.RTFJS;
            // RTF 문자열을 ArrayBuffer로 변환
            const encoder = new TextEncoder();
            const buffer = encoder.encode(row.etc).buffer as ArrayBuffer;
    
            // settings 인자는 ISettings 타입으로, 기본값이 없는 경우 빈 객체를 전달할 수 있음.
            const settings = {}; // 필요한 설정이 있다면 여기에 추가하세요.
    
            const doc = new Document(buffer, settings);
            doc.render().then((nodes) => {
                const htmlString = nodes.map(node => node.outerHTML).join('');
                const param = {
                    cust_code: row.cust_code,
                    cust_mode: row.cust_mode,
                    etc: htmlString.replace(/<div\s+style="min-height:\s*9pt;\s*text-align:\s*left;">\s*<\/div>/g, '<p><br></p>')
                }
                actions.setFTFToHtml(param).then(() => {
                    if ((remainCnt01-1) === 0) setIsRunning01(false);
                    else setRemainCnt01(remainCnt01-1);
                    log('finish RTFViewer', remainCnt01);
                });
            });
          })
        
    }
   
    return (
        <div className={`flex flex-col max-h-[calc(100vh)]`}>
            <div className={"flex flex-row"}>
                <Button id="btnSave" label="t_cust_d etc - RTF -> HTML 마이그레이션"
                    width="w-100"
                    onClick={onRTFToHtml} isCircle={isRunning01}
                />
                <LabelGrid id={"lbl"} name={remainCnt01 + ''} textColor={'red-900'} />
            </div>
        </div>
    );
};

