import React, {useEffect, useState} from 'react';
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import * as Yup from 'yup';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CreatableSelect from 'react-select/creatable';
import { addTags, createOverview, getTags, userById } from "../../api";
import { useSelector } from "react-redux";
import { ImageDropzone } from "../../components";

import "react-mde/lib/styles/css/react-mde-all.css";
import "./CreateOverview.css";
import {useTranslation} from "react-i18next";




const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

export const CreateOverview = () => {
    const { t } = useTranslation();
    const { userId } = useParams();
    const { authState } = useSelector((state) => state.auth);
    const [listOfTags, setListOfTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [freeText, setFreeText] = useState();
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
                history(0);
            });
        })).catch((e) => alert(e));
    }

    const onTagsChange = (newValue) => {
        setSelectedTags(newValue);
    };


    return (
        <div className="create-overview">
            <Formik initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}>
                <Form className={`overview-form ${authState.theme}`}>
                    <Field
                        autoComplete="off"
                        id="titleField"
                        className="overview-form-field title"
                        name="title"
                        placeholder={t("createOverview.titlePlaceholder")} />
                    <Field as="select" className="overview-form-field group" id="groupCreateOverview" name="group">
                        <option value="" hidden >{t('createOverview.group.placeholder')}</option>
                        <option value="books" >{t('createOverview.group.books')}</option>
                        <option value="movies" >{t('createOverview.group.movies')}</option>
                        <option value="games" >{t('createOverview.group.games')}</option>
                    </Field>
                    <Field as="select" className="overview-form-field rating" id="ratingCreateOverview" name="authorRating">
                        <option value="" hidden >{t('createOverview.rating')}</option>
                        <option value="0" >0</option>
                        <option value="1" >1</option>
                        <option value="2" >2</option>
                        <option value="3" >3</option>
                        <option value="4" >4</option>
                        <option value="5" >5</option>
                    </Field>
                    <CreatableSelect
                        className="overview-form-field tags"
                        isMulti
                        id="inputCreateItemTags"
                        onChange={onTagsChange}
                        onInputChange={(e) => {
                            return e.replace(" ", '');
                        }}
                        options={listOfTags}
                        placeholder={t('createOverview.tags')} />
                    <ImageDropzone imagesToUpload={imagesToUpload} setImagesToUpload={setImagesToUpload} />
                    <ReactMde
                        className="overview-form-field description"
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
                    <button type="submit" className="submit-btn">{t('createOverview.button')}</button>
                </Form>
            </Formik>
        </div>
    );
};