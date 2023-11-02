import { toast } from "react-toastify";
import { IProps, FormValues } from "../../types";
import * as Yup from "yup";

export const registerValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,}$/,
      "Password must meet all requirements below"
    )
    .required("Required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: Yup.string().required("Please enter your password"),
});

const validatePassword = (
  password: string,
  reqs: string[],
  errors,
  register
) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,}$/;
  if (password.length < 8) {
    reqs.push("Password must be at least 8 characters long");
  }
  if (!regex.test(password)) {
    if (!/[a-z]/.test(password)) {
      reqs.push("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      reqs.push("Password must contain at least one uppercase letter");
    }
    if (!/\d/.test(password)) {
      reqs.push("Password must contain at least one number");
    }
    if (!/\W/.test(password)) {
      reqs.push("Password must contain at least one special character");
    }
  }
};

const validate = ({
  values,
  setRequirements,
  focusField,
  register,
}: IProps): Partial<FormValues> => {
  const errors: Partial<FormValues> = {};
  const reqs: string[] = [];
  validatePassword(values.password, reqs, errors, register);
  focusField(errors);
  setRequirements(reqs);
  if (Object.keys(errors).length) toast.error("Please fix the errors below");
  return errors;
};

export default validate;
