import React, { useEffect, useState } from 'react';
import { userList } from "../../api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { COLUMNS } from "../../shared";
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

    return (
        <div className="adminPanel">
            <div className={`admBar ${authState.theme}`}>
                <IconButton title={t('adminPanel.block')}>
                    <Lock/>
                </IconButton>
                <IconButton title={t('adminPanel.unblock')}>
                    <LockOpen />
                </IconButton>
                <IconButton title={t('adminPanel.setAdmin')}>
                    <LocalPolice />
                </IconButton>
                <IconButton title={t('adminPanel.delete')}>
                    <DeleteForever />
                </IconButton>
            </div>
            <div className={`adminTable ${authState.theme}`}>
                <DataGrid
                columns={[...COLUMNS,
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
                rows={listOfUsers}
                pageSize={10}
                checkboxSelection
                disableSelectionOnClick
                disableColumnMenu
                onSelectionModelChange={itm => setListOfIds(itm)}
                />
            </div>
        </div>
    );
};