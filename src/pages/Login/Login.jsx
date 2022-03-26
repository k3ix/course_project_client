import React from 'react';
import {Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import './Login.css';
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../actions";
import {useTranslation} from "react-i18next";

export const Login = () => {
    const { t } = useTranslation();
    const { authState } = useSelector((state) => state.auth);
    let history = useNavigate();
    const dispatch = useDispatch();

    const initialValues = {
        nameOrEmail: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        nameOrEmail: Yup.string().required(t("loginPage.noeReq")),
        password: Yup.string().required(t("loginPage.passReq")),
    });

    const onSubmit = async (data) => {
        await dispatch(login(data));
        history("/");
    };

    return (
        <div className="loginPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form className={`loginForm ${authState.theme}`}>
                    <ErrorMessage name="nameOrEmail" component="span"/>
                    <Field
                        autoComplete="off"
                        id="loginFormField"
                        name="nameOrEmail"
                        placeholder={t("loginPage.noePlaceholder")} />
                    <ErrorMessage name="password" component="span"/>
                    <Field
                        autoComplete="off"
                        type="password"
                        id="loginFormField"
                        name="password"
                        placeholder={t("loginPage.passPlaceholder")} />
                    <button type="submit" className="submit-btn">{t("loginPage.login")}</button>
                </Form>
            </Formik>
        </div>
    );
};
