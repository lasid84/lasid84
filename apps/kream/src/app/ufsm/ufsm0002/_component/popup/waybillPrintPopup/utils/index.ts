import { type, constant } from '../types';

export const assignInputBox = (param: type.assignLocationParam): HTMLDivElement => {
    const commonStyleList = param.locationData[0].data;
    const locationList = param.locationData[1].data;
 
    for (let location of locationList) {
        let source: any = {};
        if (param.mode === constant.ORIGIN_MODE && param.inputValues?.get(location.cd) === undefined) {
            continue;   
        } else if (param.mode === constant.SCALEUP_MODE && param.handleInputChange !== undefined) {
            source = {
                id: location.cd,
                onchange: param.handleInputChange
            };
        } else {
            source = {value: param.inputValues?.get(location.cd)};
        }

        const inputElement = Object.assign(document.createElement(location.sub_cd), source);

        let styleList: any = {};

        for (const commonStyle of commonStyleList) {
            styleList[commonStyle.cd] = commonStyle.sub_cd; 
        }

        if (location.etc_cd1 !== "") {
            const additionalStyleKey = location.etc_cd1.split(",");
            const additionalStyleValue = location.etc_cd2.split(",");

            for (let index in additionalStyleKey) {
                styleList[additionalStyleKey[index]] = additionalStyleValue[index];
                inputElement.setAttribute(additionalStyleKey[index], additionalStyleValue[index]);
            }
        }

        const filterLocation = Object.entries(location).filter(([key, _]) => {
            return key === "top" || key === "left" || key === "width"
        });

        for (let index in filterLocation) {
            if (param.mode === constant.ORIGIN_MODE) {
                const value: any = (filterLocation[index][1] as unknown);
                switch (filterLocation[index][0]) {
                    case "top":
                    case "width":
                        filterLocation[index][1] = (Number(value.replace("px", "")) / (param.viewPort!.width / constant.WEB_A4_WIDTH)) + "px";
                        break;
                    case "left":
                        filterLocation[index][1] = (Number(value.replace("px", "")) / (param.viewPort!.height / constant.WEB_A4_HEIGHT)) + "px";
                        break;
                }
            }
            styleList[filterLocation[index][0]] = filterLocation[index][1];
        }

        inputElement.style.cssText = Object.entries(styleList)
            .map(([key, value]) => `${key}: ${value};`)
            .join(" ");

        if (param.mode === constant.SCALEUP_MODE) {
            inputElement.style.border = "1px solid";
        }

        param.container.appendChild(inputElement);
    }

    return param.container;
}