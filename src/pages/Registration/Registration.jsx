import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import "./Registration.css"
import {useDispatch, useSelector} from "react-redux";
import { register } from "../../actions";

export const Registration = () => {
    const { authState } = useSelector((state) => state.auth);
    let history = useNavigate();
    const dispatch = useDispatch();

    const initialValues = {
        email:"",
        username:"",
        password:"",
    };

    const onSubmit = (data) => {
        dispatch(register(data));
        history("/login");
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Wrong input").required("E-Mail is required."),
        username: Yup.string().required("Username is required."),
        password: Yup.string().required("Password is required."),
    });
    return (
        <div className="registerPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form className={`registerForm ${authState.theme}`}>
                    <ErrorMessage name="email" component="span"/>
                    <Field
                        autoComplete="off"
                        id="registerFormField"
                        name="email"
                        placeholder="Enter your e-mail" />
                    <ErrorMessage name="username" component="span"/>
                    <Field
                        autoComplete="off"
                        id="registerFormField"
                        name="username"
                        placeholder="Enter username" />
                    <ErrorMessage name="password" component="span"/>
                    <Field
                        autoComplete="off"
                        type="password"
                        id="registerFormField"
                        name="password"
                        placeholder="Password"/>
                    <button type="submit" className="submit-btn">Register</button>
                </Form>
            </Formik>
        </div>
    );
};