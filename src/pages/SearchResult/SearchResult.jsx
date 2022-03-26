import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getAllOverviewsApi } from "../../api";
import { Box, Button, Container, Grid } from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";
import { FaStar } from "react-icons/fa";

import './SearchResult.css';

export const SearchResult = () => {
    let { word } = useParams();
    const { t } = useTranslation();
    let history = useNavigate();
    const [listOfCurrOverviews, setListOfCurrOverviews] = useState([]);
    const [listOfAllOverviews, setListOfAllOverviews] = useState([]);
    const { authState } = useSelector((state) => state.auth);

    useEffect(() => {
        getAllOverviewsApi().then((res) => {
            const filteredOverviews = res.filter((value) => {
                return value.title.toLowerCase().includes(word.toLowerCase())
                    || value.tags.toLowerCase().includes(word.toLowerCase()) ||
                    value.description.toLowerCase().includes(word.toLowerCase());
            }).sort((a, b) => {
                return (b.id - a.id);
            });
            filteredOverviews.map((value) => {
                const ratingsList = value.UsersRatings;
                let allRatings = [];
                ratingsList.map((rating) => {
                    allRatings.push(rating.rating);
                    return rating;
                });
                value.averageRating = (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1);
                return value;
            });
            setListOfAllOverviews(filteredOverviews);
            setListOfCurrOverviews(filteredOverviews.slice(0, 5));
        })
    }, [word]);

    const showMoreBtn = () => {
        if(listOfCurrOverviews.length + 5 >= listOfAllOverviews.length){
            setListOfCurrOverviews(listOfAllOverviews);
        } else{
            setListOfCurrOverviews(listOfAllOverviews.slice(0, listOfCurrOverviews.length + 5))
        }
    };

    return (
        <div className={`tag-click-result ${authState.theme}`}>
            {listOfCurrOverviews.length ?
                <div className="result-text">
                    {t('searchResult.result') + "\"" + word + "\""}
                </div> :
                <div className="result-text">
                    {t('searchResult.noResult') + "\"" + word + "\""}
                </div>
            }
            <Container maxWidth="xs" >
                <Grid item container direction="column" justifyContent="center" alignItems="center" spacing={1}>
                    {listOfCurrOverviews.map((value, key) => {
                        const thisTags = value.tags.split(" ").slice(0, -1);
                        return (
                            <Grid item key={key} container justifyContent="center" alignItems="center">
                                <Box className={`overview ${authState.theme}`}>
                                    <header onClick={() => {history(`/overview/${value.id}`)}} className="overview-header">
                                        <Grid container direction="column" justifyContent="center"
                                              alignItems="center" >
                                            <Grid item>{value.title}</Grid>
                                            <Grid item>{t(`tagClick.group.${value.group}`)}</Grid>
                                            <Grid item>{t('tagClick.lastUpdated') + new Date(value.updatedAt).toLocaleString()}</Grid>
                                            <Grid item>{value.ownerUsername}</Grid>
                                        </Grid>
                                    </header>
                                    <Grid item container justifyContent="center" alignItems="center" className="tag-container">
                                        {thisTags.map((value, key) => {
                                            return(
                                                <Grid item key={key} onClick={() => {history(`/by-tag/${value}`)}} className="overview-tag" style={{ margin: "6px" }}>
                                                    {"#" + value}
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                    {value.images &&
                                        <Grid item>
                                            <img alt="" src={value.images.split(" ")[0]} />
                                        </Grid>
                                    }
                                    <footer>
                                        <Grid container justifyContent="center" alignItems="center"
                                              className={`footer-container ${authState.theme}`}>
                                            <Grid item className="footer-likes">
                                                <FavoriteBorder />
                                                {value.Likes.length}
                                            </Grid>
                                            <Grid item className="footer-rating">
                                                <FaStar size={24}/>
                                                {(value.averageRating === "NaN") ?
                                                    (
                                                        <div>{t('tagClick.noRatings')}</div>
                                                    ) : (
                                                        <div>{value.averageRating}</div>
                                                    )}
                                            </Grid>
                                            <Grid item className="footer-author-rating">
                                                {t('tagClick.authorRating') + value.authorRating}
                                            </Grid>
                                        </Grid>
                                    </footer>
                                </Box>
                            </Grid>
                        )
                    })}
                    {!(listOfCurrOverviews.length >= listOfAllOverviews.length) &&
                        <Button onClick={showMoreBtn} id="submit-btn"
                                className={`submit-btn-search-show-more ${authState.theme}`}>
                            Show more
                        </Button>
                    }
                </Grid>
            </Container>
        </div>
    );
};