import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AccessTokenContext from '../AccessTokenContext';
import arrow_left from '../assets/arrow_left.png';
import function_button from '../assets/function_button.png';
import '../css/PostView.css';
import like_icon from '../assets/like.png';
import comment_icon from '../assets/comment.png';
import profile_image from '../assets/profile_image.png';
import post_button from '../assets/post_button.png';
import Comment from '../components/Comment';

function PostView() {
    const location = useLocation();
    const id = location.state.id; // URL의 state 속성을 가져옴
    const category_name = {0: '일상', 1: '장터'}
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState({
        userId: '',
        category: '',
        title: '',
        content: '',
        liked: false,
        likeCount: 0,
        commentCount: 0,
        datetime: ''
    });

    const { accessToken } = useContext(AccessTokenContext);

    const serverUrl = "http://localhost:8080";
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    var userId, category, title, content, liked, likeCount, commentCount, datetime;

    const fetchPost = async () => {
        fetch(serverUrl + '/posts' + `/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Authorization': `Bearer ${accessToken}`,
            },
            method: 'GET',
        })
        .then(response => response.json())  // JSON을 파싱하기 위해 response.json()을 사용
        .then(data => {
            setPost({
                userId: data.userId,
                category: data.category,
                title: data.title,
                content: data.content,
                liked: data.liked,
                likeCount: data.likeCount,
                commentCount: data.commentCount,
                datetime: data.datetime
            });
        })
        .catch(error => console.error('Error:', error));
    }

    const fetchComments = async () => {
        
        fetch(serverUrl + "/comments" +`?postId=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Authorization': `Bearer ${accessToken}`,
            },
            method: 'GET',
        })
        .then(response => response.json())  // JSON을 파싱하기 위해 response.json()을 사용
        .then(data => {
            setComments(data.content);
        })
        .catch(error => console.error('Error:', error));
    };

    const postComment = async (event) => {
        event.preventDefault();
        const content = event.target['comment-input'].value;

        try {
            const response = await fetch(serverUrl + "/comments", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ 
                    "postId": id,
                    "content": content,
                    "parentCommentId": replyToCommentId // 대댓글이면 어떤 댓글에 대한 대댓글인지 식별
                })
            });

            if (response.ok) {
                // 서버 응답이 성공인 경우
                fetchComments();
            } 
            else{
                return await response.json().then(errorResponse => {
                    throw new EvalError(errorResponse.errorMessage);
                });
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleLike = async () => {
        try {
            const response = await fetch(serverUrl + "/likes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ 
                    "postId": id,
                    "commentId": null,
                })
            });

            if (response.ok) {
                fetchPost();
            } 
            else{
                return response.json().then(errorResponse => {
                    throw new EvalError(errorResponse.errorMessage);
                });
            }
        } catch (error) {
            alert(error);
        }
    };
    
    useEffect(() => {
        fetchPost();
        fetchComments();
    }, []);

    return (
        <>
            <div className='title_container'>
                <img className='announcement_icon' src={arrow_left} onClick={()=>{window.history.back();}}></img>
                {category_name[post.category]}
            </div>
            <div className='content_container'>
                <div id='upperInfo'>
                    <img id='profileImage' src={profile_image} />
                    <table id='nameAndTime'>
                        <tr id='userName'>익명</tr>
                        <tr id='post-time'>{post.datetime}</tr>    
                    </table>
                    <button className='functionBtn' type='submit' form='post-form'>
                        <img src={function_button}/>
                    </button>
                </div>
                
                <p className="post-title">{post.title}</p>
                <p className="post-content">{post.content}</p>
                <div className="post-details">
                    <img src={like_icon} onClick={handleLike}/><span className="post-likes">{post.likeCount}</span>
                    <img src={comment_icon}/><span className="post-comments">{post.commentCount}</span>
                </div>
                <hr/>
                <div className='comments'>
                {comments && comments.length > 0 ? (
                    <div id="commentList">
                        {comments.map((comment) => {
                            return (
                                <Comment
                                    commentId={comment.commentId}
                                    userId={comment.userId}
                                    content={comment.content}
                                    liked={comment.liked}
                                    likeCount={comment.likeCount}
                                    dateTime={comment.dateTime}
                                    deleted={comment.deleted}
                                    childComments={comment.childComments}
                                    setReplyToCommentId={setReplyToCommentId}
                                    fetchComments={fetchComments}
                                />
                            );
                        })}
                    </div>
                    ) : (
                    <></>
                )}
                </div>
            </div>
            <div className='bottom_bar'>
                <div id='postComment'>
                    <form id='commentForm' onSubmit={postComment}>
                        <input id='comment-input' placeholder='댓글을 입력하세요'></input>
                        <button id='postBtn' type='submit'>
                            <img src={post_button}/>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PostView;
