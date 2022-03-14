import React, {useEffect} from 'react';
import { useTranslation } from "react-i18next";
import {authCheck} from "../../actions";
import {useDispatch} from "react-redux";

export const Home = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(authCheck());
    }, []);

    return (
        <div>
            <h1>{t('home')}</h1>
        </div>
    );
};