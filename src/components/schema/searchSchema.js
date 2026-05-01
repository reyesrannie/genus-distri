import * as Yup from "yup";

const searchSchema = Yup.object({
  search: Yup.string().nullable(),
}).required();

export default searchSchema;
