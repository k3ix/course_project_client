import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { likeApi, overviewByIdApi } from "../../api";
import { Container, Grid, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

import './Overview.css';

export const Overview = () => {
    const { t } = useTranslation();
    const { overviewId } = useParams();
    const { authState } = useSelector((state) => state.auth);
    const [overview, setOverview] = useState({ Likes: [] });
    const [currTags, setCurrTags] = useState([])
    const [currImages, setCurrImages] = useState([]);
    const [isLiked, setIsLikes] = useState(false);
    let history = useNavigate();

    useEffect(() => {
        overviewByIdApi(overviewId).then((overview) => {
            setOverview(overview);
            setCurrTags(overview.tags.split(" ").slice(0, -1));
            setCurrImages(overview.images.split(" ").slice(0, -1));
            const likesList = overview.Likes;
            likesList.map((value) => {
                if (value.UserId === authState.id) {
                    setIsLikes(true)
                }
                return value;
            });
        });
    }, [overviewId]);

    const likeItem = (overviewId) => {
        const accessToken = localStorage.getItem("accessToken");
        likeApi(overviewId, accessToken).then((res) => {
            if (!res.error) {
                setOverview(() => {
                    if (res.liked) {
                        const allLikes = overview.Likes;
                        allLikes.push("0");
                        return {...overview, Likes: allLikes};
                    } else if (!res.liked) {
                        const allLikes = overview.Likes;
                        allLikes.pop();
                        return {...overview, Likes: allLikes};
                    }
                });
                setIsLikes(!isLiked);
            } else {
                localStorage.removeItem("accessToken");
                history("/");
            }
        });
    }

    return (
        <div className={`overview-page ${authState.theme}`}>
            <Container maxWidth="xs">
                <Grid container direction="column" justifyContent="center" alignItems="center" >
                    <Grid item >{overview.title}</Grid>
                    <Grid item>{overview.ownerUsername}</Grid>
                    <Grid item >{"Last updated:" + " " + new Date(overview.updatedAt).toLocaleString()}</Grid>
                </Grid>
            </Container>
            <Grid container justifyContent="flex-start" alignItems="flex-start">
                {currTags.map((value, key) => {
                    return (
                        <Grid item key={key} >
                            {"#" + value}
                        </Grid>
                    )
                })}
            </Grid>
            <Grid container justifyContent="center" alignItems="center">
                {currImages.map((value, key) => {
                    return (
                        <Grid item key={key} >
                            <img style={{ width: "200px", height: "200px" }}alt="" src={value} />
                        </Grid>
                    )
                })}
            </Grid>
            <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
                <Grid item>{"Group:" + " " + overview.group}</Grid>
                <Grid item>{"Author Rating:" + " " + overview.authorRating}</Grid>
                <Grid item>{"Description:"}</Grid>
                <Grid item>{overview.description}</Grid>
            </Grid>
            <IconButton onClick={() => {likeItem(overviewId)}} className="icon" >
                {isLiked ?
                    <Favorite /> :
                    <FavoriteBorder />
                }
                {overview.Likes.length}
            </IconButton>
        </div>
    );
};