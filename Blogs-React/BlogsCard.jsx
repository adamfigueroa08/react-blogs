import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import { Card } from 'react-bootstrap';
import { BsFillTrashFill, BsFillPencilFill, BsFillHandIndexFill } from 'react-icons/bs';

const _logger = debug.extend('ProfileCard');
function BlogsCard(props) {
    const aBlog = props.blog;
    const navigate = useNavigate();

    const onLocalEditCard = () => {
        _logger('editBlog');
        const state = { type: 'update', payload: aBlog };
        navigate(`/blogAddForm/${aBlog.id}/update`, { state });
    };

    _logger('blog passed in prop', aBlog);

    const onLocalclickdeleteCard = () => {
        _logger('deleteBlog', aBlog);
        props.onBlogsClick(props.blog);
    };

    const navToBlogPage = (blog) => {
        const stateForTransport = { type: 'blog_view', payload: blog };
        _logger('navToBlogPage', blog);

        navigate(`/blogPage`, { state: stateForTransport });
    };

    const onReadMore = () => {
        navToBlogPage(aBlog);
    };
    return (
        <React.Fragment>
            <div className=" col-3 row-5 card container  ">
                <div className=" row col container-xl ms-1">
                    <Card className="shadow-lg border rounded  bg-light   mt-2 ">
                        <Card.Title as="h3" className=" mt-4 mb-2">
                            {aBlog.title}
                        </Card.Title>
                        <Card.Img
                            src={aBlog.imageUrl}
                            style={{ height: 300 }}
                            className="rounded card-img-top mt-2 img-fluid "
                        />
                        <Card.Body>
                            <Card.Text className=" mb-4 mt-3" style={{ fontSize: 10 }}>
                                {' '}
                                {aBlog.content}
                            </Card.Text>
                            <div className="d-grid gap-2 col-6 mx-auto ">
                                <BsFillPencilFill
                                    to="/blogAddForm"
                                    type="button"
                                    ablog={aBlog}
                                    onClick={onLocalEditCard}
                                    className="col-3 mb-2 mt-2 me-4  position-relative  position-absolute bottom-0 start-50 translate-middle-x "
                                    style={{ height: 35, width: 35 }}>
                                    edit
                                </BsFillPencilFill>
                                <BsFillTrashFill
                                    style={{ height: 35, width: 35 }}
                                    className=" ms-4  me-4 position-relative position-absolute bottom-0 mb-2 end-50 translate-middle-x"
                                    type="button"
                                    key={`${aBlog.id}`}
                                    ablog={aBlog}
                                    onClick={onLocalclickdeleteCard}>
                                    Delete
                                </BsFillTrashFill>
                                <BsFillHandIndexFill
                                    className=" ms-5  position-relative position-absolute bottom-0 mb-2 start-50 translate-middle-x"
                                    onClick={onReadMore}
                                    style={{ height: 35, width: 35 }}
                                    to="/blogPage"
                                    type="button"
                                    data-page=""
                                    href="#"></BsFillHandIndexFill>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
}

BlogsCard.propTypes = {
    blog: PropTypes.shape({
        id: PropTypes.number,
        imageUrl: PropTypes.string,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        blogTypeId: PropTypes.number,
        isPublished: PropTypes.bool,
        subject: PropTypes.string.isRequired,
    }),
    onBlogsClick: PropTypes.func,
};

export default BlogsCard;
