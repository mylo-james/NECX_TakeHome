import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
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

  const { push } = useRouter();
  const [requirements, setRequirements] = useState<string[]>([
    "Password must be at least 8 characters long",
    "Password must contain at least one lowercase letter",
    "Password must contain at least one uppercase letter",
    "Password must contain at least one number",
    "Password must contain at least one special character",
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const { setAppState } = React.useContext(AppContext);

  const refs = {
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null),
  };

  const focusField = (errors) => {
    const errorKey = Object.keys(errors)[0];
    refs[errorKey]?.current?.focus();
  };

  const onSubmit = async ({ email, password }, { setSubmitting }) => {
    const api = register ? registerAPI : loginAPI;
    const { user, tasks } = await api(email, password);
    setAppState((appState) => ({ ...appState, user, tasks }));
    setSubmitting(false);
    push("/tasks");
  };

  return (
    <>
      <Formik<FormValues>
        initialValues={initialValues}
        validate={(values) =>
          validate({
            values,
            setRequirements,
            focusField,
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
        }) => (
          <Form noValidate>
            <div>
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                id="email"
                innerRef={refs.email}
              />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                innerRef={refs.password}
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
                  innerRef={refs.confirmPassword}
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
              {isSubmitting ? "Submitting..." : "Submit"}
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
