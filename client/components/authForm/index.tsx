import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import validate, {
  registerValidationSchema,
  loginValidationSchema,
} from "./validate";
import { loginAPI, registerAPI } from "../../api";
import { AppContext } from "../../context";
import { AuthFormProps, FormValues } from "../../types";
import Button from "../common/Button";
import TextButton from "../common/TextButton";
import Modal from "../common/Modal/Modal";
import PasswordInput, {
  PasswordInputRef,
} from "../common/PasswordInput/PasswordInput";
import classNames from "classnames";
import { toast } from "react-toastify";

const AuthForm: React.FC<AuthFormProps> = ({
  register,
  setRegister,
  onClose,
}) => {
  const initialValues: FormValues = {
    email: "demo@user.com",
    password: "Password#0",
    confirm: "",
  };

  const { push } = useRouter();
  const [requirements, setRequirements] = useState<string[]>([
    "Password must be at least 8 characters long",
    "Password must contain at least one lowercase letter",
    "Password must contain at least one uppercase letter",
    "Password must contain at least one number",
    "Password must contain at least one special character",
  ]);
  const [focusableRefs, setFocusableRefs] = useState<React.RefObject<any>[]>(
    []
  );
  const { setAppState } = React.useContext(AppContext);

  const refs = {
    email: useRef<HTMLInputElement>(null),
    password: useRef<PasswordInputRef>(null),
    confirmPassword: useRef<PasswordInputRef>(null),
    submitButton: useRef<HTMLButtonElement>(null),
    changeButton: useRef<HTMLButtonElement>(null),
  };

  const focusField = (errors) => {
    const errorKey = Object.keys(errors)[0];
    refs[errorKey]?.current?.focus();
  };

  const onSubmit = async ({ email, password }, { setSubmitting }) => {
    const api = register ? registerAPI : loginAPI;
    const { user, tasks, message } = await api(email, password);
    toast(message);
    setAppState((appState) => ({ ...appState, user, tasks }));
    setSubmitting(false);
    if (user) {
      push("/tasks");
    }
  };

  const generateFocusableRefs = () => {
    const focusableRefs: any[] = [
      refs.email,
      refs.password.current.passwordRef,
      refs.password.current.showRef,
    ];
    if (register) {
      focusableRefs.push(refs.confirmPassword.current.passwordRef);
      focusableRefs.push(refs.confirmPassword.current.showRef);
    }
    focusableRefs.push(refs.submitButton);
    focusableRefs.push(refs.changeButton);
    return focusableRefs;
  };

  useEffect(() => {
    refs.email.current.focus();
    setFocusableRefs(generateFocusableRefs());
  }, [register]);

  return (
    <Modal onClose={onClose} focusableRefs={focusableRefs}>
      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={
          register ? registerValidationSchema : loginValidationSchema
        }
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
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
          <Form noValidate className={classNames("auth-form")}>
            <div className={classNames("emailContainer")}>
              <div className="email">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  innerRef={refs.email}
                />
                <div className={classNames("error-text")}>
                  {errors.email && touched.email ? <p>{errors.email}</p> : null}
                </div>
              </div>
            </div>

            <div className={classNames("passwordContainer")}>
              <div className={classNames("password")}>
                <PasswordInput
                  value={values.password}
                  onChange={(value) => setFieldValue("password", value)}
                  label="Password"
                  error={errors.password}
                  touched={touched.password}
                  ref={refs.password}
                />
                {register && requirements.length > 0 && (
                  <ul className={classNames("reqList")}>
                    {requirements.map((requirement) => (
                      <li className={classNames("req")} key={requirement}>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {register && (
                <PasswordInput
                  value={values.confirm}
                  onChange={(value) => setFieldValue("confirm", value)}
                  label="Confirm"
                  error={errors.confirm}
                  touched={touched.confirm}
                  ref={refs.confirmPassword}
                />
              )}
            </div>

            <Button
              ref={refs.submitButton}
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
      <div className="change-button">
        <TextButton
          ref={refs.changeButton}
          onClick={() => setRegister(!register)}
          className={"change-button"}
        >
          {register ? "I already have an account" : "I need an account"}
        </TextButton>
      </div>
    </Modal>
  );
};

export default AuthForm;
