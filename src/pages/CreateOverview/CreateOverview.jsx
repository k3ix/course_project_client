import React, {useEffect, useState} from 'react';
import { useNavigate, useParams} from "react-router-dom";
import * as Yup from 'yup';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CreatableSelect from 'react-select/creatable';
import {addTags, cloudinaryUpload, createOverview, getTags, userById} from "../../api";
import { useSelector } from "react-redux";

import { ImageDropzone } from "../../components";

import "react-mde/lib/styles/css/react-mde-all.css";
import axios from "axios";



const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

export const CreateOverview = () => {
    const { userId } = useParams();
    const { authState } = useSelector((state) => state.auth);
    const [listOfTags, setListOfTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [freeText, setFreeText] = useState("Write your message");
    const [selectedTab, setSelectedTab] = useState("write");
    const [thisUser, setThisUser] = useState({});
    const [imagesToUpload, setImagesToUpload] = useState({});
    let history = useNavigate();

    useEffect(() => {
        userById(userId).then(user => {
            if (user) {
                setThisUser(user);
            } else {
                history('/');
            }
        });

        getTags().then((tags) => {
            tags.map((value) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, label: value.tagName }]);
            });
        });
    }, [userId])

    const initialValues = {
        title: "",
        group: "",
        tags: "",
        images: "",
        ownerUsername: "",
        description: "",
        authorRating: "",
        UserId: userId
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
    })

    const onSubmit = async (data) => {
        addTags(selectedTags).catch((e) => alert(e));
        let imagesUrlsString = '';
        await axios.all(Object.keys(imagesToUpload).map(async (key) => {
            const formData = new FormData();
            formData.append("file", imagesToUpload[key]);
            formData.append("upload_preset", "ykiyiiw3");
            return axios.post("https://api.cloudinary.com/v1_1/ksix/image/upload", formData);
        })).then(axios.spread((...res) => {
            res.forEach((res) => {
                imagesUrlsString += res.data.secure_url + " ";
            });
            data.images = imagesUrlsString;
            let tagsString = '';
            selectedTags.map((value) => {
                tagsString += value.label + ' ';
                return value;
            });
            data.tags = tagsString;
            data.ownerUsername = thisUser.username;
            data.description = freeText;
            createOverview(data).then((res) => {
                history(`/user/${userId}`);
            });
        })).catch((e) => alert(e));
    }

    const onTagsChange = (newValue) => {
        setSelectedTags(newValue);
    };


    return (
        <div className="createOverview">
            <Formik initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}>
                <Form>
                    <Field
                        autoComplete="off"
                        id="writeMessageFormField"
                        name="title"
                        placeholder="Enter a title" />
                    <Field as="select" id="inputCreateOverview" name="group">
                        <option value="" hidden >Choose a theme</option>
                        <option value="books" >Books</option>
                        <option value="movies" >Movies</option>
                        <option value="games" >Videogames</option>
                    </Field>
                    <Field as="select" id="inputCreateOverview" name="authorRating">
                        <option value="" hidden >Enter rating</option>
                        <option value="0" >0</option>
                        <option value="1" >1</option>
                        <option value="2" >2</option>
                        <option value="3" >3</option>
                        <option value="4" >4</option>
                        <option value="5" >5</option>
                    </Field>
                    <CreatableSelect
                        isMulti
                        id="inputCreateItemTags"
                        onChange={onTagsChange}
                        onInputChange={(e) => {
                            return e.replace(" ", '');
                        }}
                        options={listOfTags}
                        placeholder="Enter tags" />
                    <ImageDropzone imagesToUpload={imagesToUpload} setImagesToUpload={setImagesToUpload} />
                    <ReactMde
                        value={freeText}
                        onChange={setFreeText}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={markdown =>
                            Promise.resolve(converter.makeHtml(markdown))
                        }
                        childProps={{
                            writeButton: {
                                tabIndex: -1
                            }
                        }}
                    />
                    <button type="submit" className="submitbtn">Send message</button>
                </Form>
            </Formik>
        </div>
    );
};