import * as Yup from "yup";

const defaultSchema = Yup.object({
  code: Yup.string().required("This is required"),
  name: Yup.string().required("This is required"),
}).required();

export default defaultSchema;
