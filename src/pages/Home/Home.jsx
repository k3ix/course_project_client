import React, {useEffect, useState} from 'react';
import { useTranslation } from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {getAllOverviewsApi, getTagsApi} from "../../api";

import "./Home.css"
import {Box, Button, Container, Grid} from "@mui/material";
import {FavoriteBorder} from "@mui/icons-material";
import {FaStar} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MainTagCloud } from "../../components";


export const Home = () => {
    const { t } = useTranslation();
    let history = useNavigate();
    const [lastOverviews, setLastOverviews] = useState([]);
    const [allLastOverviews, setAllLastOverviews] = useState([]);
    const [ratingOverviews, setRatingOverviews] = useState([]);
    const [allRatingOverviews, setAllRatingOverviews] = useState([]);
    const [listOfTags, setListOfTags] = useState([]);
    const { authState } = useSelector((state) => state.auth);

    useEffect(() => {
        getAllOverviewsApi().then((res) => {
            res.map((value) => {
                const ratingsList = value.UsersRatings;
                let allRatings = [];
                ratingsList.map((rating) => {
                    allRatings.push(rating.rating);
                    return rating;
                });
                value.averageRating = (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1);
                return value;
            })
            const sortedLastOverviews = res.sort((a, b) => {
                return b.updatedAt.localeCompare(a.updatedAt);
            });
            setLastOverviews(sortedLastOverviews.slice(0, 5));
            setAllLastOverviews(sortedLastOverviews);
            let byRating = [];
            const sortedByRating = res.filter((value) => {
                return value.averageRating !== "NaN"
            }).sort((a, b) => {
                return (b.averageRating - a.averageRating);
            });
            sortedByRating.map((value) => {
                byRating.push(value);
            })
            res.map((value) => {
                if (value.averageRating === "NaN") {
                    byRating.push(value);
                }
                return value;
            });
            setRatingOverviews(byRating.slice(0, 3));
            setAllRatingOverviews(byRating);
        });

        getTagsApi().then((tags) => {
            tags.map((value) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, label: value.tagName }]);
            });
        });

    }, []);

    const lastShowMore = () => {
        if(lastOverviews.length + 5 >= allLastOverviews.length){
            setLastOverviews(allLastOverviews);
        } else {
            setLastOverviews(allLastOverviews.slice(0, lastOverviews.length + 5));
        }
    };

    const ratingsShowMore = () => {
        if(ratingOverviews.length + 5 >= allRatingOverviews.length){
            setRatingOverviews(allRatingOverviews);
        } else {
            setRatingOverviews(allRatingOverviews.slice(0, ratingOverviews.length + 5));
        }
    };

    return (
        <div className="home-page">
            <Grid container direction="row" justifyContent="center">
                <Container maxWidth="xs" >
                    <div className={`home-text ${authState.theme}`}>{t('home.last')}</div>
                    <Grid item container direction="column" justifyContent="center" alignItems="center" spacing={1}>
                        {lastOverviews.map((value, key) => {
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
                        {!(lastOverviews.length >= allLastOverviews.length) &&
                            <Button onClick={lastShowMore} id="submit-btn-last"
                                    className={`submit-btn-home-show-more ${authState.theme}`}>
                                Show more
                            </Button>
                        }
                    </Grid>
                </Container>
                <Container maxWidth="xs">
                    {listOfTags &&
                        <MainTagCloud data={listOfTags} />
                    }
                    <div className={`home-text ${authState.theme}`}>{t('home.rating')}</div>
                    <Grid item container direction="column" justifyContent="center" alignItems="center" spacing={1}>
                        {ratingOverviews.map((value, key) => {
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
                        {!(ratingOverviews.length >= allRatingOverviews.length) &&
                            <Button onClick={ratingsShowMore} id="submit-btn-rating"
                                    className={`submit-btn-home-show-more ${authState.theme}`}>
                                Show more
                            </Button>
                        }
                    </Grid>
                </Container>
            </Grid>
        </div>
    );
};