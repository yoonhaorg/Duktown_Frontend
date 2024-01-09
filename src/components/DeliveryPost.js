import React from 'react';
import comment_icon from '../assets/comment.png';
import { useNavigate } from 'react-router-dom';


function DeliveryPost({ userId, deliveryId, title, createdAt, maxPeople, orderTime, content, peopleCount, commentCount, active }) {

    const navigate = useNavigate();

    const handlePostClick = () => {
        navigate(`/delivery/${deliveryId}`, {
            state: { deliveryId }
        });
    };
    
    return (
        <div className="post" onClick={handlePostClick}>
        <p className="post-title">{title}</p>
        <p className="post-content">{content}</p>
        <table className='recruitment-info'>
            <tr>
                <td>주문 예정 시각</td>
                <td>{orderTime}</td>
            </tr>
            <tr>
                <td>최대 모집 인원</td>
                <td>{maxPeople}명</td>
            </tr>
        </table>
        <div className='recruitment-details'>
            <span className="post-recruitment">{peopleCount}/{maxPeople}</span>
            <img src={comment_icon}/><span className="post-comments">{commentCount}</span>
            <span className="post-time">| {createdAt}</span>
        </div>
        <hr/>
        </div>
    );
}

export default DeliveryPost;
