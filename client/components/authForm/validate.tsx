import { IProps, FormValues } from "../../types";

const validatePassword = (password: string, reqs: string[]) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,}$/;
  if (!password) {
    reqs.push("Please enter a password");
  }
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

const validateEmail = (email: string, errors: Partial<FormValues>) => {
  if (!email) {
    errors.email = "Please enter an email";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Please enter a valid email";
  }
};

const validateConfirmPassword = (
  confirmPassword: string,
  password: string,
  errors: Partial<FormValues>
) => {
  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
};

const validate = ({
  values,
  register,
  setRequirements,
  focusField,
}: IProps): Partial<FormValues> => {
  const errors: Partial<FormValues> = {};
  const reqs: string[] = [];

  validateEmail(values.email, errors);
  validatePassword(values.password, reqs);

  if (register)
    validateConfirmPassword(values.confirmPassword, values.password, errors);

  focusField(errors);
  setRequirements(reqs);
  return errors;
};

export default validate;
