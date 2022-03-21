import React, { useEffect, useState } from 'react';
import { userList, blockUsersApi, unblockUsersApi, setAdminApi, deleteUsersApi } from "../../api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { ADMIN_COLUMNS } from "../../shared";
import { Person } from "@mui/icons-material";
import './AdminPanel.css';
import { IconButton } from "@mui/material";
import { LockOpen, Lock, LocalPolice, DeleteForever } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export const AdminPanel = () => {
    const { t } = useTranslation();
    const { authState } = useSelector((state) => state.auth);
    let history = useNavigate();
    const [listOfUsers, setListOfUsers] = useState([]);
    const [listOfIds, setListOfIds] = useState([]);
    useEffect(() => {
        userList().then((list) => {
            setListOfUsers(list);
        });
    }, []);

    const blockUsers = async () => {
        const blockIds = listOfIds;
        blockUsersApi(blockIds).then(() => {
            blockIds.map((value) => {
                setListOfUsers(prevState => prevState.map((user) => {
                    if(value === user.id){
                        return {...user, isBlocked: true };
                    } else {
                        return user;
                    }
                }));
                return value;
            });
        });
    };

    const unblockUsers = async () => {
        const unblockIds = listOfIds;
        unblockUsersApi(unblockIds).then(() => {
            unblockIds.map((value) => {
                setListOfUsers(prevState => prevState.map((user) => {
                    if(value === user.id){
                        return {...user, isBlocked: false };
                    } else {
                        return user;
                    }
                }));
                return value;
            });
        });
    };

    const setAdmin = async () => {
        const adminIds = listOfIds;
        setAdminApi(adminIds).then(() => {
            adminIds.map((value) => {
                setListOfUsers(prevState => prevState.map((user) => {
                    if(value === user.id){
                        return {...user, isAdmin: true };
                    } else {
                        return user;
                    }
                }));
                return value;
            });
        });
    };

    const deleteUsers = async () => {
        const deleteIds = listOfIds;
        deleteUsersApi(deleteIds).then(() => {
            deleteIds.map((value) => {
                setListOfUsers(prevState => prevState.filter((user) => {
                    return user.id !== value;
                }));
                return value;
            });
        });
    };

    return (
        (!authState.isAdmin &&
            <h1>{t('adminPanel.notAdmin')}</h1>
        ) ||
        (authState.isAdmin &&
            <div className="adminPanel">
                <div className={`admBar ${authState.theme}`}>
                    <IconButton onClick={blockUsers} title={t('adminPanel.block')}>
                        <Lock/>
                    </IconButton>
                    <IconButton onClick={unblockUsers} title={t('adminPanel.unblock')}>
                        <LockOpen />
                    </IconButton>
                    <IconButton onClick={setAdmin} title={t('adminPanel.setAdmin')}>
                        <LocalPolice />
                    </IconButton>
                    <IconButton onClick={deleteUsers} title={t('adminPanel.delete')}>
                        <DeleteForever />
                    </IconButton>
                </div>
                <div className={`adminTable ${authState.theme}`}>
                    <DataGrid
                        columns={[...ADMIN_COLUMNS,
                            {
                                field: 'additional',
                                renderHeader: () => t('adminPanel.profile'),
                                sortable: false,
                                width: 100,
                                renderCell: (params) => {
                                    return (<Person onClick={() => {
                                        history(`/user/${params.getValue(params.id, 'id')}`)
                                    }}/>)
                                }
                            }
                        ]}
                        autoHeight
                        rows={listOfUsers}
                        pageSize={10}
                        checkboxSelection
                        disableSelectionOnClick
                        disableColumnMenu
                        onSelectionModelChange={itm => setListOfIds(itm)}
                    />
                </div>
            </div>
        )
    );
};