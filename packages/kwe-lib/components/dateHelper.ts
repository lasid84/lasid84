
function leftPad(value) {
    if (value >= 10) {
        return value;
    }

    return `0${value}`;
};

export function toStringByFormatting(source, delimiter = '-') {
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());

    return [year, month, day].join(delimiter);
};


export function stringToFullDateString(source, delimiter = '-') {
    if (source) {
        const year = source.slice(0,4);
        const month = source.slice(4,6);
        const day = source.slice(6,8);
        const hour = source.slice(8,10);
        const min = source.slice(10,12);
        const second = source.slice(12,14);

        return [year, month, day].join(delimiter) + " " + [hour, min, second].join(":");
    }
};