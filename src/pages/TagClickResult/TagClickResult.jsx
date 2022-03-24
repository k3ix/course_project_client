import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getAllOverviewsApi} from "../../api";

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
           setListOfAllOverviews(filteredOverviews);
           setListOfCurrOverviews(filteredOverviews.slice(0, 5));
        });
    }, [tag]);

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
        </div>
    );
};
