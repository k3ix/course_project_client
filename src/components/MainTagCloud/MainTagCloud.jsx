import React from 'react';
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import {TagCloud} from "react-tagcloud";

import './MainTagCloud.css'
import {useSelector} from "react-redux";

export const MainTagCloud = ({ data }) => {
    let history = useNavigate();
    const { authState } = useSelector((state) => state.auth);

    return (
        <div>
            <Container maxWidth="xs" className={`tag-cloud-container ${authState.theme}`}>
                <TagCloud
                    minSize={18}
                    maxSize={18}
                    tags={data.slice(0, 15)}
                    disableRandomColor={true}
                    randomNumberGenerator={() => {return 0}}
                    onClick={tag => {history(`/by-tag/${tag.value}`)}}
                    renderer={(tag) => {
                        return (
                            <div key={tag.value} className={`overview-home-tag ${authState.theme}`}>{"#" + tag.value}</div>
                        )
                    }}
                />
            </Container>
        </div>
    );
};