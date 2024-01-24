import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loggedIn from '../utils';
import Upperbar from '../components/UpperBar';
import BottomBar from '../components/BottomBar';
import announcement from '../assets/announcement_icon.png';
import meal from '../assets/meal_icon.png';
import sleepover from '../assets/sleepover_blue.png';
import repair from '../assets/repair_blue.png';
import notification from '../assets/notification_blue.png';
import circle from '../assets/circle_gray.png';
import '../css/Home.css';
import '../css/NewHome.css';

function NewHome(){
    const navigate = useNavigate();

    useEffect(() => {
        // 토큰이 없을 경우 로그인 페이지로 이동
        if(!loggedIn()){
            alert('로그인이 필요합니다');
            navigate('/signin');
        }
    }, []);

    // 상단바, 하단바 제외 내용 높이 설정
    useEffect(() => {
        const setContentHeight = () => {
            const upperBar = document.querySelector('.upper_bar');
            const bottomBar = document.querySelector('.bottom_tabs');
            const contentContainer = document.querySelector('.center_content_container');
    
            // 요소가 찾아졌는지 확인
            if (upperBar && bottomBar && contentContainer) {
                const upperBarHeight = upperBar.offsetHeight;
                const bottomBarHeight = bottomBar.offsetHeight;
    
                // 상단바와 하단바 사이의 높이로 contentContainer의 높이 설정
                const contentHeight = window.innerHeight - upperBarHeight - bottomBarHeight;
    
                contentContainer.style.height = `${contentHeight - 40}px`;
            }
        };
    
        // 페이지가 로드된 후에 한 번 실행
        setContentHeight();
    
        // 리사이즈 이벤트에 대한 리스너 추가
        window.addEventListener('resize', setContentHeight);
    
        // 컴포넌트가 언마운트될 때 리사이즈 이벤트 리스너를 제거
        return () => {
            window.removeEventListener('resize', setContentHeight);
        };
    }, []); // 빈 배열을 전달하여 한 번만 실행되도록 함
    

    return (
        <>
            <Upperbar searchAvailable={false}/>
            <div className='center_content_container'>
                <div className='flex-menu-container'>
                    <div className='gradient-box flex-item' id='portal-link'
                        onClick={() => {window.open('https://www.duksung.ac.kr/main.do?isMaster=N&isLogined=N&viewPrefix=%2FWEB-INF%2Fjsp%2Fcms&urlRootPath=&siteResourcePath=%2Fsite%2Fduksung', "_blank");}}>
                        <div className='menu-text'>
                            <p className='menu-title'>덕성여자대학교 포털</p>
                            <p className='menu-info'>포털사이트 바로가기</p>
                        </div>
                    </div>
                    <div className='gradient-box flex-item' id='announcement-link'
                        onClick={() => window.open('https://www.duksung.ac.kr/bbs/board.do?menuId=1288&bsIdx=92', '_blank')}>
                        <img className='icon' src={announcement} alt='기숙사 공지사항 아이콘'/>
                        <div className='menu-text'>
                            <p className='menu-title'>공지사항</p>
                            <p className='menu-info'>기숙사 전체 공지 확인하기</p>
                        </div>
                    </div>
                    <div className='gradient-box flex-item' id='meal-link'
                        onClick={() => window.open('https://www.duksung.ac.kr/diet/schedule.do', '_blank')}>
                        <img className='icon' src={meal} alt='오늘의 메뉴 아이콘'/>
                        <div className='menu-text'>
                            <p className='menu-title'>오늘의 메뉴</p>
                            <p className='menu-info'>오늘 학식 뭐 먹을까?</p>
                        </div>
                    </div>
                    <div className='white-box flex-item' id='sleepover'
                        onClick={()=>{navigate('/stayout')}}>
                        <img src={sleepover}/>
                        <p className='menu-title'>외박신청</p>
                    </div>
                    <div className='flex-vertical'>
                        <div className='white-box flex-item' id='repair'
                            onClick={()=>{navigate('/repairs/historys')}}>
                            <img src={repair}/>
                            <p className='menu-title'>수리요청</p>
                        </div>
                        <div className='white-box flex-item' id='notification'
                            onClick={()=>{window.open('https://www.duksung.ac.kr/bbs/board.do?menuId=1289&bsIdx=93&bcIdx=', '_blank')}}>
                            <img src={notification}/>
                            <p className='menu-title'>점호방송</p>
                        </div>
                    </div>
                </div>
                <div className='info-box'>
                    <div className='info-menu' onClick={() => {navigate('/appTerms');}}>
                        <img src={circle}/>
                        <p>이용약관</p>
                    </div>
                    <div className='info-menu'>
                        <a href='https://www.duksung.ac.kr/contents/contents.do?ciIdx=362&menuId=1283' target="_blank">
                            <img src={circle}/>
                            <p>기숙사 규정</p>
                        </a>

                    </div>
                    <div className='info-menu' onClick={() => {navigate('/penalty');}}>
                        <img src={circle}/>
                        <p>벌점 기준표</p>
                    </div>
                </div>
            </div>
            <BottomBar/>
        </> 
    );
}

export default NewHome;
