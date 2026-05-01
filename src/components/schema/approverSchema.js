import * as Yup from "yup";

const approverSchema = Yup.object({
  approver: Yup.array()
    .required("This is required")
    .typeError("This is required")
    .min(1, "This is required"),
  charging: Yup.object()
    .required("This is required")
    .typeError("This is required"),
}).required();

export default approverSchema;
