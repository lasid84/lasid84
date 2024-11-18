import PDFInputBoxSetting from './types/template_location.json' assert{type:"json"};
import * as type from './types/type';
import * as constant from './types/constant';

export const assignInputBox = (container: HTMLDivElement, mode: string, inputValues: Map<string, string> | null, handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, detailData?: any): HTMLDivElement => {
    const commonSetting: type.CommonStyle =  PDFInputBoxSetting.commonStyle;
    const selectLocation = (mode === constant.ORIGIN_MODE)? PDFInputBoxSetting.originLocation : PDFInputBoxSetting.scaleUpLocation;
    for (let idx in selectLocation) {
        const location: type.InputLocation = selectLocation[idx];

        let source: any = {};
        if (mode === constant.ORIGIN_MODE && inputValues?.get(location[constant.SETTING_ID]) === undefined) {
            continue;   
        } else if (mode === constant.SCALEUP_MODE && handleInputChange !== undefined) {
            source = {
                id: location[constant.SETTING_ID],
                onchange: handleInputChange
            };

            // console.log("detailData : ", detailData);

            // if (detailData[0].data[0].length !== 0 && location[constant.SETTING_DATAID] !== undefined) {
            //     let value = detailData[location[constant.SETTING_DATADIRECTORY]].data[0][location[constant.SETTING_DATAID]];
            //     if (value !== undefined) {
            //         source["value"] = value;
            //     }
            // }

        } else {
            source = {value: inputValues?.get(location[constant.SETTING_ID])};
        }
        
        const object = Object.assign(document.createElement(location[constant.SETTING_ELEMENT]),
            source
        );

        object.style.cssText = `
            top: ${location[constant.SETTING_TOP]};
            left: ${location[constant.SETTING_LEFT]};
            width: ${location[constant.SETTING_WIDTH]};
            position: ${commonSetting[constant.SETTING_COMMON_POSITION]};
            border-width: ${commonSetting[constant.SETTING_COMMON_BORDERWIDTH]};
            background: ${commonSetting[constant.SETTING_COMMON_BACKGROUND]};
            font-size: ${location[constant.SETTING_FONTSIZE] == undefined? commonSetting[constant.SETTING_COMMON_FONTSIZE] : location[constant.SETTING_FONTSIZE]};
            line-height: ${commonSetting[constant.SETTING_COMMON_LINEHEIGHT]};
            resize: ${commonSetting[constant.SETTING_COMMON_RESIZE]};
            overflow: ${commonSetting[constant.SETTING_COMMON_OVERFLOW]};
            text-align: ${location[constant.SETTING_TEXTALIGN] == undefined? commonSetting[constant.SETTING_TEXTALIGN] : location[constant.SETTING_TEXTALIGN]};
            font-family: ${commonSetting[constant.SETTING_COMMON_FONTFAMILY]};
        `;

        if (mode === constant.SCALEUP_MODE) {
            object.style.border = "1px solid";
        }

        if (location[constant.SETTING_ELEMENT] === "textarea" && location[constant.SETTING_SPELLCHECK] !== undefined && location[constant.SETTING_ROWS] !== undefined) {
            object.spellcheck = location[constant.SETTING_SPELLCHECK];
            (object as unknown as HTMLTextAreaElement).rows = location[constant.SETTING_ROWS];
        }

        container.appendChild(object);
    }

    return container;
}