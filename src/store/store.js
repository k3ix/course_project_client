import {configureStore} from "@reduxjs/toolkit";
import { authReducer } from "../reducers";

export const store = configureStore({
    reducer: {
        auth: authReducer.reducer
    }
});