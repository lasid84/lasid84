export function textToDate(text) {
    var yyyy = text.slice(0,4);
    var mm = text.slice(4,2);
    var dd = text.slice(6,2);
    var hh = text.slice(8,2);
    var mi = text.slice(10,2);
    var ss = text.slice(12,2);

    var newDate = new Date(yyyy, mm, dd, hh, mi, ss, 0);

    return newDate;    
}

export function stringToDateString(source, delimiter = '-') {
    if (source) {
        const year = source.substring(0,4);
        const month = source.substring(4,6);
        const day = source.substring(6,8);

        return [year, month, day].join(delimiter);;
    }
};

export function stringToFullDateString(source, delimiter = '-') {
    if (source) {
        const year = source.substring(0,4);
        const month = source.substring(4,6);
        const day = source.substring(6,8);
        const hour = source.substring(8,10);
        const min = source.substring(10,12);
        const second = source.substring(12,14);

        return [year, month, day].join(delimiter) + " " + [hour, min, second].join(":");
    }
};

export function stringToFullDate(source) {
    if (source) {
        const year = source.substring(0,4);
        const month = source.substring(4,6);
        const day = source.substring(6,8);
        const hour = source.substring(8,10);
        const min = source.substring(10,12);
        const second = source.substring(12,14);

        return new Date([year, month, day].join("") + " " + [hour, min, second].join(":"));
    }
};