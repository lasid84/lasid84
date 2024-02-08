export const PopType = {
  CREATE: "C",
  UPDATE: "U",
  DELETE: "D",
  READ: "R",
};

export const setModalValue = (data: any, setValue: any, getValues: any) => {
  Object.keys(data).forEach((item, curr) => {
    getValues(item);
    setValue(item, data[item] ? data[item] : undefined);
  });
};
