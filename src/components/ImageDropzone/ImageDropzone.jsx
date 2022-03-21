import React, {useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

import "./ImageDropzone.css"
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

export const ImageDropzone = ({ imagesToUpload, setImagesToUpload, currImages, setCurrImages }) => {
    const { t } = useTranslation();
    const [files, setFiles] = useState([]);
    const { authState } = useSelector((state) => state.auth);
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 3,
        accept: "image/*",
        minSize: 0,
        maxSize: 1048576,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length) {
                if (files.length + acceptedFiles.length <= 3) {
                    acceptedFiles.forEach((file, key) => {
                        const url = URL.createObjectURL(file);
                        setFiles((prev) => [...prev, url]);
                        setImagesToUpload((prev) => ({...prev, [url]: file}));
                    });
                } else {
                    alert("Too many files, you can upload only 3");
                }
            }
        }
    });

    useEffect(() => {
        if (currImages) {
            setFiles(currImages);
        }
    }, [currImages])

    const deleteImage = (file) => {
        setFiles(files.filter((item) => {
            return item !== file;
        }));
        setCurrImages(currImages.filter((item) => {
            return item !== file;
        }));
        const newImages = Object.assign(imagesToUpload);
        delete newImages[file];
        setImagesToUpload(newImages);
    }

    return (
        <div className="image-dropzone">
            <div {...getRootProps({ className: `dropzone ${authState.theme}` })}>
                <input {...getInputProps()} />
                <p>{t('imageDropzone')}</p>
            </div>
            <div className="uploaded-images-container">
                {files.map((file, key) => {
                    return (<div key={key} className={`uploaded-images ${authState.theme}`}>
                                <img alt="" src={file} key={key} />
                                <IconButton onClick={() => {deleteImage(file)}}>
                                    <Delete />
                                </IconButton>
                            </div>)
                })}
            </div>
        </div>
    );
};
