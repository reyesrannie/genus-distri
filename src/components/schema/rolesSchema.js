import * as Yup from "yup";

const rolesSchema = Yup.object({
  name: Yup.string().required("This is required"),
  access_permission: Yup.array().required("This is required"),
}).required();

export default rolesSchema;
