import { createSlice } from "@reduxjs/toolkit";
import { authCheck, changeTheme, changeLang, logOut, register, login } from "../actions";

const initialState = {
    authState: {
        id: "",
        username: "",
        isBlocked: false,
        isAdmin: false,
        theme: "light",
        lang: "en",
        status: false
    }
}


export const authReducer = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        changeLang: (state, action) => {
            state.auth.lang = action.payload;
        },
        changeTheme: (state, action) => {
            state.auth.theme = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder.addCase(authCheck.fulfilled, (state, { payload }) => {
            const theme = localStorage.getItem("theme");
            state.authState.id = payload.id;
            state.authState.username = payload.username;
            state.authState.isBlocked = payload.isBlocked;
            state.authState.isAdmin = payload.isAdmin;
            if (theme !== payload.theme) {
                state.authState.theme = theme;
            } else {
                state.authState.theme = payload.theme;
            }
            state.authState.lang = payload.lang;
            state.authState.status = true
            localStorage.setItem("i18nextLng", payload.lang);
            return state;
        });
        builder.addCase(authCheck.rejected, (state, action) => {
            localStorage.removeItem("accessToken");
             if (!localStorage.getItem("theme")) {
                 localStorage.setItem("theme", "light")
             }
            const theme = localStorage.getItem("theme");
            state.authState.theme = theme;
            return state;
        });
        builder.addCase(register.fulfilled, (state, { payload }) => {
            console.log("registered")
        });
        builder.addCase(register.rejected, (state, { payload }) => {
            alert(payload);
        });
        builder.addCase(login.fulfilled, (state, { payload }) => {
            localStorage.setItem("accessToken", payload.accessToken);
            state.authState.status = true;
        });
        builder.addCase(logOut, (state) => {
            localStorage.removeItem("accessToken");
            state.authState.status = false;
        });
        builder.addCase(changeLang, (state, {payload}) => {
            state.authState.lang = payload;
        });
        builder.addCase(changeTheme.fulfilled, (state, { payload}) => {
            if (payload.isDark) {
                localStorage.setItem("theme", "dark");
                state.authState.theme = "dark";
            } else {
                localStorage.setItem("theme", "light");
                state.authState.theme = "light";
            }
        });
    }
});