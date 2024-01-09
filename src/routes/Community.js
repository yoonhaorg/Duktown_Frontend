import React, { useState, useEffect, useContext } from 'react';
import AccessTokenContext from '../AccessTokenContext';
import DeliveryPost from '../components/DeliveryPost';
import GeneralPost from '../components/GeneralPost';
import '../css/Community.css';
import plus from '../assets/plus_icon.png';
import { useNavigate } from 'react-router-dom';

function Community() {
    const navigate = useNavigate();
    const { accessToken } = useContext(AccessTokenContext);

    // 게시글 목록과 선택된 카테고리를 관리할 상태 변수
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('일상'); // 초기 카테고리 설정

    const serverUrl = "http://localhost:8080";
    const apiUrl = serverUrl + "/posts";
    const categoryNumber = {'일상': 0, '장터': 1};

    // 카테고리 변경 시, 해당 카테고리의 글들을 가져오는 함수
    const fetchPostsByCategory = async () => {
        if(selectedCategory == '배달팟'){
            fetch(serverUrl + '/delivery', {
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
                setPosts(data.content);
            })
            .catch(error => console.error('Error:', error));
        }
        else {
            fetch(apiUrl+`?category=${categoryNumber[selectedCategory]}`, {
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
                setPosts(data.content);
            })
            .catch(error => console.error('Error:', error));
        }
        
    };

    // 선택된 카테고리 변경 시, 글들을 다시 불러옴
    useEffect(() => {
        // 이전 페이지의 상태를 로컬 스토리지에서 불러오기
        const previousPageInfo = JSON.parse(localStorage.getItem('previousPageInfo'));

        // 이전 페이지의 정보가 있다면 해당 정보를 사용하여 렌더링
        if (previousPageInfo) {
            if (previousPageInfo.category) {
                // 페이지가 Community인 경우의 처리 로직
                setSelectedCategory(previousPageInfo.category);
            }
        }

        if (selectedCategory) {
            fetchPostsByCategory();
        }
    }, [selectedCategory]);

    // 카테고리를 선택할 때 호출되는 함수
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    return (
        <>
        <div className='category'>
            <button 
                onClick={() => handleCategorySelect('배달팟')} 
                style={{ borderColor: selectedCategory === '배달팟' ? '#6A9CFD' : '#E6E6E6' }}>
                    배달팟
            </button>
            <button 
                onClick={() => handleCategorySelect('일상')}
                style={{ borderColor: selectedCategory === '일상' ? '#6A9CFD' : '#E6E6E6' }}>
                일상
            </button>
            <button 
                onClick={() => handleCategorySelect('장터')}
                style={{ borderColor: selectedCategory === '장터' ? '#6A9CFD' : '#E6E6E6' }}>
                장터
            </button>
        </div>
        <hr/>
        {posts && posts.length > 0 ? (
            <div className="post_list">
                {posts.map((post) => {
                // 카테고리에 따라 다른 컴포넌트 렌더링
                return selectedCategory === '배달팟' ? (
                    <DeliveryPost
                        userId={post.userId}
                        deliveryId={post.deliveryId}
                        title={post.title}
                        createdAt={post.createdAt}
                        maxPeople={post.maxPeople}
                        orderTime={post.orderTime}
                        content={post.content}
                        peopleCount={post.peopleCount}
                        commentCount={post.commentCount}
                        active={post.active}
                    />
                ) : (
                    <GeneralPost
                        category={post.category}
                        commentCount={post.commentCount}
                        content={post.content}
                        datetime={post.datetime}
                        id={post.id}
                        likeCount={post.likeCount}
                        liked={post.liked}
                        title={post.title}
                        userId={post.userId}
                    />
                );
                })}
            </div>
            ) : (
            <div>게시글이 없습니다</div>
        )}
        <button className='newPostBtn' onClick={()=>{navigate(`/newpost?selectedCategory=${selectedCategory}`)}}>
                <img src={plus}/>
                글쓰기
        </button>
        </>
    );
}

export default Community;
