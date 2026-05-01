import CryptoJS from "crypto-js";

const saltkey = import.meta.env.VITE_SALT_KEY;

export const decodeUser = () => {
  let userDataDecrypt;
  if (sessionStorage.getItem("genusDISTRI")) {
    const userData = sessionStorage.getItem("genusDISTRI");
    const decipherText = CryptoJS.AES.decrypt(userData, saltkey);
    userDataDecrypt = JSON.parse(decipherText.toString(CryptoJS.enc.Utf8));
  }
  return userDataDecrypt;
};

export const getCustomer = () => {
  const userData = decodeUser();
  if (userData) {
    return userData?.customer;
  }
  return null;
};
