import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {deleteOverviewsApi, userById, userOverviewsApi} from "../../api";
import {Button, IconButton} from "@mui/material";
import { AccountBox, DeleteForever } from "@mui/icons-material";
import './User.css'
import { useTranslation } from "react-i18next";
import { OVERVIEWS_COLUMNS } from "../../shared";
import { DataGrid } from "@mui/x-data-grid";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';

export const User = () => {
    const { t } = useTranslation();
    let history = useNavigate();
    const { authState } = useSelector((state) => state.auth);
    let { userId } = useParams();
    const [listOfIds, setListOfIds] = useState([]);
    const [thisUser, setThisUser] = useState({});
    const [usersOverviews, setUsersOverviews] = useState([]);

    useEffect(async () => {
        userById(userId).then(user => {
            if (user) {
                setThisUser(user);
            } else {
                history('/');
            }
        });

        userOverviewsApi(userId).then(data => {
            if (data) {
                setUsersOverviews(data);
            }
        });
    }, [authState, userId]);

    const deleteOverviews = async () => {
        const deleteIds = listOfIds;
        console.log(deleteIds);
        deleteOverviewsApi(deleteIds).then(() => {
            deleteIds.map((value) => {
                setUsersOverviews(prev => prev.filter((overview) => {
                    return overview.id !== value;
                }));
                return value;
            });
        });
    };

    return (
        <div className="userPage">
            <div className={`userInfo ${authState.theme}`}>
                <AccountBox fontSize="large" color="primary" />
                <h3 className="username">{thisUser.username}</h3>
            </div>
            <div className={`buttonBar ${authState.theme}`}>
                {authState.isAdmin &&
                    <Button
                    onClick={() => {history("/admin-panel")}}
                    className="userbtn"
                    >{t('user.adminPanel')}</Button>
                }
                {((authState.id.toString() === userId) || authState.isAdmin) &&
                    <Button
                    onClick={() => {history(`/user/${userId}/create-overview`)}}
                    className="userbtn"
                    >{t('user.createOverview')}</Button>
                }
            </div>
            <div className="table-container">
                <div className={`table-bar ${authState.theme}`}>
                    <IconButton onClick={deleteOverviews} title={t('adminPanel.delete')}>
                        <DeleteForever />
                    </IconButton>
                </div>
                <div className={`overviews-table ${authState.theme}`}>
                    <DataGrid
                        autoHeight
                        columns={[...OVERVIEWS_COLUMNS, {
                            field: "additional",
                            renderHeader: () => t('user.headers.ops'),
                            sortable: false,
                            width: 150,
                            renderCell: (params) => {
                                return (<div>
                                            <IconButton
                                                onClick={() => {history(`/overview/${params
                                                    .getValue(params.id, 'id')}`)}}
                                                title={t('user.see')}>
                                                <RemoveRedEyeIcon/>
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {history(`/overview/${params
                                                    .getValue(params.id, 'id')}/edit`)}}
                                                title={t('user.edit')}>
                                                <EditIcon/>
                                            </IconButton>
                                        </div>)
                            }
                        }]}
                        rows={usersOverviews}
                        pageSize={10}
                        checkboxSelection
                        disableSelectionOnClick
                        disableColumnMenu
                        onSelectionModelChange={itm => setListOfIds(itm)}
                    />
                </div>
            </div>
        </div>
    );
};
