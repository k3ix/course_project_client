import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {
    Home,
    Login,
    Registration
} from "./pages"

import {
    NavigationMenu,
    ThemeChanger,
    LangChanger
} from "./components";
import { useEffect } from "react";
import { authCheck } from "./actions";

function App() {
    const { authState } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    useEffect(() => {
        console.log(localStorage.getItem("accessToken"))
        dispatch(authCheck());
    }, []);

    console.log(authState);
    return (
        <div className={`App ${authState.theme}`}>
            <Router>
                <div className="navBar-container">
                    <NavigationMenu />
                </div>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/registration" element={<Registration />}/>
                </Routes>
                <div className="footer">
                    <ThemeChanger />
                    <LangChanger />
                </div>
            </Router>
        </div>
    );
}

export default App;
