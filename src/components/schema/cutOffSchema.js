import * as Yup from "yup";

const cutOffSchema = Yup.object({
  name: Yup.string().required("This is required"),
  time: Yup.object().required("This is required"),
}).required();

export default cutOffSchema;
