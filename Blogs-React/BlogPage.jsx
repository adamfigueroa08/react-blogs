import React, { useState, useEffect } from 'react';
import Comments from '../../components/comments/Comments';
import { getBlogId } from '../../services/blogsServices';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import '../blogs/blog.scss';

const _logger = debug.extend('BlogPage');
function BlogPage(props) {
    const [blogData, setBlogData] = useState({
        id: 0,
        blogTypeId: 0,
        authorId: 0,
        title: '',
        subject: '',
        content: '',
        isPublished: 0,
        imageUrl: '',
        datePublished: '',
    });

    const { state } = useLocation();
    _logger('blogState', state);
    useEffect(() => {
        if (state?.payload) {
            setBlogData((prevState) => {
                const sp = state.payload;
                const bd = { ...prevState, ...state.payload };
                bd.id = sp.id;
                bd.blogTypeId = sp.blogTypeId;
                bd.authorId = sp.authorId;
                bd.title = sp.title;
                bd.subject = sp.subject;
                bd.imageUrl = sp.imageUrl;
                return bd;
            }, []);
        }
        const id = blogData.id;
        getBlogId(id).then(onGetBlogSuccess).catch(onGetBlogError);
    }, []);

    const onGetBlogSuccess = (response) => {
        _logger('onGetBlogSuccess', response.data.item);
        setBlogData((prevState) => {
            let bd = { ...prevState };
            bd = { ...response.data.item };
            return bd;
        });
    };

    const onGetBlogError = (error) => {
        _logger('onGetBlogError', error);
    };

    _logger('Blog', blogData);

    const getParsedDate = (strDate) => {
        let months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const strSplitDate = String(strDate).split(' ');
        let date = new Date(strSplitDate[0]);
        let dd = date.getDate();
        let mm = date.getMonth() + 1;

        const yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        date = `${months[mm]} ${dd}, ${yyyy}`;

        return date;
    };
    return (
        <React.Fragment>
            <img className="card-img-overlay bg-image" src={blogData.imageUrl} alt="" />
            <div className="container">
                <h1 className="text-center mt-2 blog-page-title">{blogData.title}</h1>

                <div className="container text-center col-10 mt-3">
                    <div className=" col-8 text-center card">
                        <img className="blog-page-image" alt="kommu" src={blogData.imageUrl} />
                    </div>
                    <div className=" text-center   col-3 box1 card rounded ">
                        <div className="blog-post-date ">
                            Posted <em>{getParsedDate(blogData.datePublished)}</em>
                        </div>
                    </div>
                    <div className=" text-center card blog-page-content">{blogData.content}</div>
                    <br />
                    <div className="row"></div>
                </div>

                <Comments
                    className="box2 "
                    currentUser={props.currentUser}
                    entityTypeId={blogData.blogTypeId}
                    entityId={blogData.id}></Comments>
            </div>
        </React.Fragment>
    );
}

BlogPage.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool,
    }),
};

export default BlogPage;
