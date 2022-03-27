import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import * as Yup from 'yup';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import CreatableSelect from 'react-select/creatable';
import {addTagsApi, editOverviewApi, getTagsApi, overviewByIdApi} from "../../api";
import { useSelector } from "react-redux";
import { ImageDropzone } from "../../components";
import { useTranslation } from "react-i18next";

import "react-mde/lib/styles/css/react-mde-all.css";
import "./EditOverview.css";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

export const EditOverview = () => {
    const { t } = useTranslation();
    const { overviewId } = useParams();
    const { authState } = useSelector((state) => state.auth);
    const [listOfTags, setListOfTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [freeText, setFreeText] = useState();
    const [selectedTab, setSelectedTab] = useState("write");
    const [imagesToUpload, setImagesToUpload] = useState({});
    const [currImages, setCurrImages] = useState();
    const [currOverview, setCurrOverview] = useState({});
    let history = useNavigate();
    let alreadySelectedTags = [];

    useEffect(() => {
        overviewByIdApi(overviewId).then((overview) => {
            setCurrOverview(overview);
            setFreeText(overview.description);
            let images = []
            overview.images.split(" ").forEach((url) => {
                if (url !== "") {
                    images.push(url)
                }
            });
            setCurrImages(images);
            const tags = overview.tags.split(" ");
            tags.forEach((tag) => {
                if (tag !== "") {
                    alreadySelectedTags.push({ value: tag, label: tag });
                }
            });
            setSelectedTags(alreadySelectedTags);
        });

        getTagsApi().then((tags) => {
            tags.map((value) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, label: value.tagName }]);
            });
        });
    }, [overviewId])

    const initialValues = {
        title: currOverview.title,
        group: currOverview.group,
        tags: currOverview.tags,
        images: "",
        ownerUsername: currOverview.ownerUsername,
        description: currOverview.description,
        authorRating: currOverview.authorRating,
        UserId: currOverview.UserId
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(t('createOverview.titleRequired')),
        group: Yup.string().required(t('createOverview.groupRequired')),
        authorRating: Yup.number().required(t('createOverview.authorRatingRequired')),
        description: Yup.string().max(240)
    });

    const onSubmit = async (data) => {
        addTagsApi(selectedTags).catch((e) => alert(e));
        let imagesUrlsString = '';
        currImages.map((url) => {
            imagesUrlsString += url + " ";
        });
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
            data.ownerUsername = currOverview.ownerUsername;
            data.description = freeText;
            editOverviewApi(data, overviewId).then(() => {
               history(`/overview/${overviewId}`);
               history(0);
            });
        })).catch((e) => alert(e));
    }

    const onTagsChange = (newValue) => {
        if (newValue in selectedTags) {
            setSelectedTags(selectedTags.filter((tag) => {
                return tag !== newValue;
            }))
        } else {
            setSelectedTags(newValue);
        }
    };

    return (
        <div className={`create-overview ${authState.theme}`}>
            <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}>
                <Form className={`overview-form ${authState.theme}`}>
                    <ErrorMessage name="title" component="span"/>
                    <Field
                        autoComplete="off"
                        id="titleField"
                        className="overview-form-field title"
                        name="title"
                        placeholder={t("createOverview.titlePlaceholder")} />
                    <ErrorMessage name="group" component="span"/>
                    <Field as="select" className="overview-form-field group" id="groupCreateOverview" name="group">
                        <option value="" hidden >{t('createOverview.group.placeholder')}</option>
                        <option value="books" >{t('createOverview.group.books')}</option>
                        <option value="movies" >{t('createOverview.group.movies')}</option>
                        <option value="games" >{t('createOverview.group.games')}</option>
                    </Field>
                    <ErrorMessage name="authorRating" component="span"/>
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
                        defaultValue={alreadySelectedTags}
                        className="overview-form-field tags"
                        isMulti
                        id="inputCreateItemTags"
                        onChange={onTagsChange}
                        onInputChange={(e) => {
                            return e.replace(" ", '');
                        }}
                        options={listOfTags}
                        placeholder={t('createOverview.tags')} />
                    <ImageDropzone
                        imagesToUpload={imagesToUpload}
                        setImagesToUpload={setImagesToUpload}
                        currImages={currImages}
                        setCurrImages={setCurrImages} />
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
                    <button type="submit" className="submit-btn">{t('createOverview.edit')}</button>
                </Form>
            </Formik>
        </div>
    );
};
