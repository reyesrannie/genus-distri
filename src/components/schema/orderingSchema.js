import * as Yup from "yup";

const isScientificNotation = (value) => {
  const scientificNotationRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)$/;
  return scientificNotationRegex.test(value);
};

const validateDecimalNumber = (value) => {
  const numericValue = Number(value);
  return !isNaN(numericValue) && !isScientificNotation(value);
};

const orderingSchema = Yup.object({
  order_no: Yup.string().required("This is required"),
  date_needed: Yup.object()
    .required("This is required")
    .typeError("This is required"),

  charging: Yup.object()
    .nullable("This is required")
    .typeError("This is required"),
  type: Yup.object().nullable("This is required").typeError("This is required"),
  tdo: Yup.object().nullable("This is required").typeError("This is required"),

  customer: Yup.object()
    .nullable("This is required")
    .typeError("This is required"),

  order: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string(),
        material: Yup.object()
          .nullable()
          .typeError("This is required")
          .required("This is required")
          .label("Material"),
        category: Yup.object().nullable(),
        uom: Yup.object().nullable(),
        quantity: Yup.number()
          .typeError("Required")
          .required("Required")
          .test("Invalid", "Invalid", validateDecimalNumber)
          .positive("Invalid")
          .test("Invalid", (value) => value !== 0)
          .label("Quantity"),
        remarks: Yup.string().nullable(),
      }),
    )
    .compact((value) => value.material === null && value.quantity === "")
    .min(1)
    .required()
    .label("orders"),
}).required();

export default orderingSchema;
