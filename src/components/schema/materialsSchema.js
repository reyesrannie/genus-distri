import * as Yup from "yup";

const materialsSchema = Yup.object({
  code: Yup.string().required("This is required"),
  name: Yup.string().required("This is required"),
  category_id: Yup.object()
    .required("This is required")
    .typeError("This is required"),
  uom_id: Yup.object()
    .required("This is required")
    .typeError("This is required"),
  warehouse_id: Yup.object()
    .required("This is required")
    .typeError("This is required"),
}).required();

export default materialsSchema;
