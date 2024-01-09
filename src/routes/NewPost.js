import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import arrow_left from '../assets/arrow_left.png';
import '../css/NewPost.css';
import AccessTokenContext from '../AccessTokenContext';

function NewPost(){
    const navigate = useNavigate();
    const { accessToken } = useContext(AccessTokenContext);
    const location = useLocation();
    const selectedCategory = new URLSearchParams(location.search).get('selectedCategory');

    const serverUrl = "http://localhost:8080";
    const apiUrl = serverUrl + "/posts";

    const uploadPost = async (event) => {
        event.preventDefault();

        const category = {'일상': 0, '장터': 1}
        const title = event.target['post-title'].value;
        const content = event.target['post-content'].value;

        if(selectedCategory == "배달팟"){
            const orderTime = event.target['orderTime'].value;
            const maxPeople = Number(event.target['maxPeople'].value);
            const accountNumber = event.target['accountNumber'].value;
            try {
                const response = await fetch(serverUrl + "/delivery", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ 
                        "title": title,
                        "orderTime": orderTime,
                        "maxPeople": maxPeople,
                        "accountNumber": accountNumber,
                        "content": content,
                    })
                });
    
                if (response.ok) {
                    console.log("배달팟 등록 성공");
                    navigate('/main');
                } 
                else{
                    return await response.json().then(errorResponse => {
                        console.log(errorResponse);
                        throw new EvalError(errorResponse.errorMessage);
                    });
                }
            } catch (error) {
                alert(error);
            }
        }
        else {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ 
                        "category": category[selectedCategory],
                        "title": title,
                        "content": content,
                    })
                });
    
                if (response.ok) {
                    // 서버 응답이 성공인 경우
                    // 게시글 작성 후 로컬 스토리지에 데이터 저장
                    localStorage.setItem('previousPageInfo', JSON.stringify({
                        page: 'community',
                        category: selectedCategory,
                    }));
                    navigate('/main');
                } 
                else{
                    return await response.json().then(errorResponse => {
                        console.log(errorResponse);
                        throw new EvalError(errorResponse.errorMessage);
                    });
                }
            } catch (error) {
                alert(error);
            }
        }
    };

    return (
        <>
            <div className='title_container'>
                <img className='announcement_icon' src={arrow_left} onClick={()=>{window.history.back();}}></img>
                글쓰기
                <button className='postBtn' type='submit' form='post-form'>작성</button>
            </div>
            <div className='content_container'>
                <p id='post-category'>{selectedCategory}</p>
                <form id='post-form' onSubmit={uploadPost}>
                    <input 
                        id='post-title' 
                        type='text' 
                        placeholder='제목을 입력해주세요'
                    >
                    </input>
                    {selectedCategory === "배달팟" ?
                    <>
                        <div className='deliveryInfo'>
                            <span>최대 모집 인원</span>
                            <input type="number" id='maxPeople'></input>
                        </div>
                        <div className='deliveryInfo'>
                            <span>주문 예정 시각</span>
                            <input type="datetime-local" id='orderTime'></input>
                        </div>
                        <div className='deliveryInfo'>
                            <span>송금 받을 계좌</span>
                            <input type="text" id='accountNumber'></input>
                        </div>
                    </>
                        
                    :
                        <></>
                    }
                    <br/>
                    <textarea 
                        id='post-content' 
                        placeholder='내용을 입력하세요'
                    >
                    </textarea>
                </form>
                
            </div>
        </>
    );
}

export default NewPost;
