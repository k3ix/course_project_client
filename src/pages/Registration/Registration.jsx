import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import "./Registration.css"
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions";
import {useTranslation} from "react-i18next";

export const Registration = () => {
    const { t } = useTranslation();
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
        email: Yup.string().email("Wrong input").required(t('regPage.emailReq')),
        username: Yup.string().required(t('regPage.usernameReq')),
        password: Yup.string().required(t('regPage.passReq')),
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
                        placeholder={t('regPage.emailPlaceholder')} />
                    <ErrorMessage name="username" component="span"/>
                    <Field
                        autoComplete="off"
                        id="registerFormField"
                        name="username"
                        placeholder={t('regPage.usernamePlaceholder')} />
                    <ErrorMessage name="password" component="span"/>
                    <Field
                        autoComplete="off"
                        type="password"
                        id="registerFormField"
                        name="password"
                        placeholder={t('regPage.passPlaceholder')} />
                    <button type="submit" className="submit-btn">{t('regPage.reg')}</button>
                </Form>
            </Formik>
        </div>
    );
};