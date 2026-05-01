import * as Yup from "yup";

const uomSchema = Yup.object({
  code: Yup.string().required("This is required"),
  description: Yup.string().required("This is required"),
}).required();

export default uomSchema;
