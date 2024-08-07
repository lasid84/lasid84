// import { useTranslation } from "react-i18next";
import {toast} from "react-toastify";

export const toastDefault = (message: any) => {
  toast(message, {
    position: "top-center",
    // autoClose: 3000,
    // hideProgressBar: false,
    // closeOnClick: true,
    // pauseOnHover: true,
    // draggable: true,
    // progress: undefined,
    // theme: "light",
  });
};

export const toastSuccess = (message: any) => {
  toast.success(message, {
    position: "top-center",
    // autoClose: 3000,
    // hideProgressBar: true,
    // closeOnClick: true,
    // pauseOnHover: true,
    // draggable: true,
    // progress: undefined,
    // theme: "light",
  });
};

export const toastInfo = (message: any) => {
  toast.info(message, {
    position: "top-center",
    // autoClose: 3000,
    // hideProgressBar: false,
    // closeOnClick: true,
    // pauseOnHover: true,
    // draggable: true,
    // progress: undefined,
    // theme: "light",
  });
};

export const toastWaring = (message: any) => {
  // const { t } = useTranslation();
    toast.warning(message, {
      position: "top-center",
      autoClose: 5000,
      // hideProgressBar: false,
      // closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      // progress: undefined,
      // theme: "light",
    });
  };

export const toastError = (message: any) => {
  // const { t } = useTranslation();
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    // hideProgressBar: false,
    // closeOnClick: true,
    // pauseOnHover: true,
    // draggable: true,
    // progress: undefined,
    // theme: "light",
  });
};
