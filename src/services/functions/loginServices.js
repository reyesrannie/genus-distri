import CryptoJS from "crypto-js";

const loginService = () => {
  const saltkey = import.meta.env.VITE_SALT_KEY;

  const loginUser = (data) => {
    const userData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      saltkey
    ).toString();
    sessionStorage.setItem("genusDISTRI", userData);
  };

  return { loginUser };
};

export const { loginUser } = loginService();
