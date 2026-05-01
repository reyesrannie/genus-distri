import * as Yup from "yup";

const changePasswordSchema = Yup.object({
  old_password: Yup.string().required("Old password is required"),
  password: Yup.string().required("New password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Confirm password doesn't match")
    .required("Confirm password is required"),
}).required();

export default changePasswordSchema;
