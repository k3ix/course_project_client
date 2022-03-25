import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getAllOverviewsApi } from "../../api";
import { Box, Button, Container, Grid } from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";

export const TagClickResult = () => {
    let { tag } = useParams();
    let history = useNavigate();
    const [listOfCurrOverviews, setListOfCurrOverviews] = useState([]);
    const [listOfAllOverviews, setListOfAllOverviews] = useState([]);

    useEffect(() => {
        getAllOverviewsApi().then((res) => {
            const filteredOverviews = res.filter((value) => {
                return value.tags.includes(tag + " ");
            }).sort((a, b) => {
                return (b.id - a.id);
            });
            console.log(filteredOverviews);
            setListOfAllOverviews(filteredOverviews);
            setListOfCurrOverviews(filteredOverviews.slice(0, 5));
        });
    }, [tag]);

    const showMoreBtn = () => {
        if(listOfCurrOverviews.length + 5 >= listOfAllOverviews.length){
            setListOfCurrOverviews(listOfAllOverviews);
        } else{
            setListOfCurrOverviews(listOfAllOverviews.slice(0, listOfCurrOverviews.length + 5))
        }
    };

    return (
        <div className="tag-click-result">
            {listOfCurrOverviews.length ?
                <div>
                    {"Results for tag " + "\"#" + tag + "\""}
                </div> :
                <div>
                    {"No results for tag " + "\"#" + tag + "\""}
                </div>
            }
            <Container maxWidth="xs" >
                <Grid item container direction="column" justifyContent="center" spacing={1}>
                    {listOfCurrOverviews.map((value, key) => {
                        const thisTags = value.tags.split(" ").slice(0, -1);
                        return (
                            <Grid item key={key} container>
                                <Box className="item">
                                    <header onClick={() => {history(`/overview/${value.id}`)}}>
                                        {value.title}
                                    </header>
                                    <Grid item container justifyContent="flex-start" alignItems="flex-start">
                                        {thisTags.map((value, key) => {
                                            return(
                                                <Grid item key={key} onClick={() => {history(`/by-tag/${value}`)}} className="itemTag" style={{ margin: "6px" }}>
                                                    {"#" + value}
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                    <footer>
                                        <FavoriteBorder style={{ color: "blue" }} />
                                        {value.Likes.length}
                                    </footer>
                                </Box>
                            </Grid>
                        )
                    })}
                    {!(listOfCurrOverviews.length >= listOfAllOverviews.length) &&
                        <Button onClick={showMoreBtn} id="submitButton" style={{ marginBottom: 8 }}>
                            Show more
                        </Button>
                    }
                </Grid>
            </Container>
        </div>
    );
};
