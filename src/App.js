import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {
    Home,
    Login,
    Registration,
    WrongPath,
    User,
    AdminPanel,
    CreateOverview,
    Overview,
    EditOverview,
    TagClickResult
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
        dispatch(authCheck());
    }, []);

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
                    <Route path="/admin-panel" element={<AdminPanel />} />
                    <Route path="/user/:userId" element={<User />} />
                    <Route path="/user/:userId/create-overview" element={<CreateOverview />}/>
                    <Route path="/overview/:overviewId" element={<Overview />}/>
                    <Route path="/overview/:overviewId/edit" element={<EditOverview />}/>
                    <Route path="/by-tag/:tag" element={<TagClickResult />} />
                    <Route path="*" element={<WrongPath />} />
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
