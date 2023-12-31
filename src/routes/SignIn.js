import React, { useContext } from 'react';
import AccessTokenContext from '../AccessTokenContext';
import '../css/Sign.css';
import arrow_left from '../assets/arrow_left.png';
import { useNavigate } from 'react-router-dom';

function SignIn(){
    const navigate = useNavigate();
    const { setAccessToken } = useContext(AccessTokenContext);
    const serverUrl = "http://localhost:8080";

    // 로그인
    function handleSignIn(event) {
        event.preventDefault();

        const apiUrl = serverUrl + "/auth/login";
        const id = event.target.id.value;
        const pwd = event.target.pwd.value;

        const userData = {
            "loginId": id, 
            "password": pwd
        }
        const request = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData),
        };

        fetch(apiUrl, request)
            .then((response) => {
                if(!response.ok){
                    return response.json().then(errorResponse => {
                        throw new EvalError(errorResponse.errorMessage);
                    });
                }
                return response.json();
            })
            .then(data => {
                const roleType =data.roleType;
                const accessToken = data.accessToken;
                const refreshToken = data.refreshToken;
                setAccessToken(accessToken);
                navigate('/main');
            })
            .catch((error) => {
                alert(error);
            });
    }

    return(
        <>
            <div className="title_container">
                <img className='backBtn' src={arrow_left} alt="뒤로가기" onClick={()=>{navigate('/');}}></img>
                로그인
            </div>
            <form className="signin_form" onSubmit={handleSignIn}>
                <div className='content_container'>
                    <p>아이디</p>
                    <input className="sign_input" type="text" name="id" placeholder="6~12자 영문, 숫자 조합"/>
                    <br/>
                    <p>비밀번호</p>
                    <input className="sign_input" type="text" name="pwd" placeholder="8자 이상 영문, 숫자 조합"/>
                    <div className='otherLink'>
                        <span className='black_link' onClick={() => navigate('/findid')}>아이디 찾기</span>|
                        <span className='black_link' onClick={() => navigate('/findpassword')}>비밀번호 찾기</span>|
                        <span className='blue_link' onClick={() => navigate('/signup')}>회원가입</span>
                    </div>
                </div>
                <button type="submit" className='bottomBtn'>
                    로그인하기
                </button>
            </form>
        </>
    )
}

export default SignIn;