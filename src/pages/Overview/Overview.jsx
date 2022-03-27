import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { addCommentApi, deleteCommentApi, getCommentsApi, likeApi, overviewByIdApi, ratingClickApi } from "../../api";
import { Container, Grid, IconButton, InputAdornment, OutlinedInput, Paper } from "@mui/material";
import { Delete, Favorite, FavoriteBorder, Send } from "@mui/icons-material";
import { io } from "socket.io-client";
import ReactMarkdown from 'react-markdown'
import { FaStar } from "react-icons/fa";
import './Overview.css';
let socket;



export const Overview = () => {
    const { t } = useTranslation();
    const { overviewId } = useParams();
    const { authState } = useSelector((state) => state.auth);
    const [overview, setOverview] = useState({ Likes: [], UsersRatings: [] });
    const [currTags, setCurrTags] = useState([])
    const [currImages, setCurrImages] = useState([]);
    const [isLiked, setIsLikes] = useState(false);
    const [currComments, setCurrComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [ratingValue, setRatingValue] = useState(0);
    const [hoverRatingValue, setHoverRatingValue] = useState(null);
    const [ratingsAverage, setRatingsAverage] = useState(null);
    const[allRatingsState, setAllRatingsState] = useState([]);
        let history = useNavigate();
    const stars = Array(5).fill(0);


    useEffect(() => {
        socket = io("https://course-project-itransition.herokuapp.com");

        socket.on("sendCommentFromServ", (data) => {
            if (data.OverviewId === overviewId) {
                setCurrComments(prev => [...prev, data]);
            }
        });
    }, []);

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
            const ratingsList = overview.UsersRatings;
            let allRatings = [];
            ratingsList.map((value) => {
                if (value.UserId === authState.id) {
                    setRatingValue(value.rating);
                }
                allRatings.push(value.rating);
                return value;
            });
            setAllRatingsState(allRatings);
            setRatingsAverage(() => {
                return (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1);
            });
        });

        getCommentsApi(overviewId).then((comments) => {
            setCurrComments(comments);
        });
    }, [overviewId, authState]);

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

    const addComment = () => {
        if (newComment) {
            addCommentApi(authState.username, newComment,
                overviewId, authState.id, localStorage.getItem("accessToken")).then( async (res) => {
                    console.log(res);
                    if (res.error) {
                        localStorage.removeItem("accessToken");
                        history("/");
                    } else {
                        await socket.emit("sendComment", res);
                        setCurrComments([...currComments, res]);
                        setNewComment("");
                    }
            });
        }
    };

    const deleteComment = (id) => {
        deleteCommentApi(id, localStorage.getItem("accessToken")).then((res) => {
            if (res.error) {
                localStorage.removeItem("accessToken");
                history("/");
            } else {
                setCurrComments(
                    currComments.filter((value) => {
                        return value.id !== id;
                    })
                );
            }
        });
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            addComment();
        }
    };

    const ratingClick = (currRatingValue) => {
        let mutableRatings = Object.assign(allRatingsState);
        mutableRatings.push(currRatingValue);
        const index = mutableRatings.indexOf(ratingValue);
        mutableRatings.splice(index, 1);
        setAllRatingsState(mutableRatings);
        setRatingsAverage(() => {
            return (mutableRatings.reduce((a, b) => a + b, 0) / mutableRatings.length).toFixed(1);
        });
        const accessToken = localStorage.getItem("accessToken");
        ratingClickApi(overviewId, currRatingValue, accessToken).then(() => {
            setRatingValue(currRatingValue);
        });
    }

    return (
        <div className={`overview-page ${authState.theme}`}>
            <Container maxWidth="xs">
                <Grid container direction="column" justifyContent="center" alignItems="center" >
                    <Grid item className="overview-title" >{overview.title}</Grid>
                    <Grid item className="overview-username" >{overview.ownerUsername}</Grid>
                    <Grid item className="overview-lastUpdated" >
                        {t('overview.lastUpdated') + new Date(overview.updatedAt).toLocaleString()}
                    </Grid>
                </Grid>
            </Container>
            <Grid container justifyContent="flex-start" alignItems="flex-start" >
                {currTags.map((value, key) => {
                    return (
                        <Grid item key={key} onClick={() => {history(`/by-tag/${value}`)}} className="overview-tag">
                            {"#" + value}
                        </Grid>
                    )
                })}
            </Grid>
            <Grid container justifyContent="center" alignItems="center">
                {currImages.map((value, key) => {
                    return (
                        <Grid item key={key} >
                            <img alt="" src={value} />
                        </Grid>
                    )
                })}
            </Grid>
            <Grid
                container direction="column" justifyContent="flex-start"
                alignItems="flex-start" className="overview-info">
                <Grid item>{t('overview.group.group') + t(`overview.group.${overview.group}`)}</Grid>
                <Grid item>{t('overview.authorRating') + overview.authorRating}</Grid>
                <Grid item container direction="column" justifyContent="flex-start"
                      alignItems="flex-start" className="overview-description-container" >
                    <Grid item className="overview-description-title">{t('overview.description')}</Grid>
                    <Grid item className="overview-description-body">
                        <ReactMarkdown>{overview.description}</ReactMarkdown>
                    </Grid>
                </Grid>
            </Grid>
            <div className="likes-ratings">
                <IconButton onClick={() => {likeItem(overviewId)}} className="icon" >
                    {isLiked ?
                        <Favorite /> :
                        <FavoriteBorder />
                    }
                    {overview.Likes.length}
                </IconButton>
                {stars.map((_, index) => {
                    return (
                        <FaStar
                            className="overview-star"
                            key={index}
                            size={24}
                            color={(hoverRatingValue || ratingValue) > index ? "orange" : "#a9a9a9" }
                            onClick={() => ratingClick(index + 1)}
                            onMouseEnter={() => setHoverRatingValue(index + 1)}
                            onMouseLeave={() => setHoverRatingValue(null)}
                        />
                    )
                })}
                {(ratingsAverage === "NaN") ?
                    (
                        <p>{t('overview.noRatings')}</p>
                    ) : (
                        <p>{t('overview.usersRating') + ratingsAverage}</p>
                    )}
            </div>
            <Grid container direction="column" justifyContent="flex-start"
                  alignItems="flex-start" className="comment-section">
                {currComments.length ?
                    currComments.map((value, key) => {
                        return (
                            <Grid
                                item
                                key={key}
                                container
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                spacing={1}
                                className="comment-item"
                            >
                                {(authState.username === value.username || authState.isAdmin) &&
                                    <IconButton onClick={() => deleteComment(value.id)} title={t('overview.deleteTitle')} >
                                        <Delete />
                                    </IconButton>
                                }
                                <Grid item>
                                    <strong>{value.username}</strong>
                                    <div className="comment-body" >{value.commentBody}</div>
                                    <div className="comment-date" >{new Date(value.createdAt).toLocaleString()}</div>
                                </Grid>
                            </Grid>
                        )
                    }) :
                <p className="no-comments">No comments here</p>
                }
                <Grid item className={`comments-input-container ${authState.theme}`}>
                    {authState.status &&
                        <div>
                            <Paper >
                                <OutlinedInput
                                    className="comments-input"
                                    type="text"
                                    value={newComment}
                                    onChange={(event) => {setNewComment(event.target.value)}}
                                    onKeyDown={handleKeyDown}
                                    endAdornment={
                                        <InputAdornment position="end" className={`input-adornment ${authState.theme}`}>
                                            <IconButton onClick={addComment} title={t('overview.sendTitle')}>
                                                <Send />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    />
                            </Paper>
                        </div>
                    }
                </Grid>
            </Grid>
        </div>
    );
};