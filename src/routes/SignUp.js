import React, { useState, useEffect, useContext } from 'react';
import AccessTokenContext from '../AccessTokenContext';
import '../css/Sign.css';
import arrow_left from '../assets/arrow_left.png';
import file from '../assets/file.png';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const navigate = useNavigate();
    const { setAccessToken } = useContext(AccessTokenContext);
    const [currentPage, setCurrentPage] = useState('terms'); // 초기 페이지: 약관 동의
    const [emailChecked, setEmailChecked] = useState(false); // 초기 상태: 이메일 확인 안됨
    const [emailValue, setEmailValue] = useState(''); // 이메일 값 저장
    const [idCheckResult, setIdCheckResult] = useState(''); // 아이디 중복 확인
    const [passwordCheck, setPasswordCheck] = useState(''); // 비밀번호 일치 확인
    
    // useEffect를 사용하여 DOM 요소에 접근
    useEffect(() => {
        // DOM 요소에 접근
        const allTermsCheckbox = document.querySelector('#allTermsCheckbox');
        const personalInfoCheckbox = document.querySelector('#personalInfoCheckbox');
        const thirdPartyInfoCheckbox = document.querySelector('#thirdPartyInfoCheckbox');

        // 이용약관 전체 동의 체크박스가 변경될 때 이벤트 리스너 추가
        if (allTermsCheckbox) {
            allTermsCheckbox.addEventListener('change', function() {
                const isChecked = allTermsCheckbox.checked;
                personalInfoCheckbox.checked = isChecked;
                thirdPartyInfoCheckbox.checked = isChecked;
            });
        }
    }, []);

    const serverUrl = "http://localhost:8080"; // 서버 주소

    // 모든 약관 동의 시에만 이메일 페이지로 전환
    function agreementCheck(event){ 
        event.preventDefault();
        const personalInfoCheckbox = document.querySelector('#personalInfoCheckbox');
        const thirdPartyInfoCheckbox = document.querySelector('#thirdPartyInfoCheckbox');
        if(personalInfoCheckbox.checked === true && thirdPartyInfoCheckbox.checked === true){
            setCurrentPage('email');
        }
        else{
            alert('모든 약관에 동의해주세요');
        }
    }

    // 이메일 인증 요청
    function emailCheck(event) {
        console.log("emailCheck, send code");
        event.preventDefault();
        const apiUrl = serverUrl + "/auth/email";
        const email = event.target.email.value
        setEmailValue(email); // 이메일 값 저장

        const request = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 'email': email }),
        };

        fetch(apiUrl, request)
            .then((response) => {
                // if(!response.ok){
                //     alert("잘못된 이메일 형식입니다");
                //     return;
                // }
                return response.json();
            })
            .then((response) => {
                // 백엔드 응답 처리
                if (response.isDuplicated){
                    alert("이미 사용중인 이메일입니다");
                }
                else{
                    setEmailChecked(true);
                }
            })
            .catch((error) => {
                console.error(error.message);
            });
    }

    // 이메일 인증 코드 확인
    function codeCheck(event){
        event.preventDefault();
        const apiUrl = serverUrl + "/auth/email/cert";
        const cert_code = event.target.cert_code.value;
        const userData = {
            "email": emailValue,
            "certCode": cert_code
        };
        const request = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData),
        };

        fetch(apiUrl, request)
            .then((response) => {
                if(response.ok){
                    alert("인증 성공");
                    setCurrentPage("signup");
                }
                else{
                    return response.json().then(errorResponse => {
                        throw new EvalError(errorResponse.errorMessage);
                    });
                }
            })
            .catch((error) => {
                alert(error);
        });
    }

    // 아이디 중복 확인
    const idCheck = async () => {
        const apiUrl = serverUrl + "/auth/id/duplicate";
        const id = document.getElementsByName('id')[0].value;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loginId: id }) // 아이디를 서버에 전달
            });

            if (response.ok) {
                // 서버 응답이 성공인 경우
                const data = await response.json();
                console.log('중복 확인 결과:', data);
                if(data.isDuplicated){
                    setIdCheckResult('이미 사용중인 아이디예요');
                }
                else{
                    setIdCheckResult('사용 가능한 아이디예요');
                }
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

    // 회원가입
    function handleSignUp(event) {
        event.preventDefault();
        const apiUrl = serverUrl + "/auth/signup"
        const id = event.target.id.value;
        const pwd = event.target.pwd.value;
        const pwd_check = event.target.pwd_check.value;

        if(pwd !== pwd_check){
            setPasswordCheck('비밀번호를 다시 확인해주세요');
            return;
        }
        else{
            setPasswordCheck(null)
        }

        const userData = {
            "loginId": id,
            "email": emailValue,
            "password": pwd
        }
        const request = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData),
        };

        fetch(apiUrl, request)
            .then((response) => response.json())
            .then((data) => {
                // 백엔드에서 회원가입에 대한 응답을 처리
                console.log('회원가입 성공', data);
                const accessToken = data.accessToken;
                const refreshToken = data.refreshToken;
                setAccessToken(accessToken);
                setCurrentPage('authentication');
            })
            .catch((error) => {
                console.error('회원가입 실패', error);
            });
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'terms':
                return (
                    <>
                        <div className="signup_content">
                            <div className='term_title'>
                                <p className='blue_title'>반가워요!</p> 
                                <p className='blue_title'>덕타운에 입주하려면</p>
                                <p className='blue_title'>약관 동의가 필요해요</p>
                            </div>
                            <form className="term_check">
                                <div className='term_line'>
                                    <span className='term_big'>이용약관 전체 동의</span>
                                    <input className='round_checkbox' id="allTermsCheckbox" type='checkbox'></input>
                                </div>
                                <hr></hr>
                                <div className='term_line'>
                                    <span className='term_small'>개인정보 수집제공 동의 </span>
                                    <span className='blue_text'>필수</span>
                                    <input className='round_checkbox' id="personalInfoCheckbox" type='checkbox'></input>
                                </div>
                                <div className='term_line'>
                                    <span className='term_small'>제 3자 정보제공 동의 </span>
                                    <span className='blue_text'>필수</span>
                                    <input className='round_checkbox' id="thirdPartyInfoCheckbox" type='checkbox'></input>
                                </div>
                            </form>
                            {/* 회원가입 하기 버튼을 누르면 setCurrentPage('email')를 호출하여 페이지를 변경 */}
                        </div>
                        <button className='bottomBtn' onClick={agreementCheck}>회원가입 하기</button>
                    </>
                );
            case 'email':
                return (
                    <>
                    <div className="signup_content">
                        <p className='blue_title'>덕우만 입주할 수 있어요!</p>
                        <p className='gray_title'>덕성 이메일 인증이 필요해요.</p>
                        <br/><br/>
                        <form className="signup_form" id="signupForm" onSubmit={emailCheck}>
                            <p>덕성 이메일</p>
                            <input className="sign_input" type="email" name="email" placeholder='duktown@duksung.ac.kr'/>
                            {/* 이메일 인증 완료 시 setCurrentPage('authentication')를 호출하여 페이지를 변경 */}
                            {!emailChecked ? 
                                <button type="submit" className='emailAuthBtn'>이메일로 인증 보내기</button> 
                                :
                                <></>
                            }
                        </form>
                        {!emailChecked ? 
                            null
                            :
                            <>
                                <form id="codeForm" onSubmit={codeCheck}>
                                    <input type="text" name="cert_code" placeholder='이메일로 발송된 인증번호를 입력하세요'></input>
                                </form>
                                <div className='cert_error'>
                                    <span>인증번호가 안 왔어요! &nbsp;</span>
                                    <button type="submit" id="blue_link" form='signupForm'>인증번호 다시 보내기</button>
                                </div>
                            </>
                        }
                    </div>
                    {!emailChecked ?
                        <></>
                        :
                        <button type="submit" form="codeForm" className='bottomBtn'>인증하기</button>
                    }
                    </>
                );
                case 'signup':
                    return (
                        <>
                            <div className="title_container">
                                <img className='backBtn' src={arrow_left} alt="뒤로 가" onClick={() => setCurrentPage('email')}></img>
                                회원가입
                            </div>
                            <form className="signup_form" onSubmit={handleSignUp}>
                                <div className='signup_content'>
                                    <p>아이디</p>
                                    <div className="inputFlexContainer">
                                        <input type="text" className='noLineInput' name="id" placeholder="6~12자 영문, 숫자 조합"></input>
                                        <span id="inputCheckBtn" onClick={idCheck}>중복확인</span>
                                    </div>
                                    {idCheckResult !== '' ? <p id="blueResultText">{idCheckResult}</p> : null}
                                    <p>비밀번호</p>
                                    <input className="sign_input" type="password" name="pwd" placeholder="8자 이상 영문, 숫자 조합"/>
                                    <p>비밀번호 확인</p>
                                    <input className="sign_input" type="password" name="pwd_check" placeholder="다시 한 번 입력해주세요"/>
                                    {passwordCheck !== '' ? <p id="redResultText">{passwordCheck}</p> : null }
                                </div>
                                <button type="submit" className='bottomBtn'>덕타운 시작하기</button>
                            </form>
                        </>
                    );
            case 'authentication':
                return (
                    <>
                        <div className="title_container">
                            <img className='backBtn' src={arrow_left} onClick={() => setCurrentPage('signup')} alt="뒤로 가"></img>
                            사생 인증
                        </div>
                        <div className='content_container'>
                            <p className='blue_title'>사생 인증 후 더 많은</p>
                            <p className='blue_title'>서비스를 즐기실 수 있어요</p>
                            <p className='gray_title'>인증 처리는 약 1일~3일 소요돼요</p>  
                            <br/>
                            <form className="signup_form">
                                <p>이름</p>
                                <input type="text" name="name" placeholder="실명을 입력해주세요"></input>
                                <p>학번</p>
                                <input type="text" name="sid" placeholder="ex) 20230000"></input>
                                <p>기숙사 정보</p>
                                <div className='dormInfo'>
                                    <select name='dorm' className='dorm_select'>
                                        <option value='가온1관'>가온1관</option>
                                        <option value='가온2관'>가온2관</option>
                                        <option value='국제관'>국제관</option>
                                    </select>
                                    <input className='input_box' type="text" name="roomNumber"></input>
                                    <span>호</span>
                                </div>
                                <br/>
                                <p>덕성 포털 스크린 샷</p>
                                <div className='screenShot'>
                                    <img src={file} alt="포털 스크린샷 시"/>
                                </div>
                                    <div className='screenShotInstruction'>
                                    <p className='grayText'>덕성여대 포털시스템 &gt; 통합정보시스템 &gt; 학적 &gt; 개인정보변경 스크린 샷</p>
                                    <p className='blueText'>이름, 학번, 기숙사 정보가 모두 들어간 사진만 인증 가능</p>
                                    <p className='blueText'>입력한 이름, 학번, 기숙사 정보와 첨부 사진 속 정보가 일치해야 인증 가능</p>
                                </div>
                            </form>
                        </div>
                        <button className='bottomBtn' onClick={()=>{navigate('/main')}}>
                        사생 인증하기
                        </button>
                    </>
                );
                default:
            return null;
        }
    };
    return (
        <>
            {renderPage()}
        </>
    );
}
export default SignUp;