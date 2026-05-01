import * as Yup from "yup";

const userSchema = Yup.object({
  account_name: Yup.string().required("This is required"),
  mobile_no: Yup.string().required("This is required"),
  username: Yup.string().required("This is required"),
  account_code: Yup.object()
    .required("This is required")
    .typeError("This is required"),
  order_type: Yup.object()
    .required("This is required")
    .typeError("This is required"),
  role_id: Yup.object()
    .required("This is required")
    .typeError("This is required"),
  charging: Yup.object()
    .required("This is required")
    .typeError("This is required"),
  scope_order: Yup.array()
    .required("This is required")
    .typeError("This is required")
    .min(1, "This is required"),
}).required();

export default userSchema;
