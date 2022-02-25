import { createSlice } from "@reduxjs/toolkit";
import { authCheck, changeTheme, changeLang, logOut } from "../actions";

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
            //console.log(action)
            state.authState.id = payload.id;
            state.authState.username = payload.username;
            state.authState.isBlocked = payload.isBlocked;
            state.authState.isAdmin = payload.isAdmin;
            state.authState.theme = payload.theme;
            state.authState.lang = payload.lang;
            state.authState.status = true
            return state;
        });
        builder.addCase(authCheck.rejected, (state, action) => {
            localStorage.removeItem("accessToken");
            state = initialState;
            return state;
        })
        builder.addCase(logOut, (state) => {
            console.log('logout')
            state.authState.status = false;
        })
        builder.addCase(changeLang, (state, {payload}) => {
            state.authState.lang = payload;
        });
        builder.addCase(changeTheme.fulfilled, (state, { payload}) => {
            if (payload.isDark) {
                state.authState.theme = "dark"
            } else {
                state.authState.theme = "light"
            }
        });
    }
});