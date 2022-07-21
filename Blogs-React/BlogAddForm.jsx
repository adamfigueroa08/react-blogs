import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import debug from 'sabio-debug';
import blogFormSchema from '../../schema/blogFormSchema';
import { Button } from 'react-bootstrap';
import FileUploader from '../fileuploader/FileUploader';
import { useLocation } from 'react-router-dom';
import { addBlog } from '../../services/blogsServices';
import { updateBlogs } from '../../services/blogsServices';
import { lookUps } from '../../services/eventWizardService';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import '../../../src/pages/blogs/blog.scss';
import imgTitle from '../../assets/images/cities/jackson.jpg';
const _logger = debug.extend('BlogForm');

function BlogAddForm(props) {
    _logger(props);

    const [formContent, setFormContent] = useState({
        authorId: 5,
        title: '',
        subject: 'this',
        content: '',
        imageUrl: '',
        blogTypeId: 0,
        isPublished: true,
        types: [],
    });

    const { state } = useLocation();
    _logger('useLocation', state);
    useEffect(() => {
        if (state?.type === 'update') {
            _logger('useEffect', state.payload);
            setFormContent((prevState) => {
                let newState = { ...prevState };
                newState.id = state.payload.id;
                newState.authorId = state.payload.authorId;
                newState.title = state.payload.title;
                newState.content = state.payload.content;
                newState.blogTypeId = state.payload.blogTypeId;
                newState.imageUrl = state.payload.imageUrl;
                newState.subject = state.payload.subject;
                newState.isPublished = state.payload.isPublished;
                return newState;
            });
        }
    }, [state]);
    useEffect(() => {
        lookUps(['blogTypes']).then(onLookupBlogTypesSuccess).catch(onLookupBlogTypesError);
    }, []);

    const onSubmit = (formContent) => {
        _logger('on submit', formContent);

        _logger('Payload data:', formContent);

        if (state) {
            updateBlogs(formContent, formContent.id).then(onUpdateBlogSuccess).catch(onUpdateBlogError);
        } else {
            addBlog(formContent).then(onAddBlogSuccess).catch(onAddBlogError);
        }
    };
    const onUpdateBlogSuccess = (response) => {
        _logger(response, 'onUpdateBlogSuccess');
        toast.success('Blog Updated');
    };

    const onUpdateBlogError = (err) => {
        toast.error('Blog Update Failed');
        _logger('Blog Update error', err);
    };

    const onAddBlogSuccess = (response) => {
        _logger(response, 'onAddBlogSuccess');
        toast.success('Blog Added');
    };

    const onAddBlogError = (err) => {
        toast.error('Please Try Again');
        _logger('blog error', err);
    };

    const onHandleUploadSuccess = (data, setFieldValue) => {
        _logger('File Upload Success', data.items);
        setFieldValue('imageUrl', data?.items?.[0].url);
    };

    ClassicEditor.create(document.querySelector('#editor'), {
        codeBlock: {
            languages: [
                { language: 'css', label: 'CSS' },
                { language: 'html', label: 'HTML' },
            ],
        },
    });

    const mapBlogData = (data) => {
        return (
            <option value={data.id} key={data.id}>
                {data.name}
            </option>
        );
    };

    const onLookupBlogTypesSuccess = (response) => {
        _logger('blogForm', response);

        setFormContent((prevState) => {
            const et = { ...prevState };
            et.types = response.item.blogTypes;
            return et;
        });
    };

    const onLookupBlogTypesError = (error) => {
        _logger(error);
    };

    return (
        <React.Fragment>
            <div>
                <img className="card-img-overlay bg-image" src={imgTitle} alt="" />

                <div className="container mt-5 fs-2 col-8  card box3 ">
                    <div className="row mt-2 fs-2  ">
                        <div className=" ms-5 col-8 ">
                            <Formik
                                onSubmit={onSubmit}
                                enableReinitialize={true}
                                initialValues={formContent}
                                validationSchema={blogFormSchema}>
                                {({ values, setFieldValue, handleChange }) => (
                                    <Form>
                                        <h1 className="mb-2 text-center form-title ">Blog Post</h1>

                                        <div>
                                            <h3 className="box1">Title</h3>
                                            <Field
                                                onChange={handleChange}
                                                value={values.title}
                                                type="text"
                                                name="title"
                                                className="form-control "
                                            />
                                            <div>
                                                <ErrorMessage
                                                    name="title"
                                                    component="div"
                                                    className="alert alert-danger"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-2 mt-3  ">
                                            <h3 className="box1">Lets Blog it Out!</h3>

                                            <CKEditor
                                                className="form-control text-muted"
                                                editor={ClassicEditor}
                                                value={values.content}
                                                onChange={(evt, editor) => setFieldValue('content', editor.getData())}
                                                name="content"
                                                data={values.content}
                                            />

                                            <ErrorMessage
                                                name="content"
                                                component="div"
                                                className="alert alert-danger"
                                            />
                                        </div>
                                        <div>
                                            <div className="row border-light">
                                                <h3 className="mb-2 mt-2 box1 ">Blog Type</h3>

                                                <Field
                                                    value={values.blogTypeId}
                                                    as="select"
                                                    name="blogTypeId"
                                                    id="blogTypeId"
                                                    className="react-select rounded required text-muted form-blog-type col-12"
                                                    classNamePrefix="react-select">
                                                    <option value="null">Pick a Blog</option>
                                                    {formContent.types.map(mapBlogData)}
                                                </Field>
                                                <ErrorMessage
                                                    name="select"
                                                    component="div"
                                                    className="alert alert-danger"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3 fw">
                                            <h3 className="box1">File Uploader</h3>
                                            <FileUploader
                                                onHandleUploadSuccess={(evnt) =>
                                                    onHandleUploadSuccess(evnt, setFieldValue)
                                                }></FileUploader>
                                        </div>
                                        <div className="mb-3 mt-3 text-center">
                                            <Button
                                                className="btn btn-lg mb-4 col-12 btn-outline-light shadow-none border-0 rounded-pill form-btn "
                                                type="submit">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default BlogAddForm;
