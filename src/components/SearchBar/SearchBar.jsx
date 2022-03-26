import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import OutsideClickHandler from "react-outside-click-handler";
import { useTranslation } from "react-i18next";

import './SearchBar.css'
import {useSelector} from "react-redux";


export const SearchBar = ({ data } ) => {
    const { t } = useTranslation();
    const { authState } = useSelector((state) => state.auth);
    let history = useNavigate();
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (event) => {
        console.log(data);
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = data.filter((value) => {
            return value.title.toLowerCase().includes(searchWord.toLowerCase())
                || value.tags.toLowerCase().includes(searchWord.toLowerCase());
        });
        console.log(filteredData);
        if (searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    };

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            clearInput();
            history(`/search-result/${wordEntered}`);
        }
    };

    const clearInput = () => {
        setFilteredData([]);
        setWordEntered("");
    };



    return (
        <Container maxWidth="xs" className={`search ${authState.theme}`}>
            <div className="search-inputs">
                <input
                    type="text"
                    placeholder={t('search')}
                    value={wordEntered}
                    onChange={handleFilter}
                    onKeyDown={handleKeyDown}
                />
                <div className="search-icon">
                    {wordEntered.length === 0 ? (
                        <Search />
                    ) : (
                        <Close id="clear-btn" onClick={clearInput} />
                    )}
                </div>
            </div>
            {filteredData.length !== 0 && (
                <OutsideClickHandler onOutsideClick={() => setFilteredData([])}>
                    <div className="data-result">
                        {filteredData.slice(0, 10).map((value, key) => {
                            return (
                                <div key={key} className="data-overview" onClick={() => {
                                    history(`/overview/${value.id}`);
                                    clearInput();
                                }} >
                                    <p>{value.title} </p>
                                </div>
                            );
                        })}
                    </div>
                </OutsideClickHandler>
            )}
        </Container>
    );
};
