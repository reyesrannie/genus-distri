import * as Yup from "yup";

const assetsSchema = Yup.object({
  asset_tag: Yup.string().required("This is required"),
  description: Yup.string().required("This is required"),
}).required();

export default assetsSchema;
