import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import "./ImageDropzone.css"
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

export const ImageDropzone = ({imagesToUpload, setImagesToUpload}) => {
    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 3,
        accept: "image/*",
        minSize: 0,
        maxSize: 1048576,
        onDrop: (acceptedFiles, rejFiles) => {
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
            console.log(files);
        }
    });

    const deleteImage = (file) => {
        setFiles(files.filter((item) => {
            return item !== file;
        }));
        const newImages = Object.assign(imagesToUpload);
        delete newImages[file];
        setImagesToUpload(newImages);
    }

    return (
        <div>
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>DRAG 'n' drop files or click</p>
            </div>
            {files.map((file, key) => {
                return (<div key={key}>
                    <img alt="" src={file} key={key} />
                    <IconButton onClick={() => {deleteImage(file)}}>
                        <Delete />
                    </IconButton>
                </div>)
            })}
        </div>
    );
};
