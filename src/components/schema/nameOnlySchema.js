import * as Yup from "yup";

const nameOnlySchema = Yup.object({
  name: Yup.string().required("This is required"),
}).required();

export default nameOnlySchema;
