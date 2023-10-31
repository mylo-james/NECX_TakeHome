import { IProps, FormValues } from "../../types";

const validate = ({
  values,
  submitting,
  register,
  setRequirements,
  setSubmitting,
  focusField,
}: IProps): Partial<FormValues> => {
  const errors: Partial<FormValues> = {};
  const reqs: string[] = [];

  if (!values.email) {
    errors.email = "Please enter an email";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Please enter a valid email";
  }

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,}$/;
  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
    reqs.push("Password must be at least 8 characters long");
  }
  if (!regex.test(values.password)) {
    if (!/[a-z]/.test(values.password)) {
      reqs.push("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(values.password)) {
      reqs.push("Password must contain at least one uppercase letter");
    }
    if (!/\d/.test(values.password)) {
      reqs.push("Password must contain at least one number");
    }
    if (!/\W/.test(values.password)) {
      reqs.push("Password must contain at least one special character");
    }
  }

  if (register) {
    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  if (submitting) focusField(errors);
  setRequirements(reqs);
  setSubmitting(false);
  return errors;
};

export default validate;
