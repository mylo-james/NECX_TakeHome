import React, { useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import validate from "./validate";
import { loginAPI, registerAPI } from "../../api";
import { AppContext } from "../../context";
import { AuthFormProps, FormValues } from "../../types";

const AuthForm: React.FC<AuthFormProps> = ({ register, setRegister }) => {
  const initialValues: FormValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [submitting, setSubmitting] = React.useState(false);
  const [requirements, setRequirements] = useState<string[]>([
    "Password must be at least 8 characters long",
    "Password must contain at least one lowercase letter",
    "Password must contain at least one uppercase letter",
    "Password must contain at least one number",
    "Password must contain at least one special character",
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const { setAppState } = React.useContext(AppContext);

  const focusField = (errors) => {
    if (errors.email) {
      emailRef.current?.focus();
    } else if (errors.password) {
      passwordRef.current?.focus();
    } else if (errors.confirmPassword) {
      confirmPasswordRef.current?.focus();
    }
  };

  const onSubmit = async ({ email, password }, { setSubmitting }) => {
    console.log(email, password);
    const api = register ? registerAPI : loginAPI;
    const { user, tasks } = await api(email, password);
    setAppState((appState) => ({ ...appState, user, tasks }));
    setSubmitting(false);
  };

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Formik<FormValues>
        initialValues={initialValues}
        validate={(values) =>
          validate({
            values,
            setRequirements,
            setSubmitting,
            focusField,
            submitting,
            register,
          })
        }
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({
          isSubmitting,
          errors,
          touched,
          handleChange,
          validateField,
          setFieldTouched,
          values,
        }) => (
          <Form noValidate>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" id="email" innerRef={emailRef} />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                innerRef={passwordRef}
                onChange={(e) => {
                  handleChange(e);
                  validateField("password");
                }}
              />
              {register && requirements.length > 0 && (
                <ul>
                  {requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              )}
              {errors.password && touched.password && (
                <div className={register ? "hidden" : "error-text"}>
                  {errors.password}
                </div>
              )}
            </div>

            {register && (
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  innerRef={confirmPasswordRef}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="error-text">{errors.confirmPassword}</div>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <button type="submit" disabled={isSubmitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
      <button onClick={() => setRegister(!register)}>
        {register ? "I already have an account" : "I need an account"}
      </button>
    </>
  );
};

export default AuthForm;
