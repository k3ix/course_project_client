import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const authCheck = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        const response = await axios.get("https://course-project-itransition.herokuapp.com/users/auth", {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        });
        if (response.data.error) {
            return rejectWithValue(response.data.error);
        } else {
            return response.data;
        }
    }
);
export const register = createAsyncThunk('auth/register',
    async (req, { rejectWithValue }) => {
    const response = await axios.post("https://course-project-itransition.herokuapp.com/users/register", req);
    if (response.data.error) {
        return rejectWithValue(response.data.error);
    } else {
        return response.data;
    }
    });
export const login = createAsyncThunk('auth/login',
    async (req, { rejectWithValue }) => {
    const response = await axios.post("https://course-project-itransition.herokuapp.com/users/login", req);
    if (response.data.error) {
        return rejectWithValue(response.data.error);
    } else {
        return response.data;
    }
    })
export const logOut = createAction('auth/logOut');
export const changeLang = createAction('auth/changeLang');
export const changeTheme = createAsyncThunk(
    'auth/changeTheme',
    async (req ) => {
        if (req.id) {
            await axios.put("https://course-project-itransition.herokuapp.com/users/change-theme", req)
        }
        return req;
    }
)