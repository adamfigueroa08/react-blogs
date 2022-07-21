import { useState, useEffect } from 'react';
import React from 'react';
import BlogsCard from './BlogsCard';
import { getBlogs, deleteBlogs } from '../../services/blogsServices';
import toastr from 'toastr';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import 'rc-pagination/assets/index.css';
import Pagination from 'rc-pagination';
import { Navigate } from 'react-router-dom';

const _logger = debug.extend();
const BlogsDisplay = () => {
    const [blogInfo, setBlogInfo] = useState({
        blogs: [],
        blogsComponent: [],
        current: 1,
        pageIndex: 0,
        pageSize: 8,
        countOfItems: 0,
    });

    useEffect(() => {
        _logger('I am in useEffect');
        getBlogs(blogInfo.pageIndex, blogInfo.pageSize).then(onGetBlogsSuccess).catch(onGetBlogsError);
    }, []);

    const onGetBlogsSuccess = (data) => {
        const blogsArray = data.item.pagedItems;
        _logger('get blogs success!');
        setBlogInfo((prevState) => {
            const bi = { ...prevState };
            bi.blogs = blogsArray;
            bi.blogsComponent = blogsArray.map(mapBlogs);
            bi.countOfItems = data.item.totalCount;
            return bi;
        }, []);
    };

    const onGetBlogsError = () => {
        toastr.error('unable to get blogs :(');
        _logger('get blogs error!');
    };
    const mapBlogs = (aBlog) => {
        _logger('map blogs', aBlog);
        return <BlogsCard blog={aBlog} key={'ListA' + aBlog.Id} onBlogsClick={clickDeleteCard} />;
    };

    const clickDeleteCard = (blogInfo) => {
        _logger(blogInfo.id);
        const idToBeDeleted = blogInfo.id;

        deleteBlogs(idToBeDeleted).then().catch();

        setBlogInfo((prevState) => {
            const pd = { ...prevState };
            pd.blogs = [...pd.blogs];
            pd.blogsComponent = pd.blogs.map(mapBlogs);
            const idxOf = pd.blogs.findIndex((ablogs) => {
                let result = false;

                if (ablogs.id === idToBeDeleted) {
                    result = true;
                }
                return result;
            });
            if (idxOf >= 1) {
                pd.blogs.splice(idxOf, 1);
                pd.blogsComponent = pd.blogs.map(mapBlogs);
            }
            return pd;
        });
    };

    const onPaginationClicked = (page) => {
        setBlogInfo((prevState) => {
            let pd = { ...prevState };
            pd.current = page;
            pd.pageIndex = page - 1;
            return pd;
        });
        getBlogs(blogInfo.pageIndex, blogInfo.pageSize).then(onGetBlogsSuccess).catch();
    };

    const addFriendClick = (e) => {
        Navigate(e.currentTarget.dataset.page);
    };
    return (
        <React.Fragment>
            <div>
                <span className="d-block p-3 " style={{ backgroundColor: '#634e42' }}></span>
                <h1 style={{ fontSize: 50 }} className="text-center mt-2 ">
                    Pick a Blog
                </h1>
                <div lassName="container position-absolute top-0 start-0 ">
                    <div>
                        <Link
                            to="/blogAddForm"
                            type="button"
                            data-page=""
                            className="btn btn-outline-light ms-4   "
                            href="#"
                            onClick={addFriendClick}
                            style={{ backgroundColor: '#634e42', fontSize: 25 }}>
                            {' '}
                            Add Blog
                        </Link>
                    </div>
                    <div className="  mb-3 text-end me-4 ">
                        <Pagination
                            style={{ fontSize: 15 }}
                            current={blogInfo.current}
                            pageSize={blogInfo.pageSize}
                            total={blogInfo.countOfItems}
                            onChange={onPaginationClicked}
                        />
                    </div>
                </div>
                <div className="row">{blogInfo.blogsComponent}</div>
            </div>
        </React.Fragment>
    );
};

BlogsDisplay.propTypes = {
    blog: PropTypes.shape({
        id: PropTypes.number,
        imageUrl: PropTypes.string,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        blogTypeId: PropTypes.number,
        isPublished: PropTypes.bool,
    }),
};

export default BlogsDisplay;
