import React from 'react';
import Navbar from '../components/Navbar.js';
import Bottombar from '../components/Bottombar.js';
import repair from '../assets/repair.png';
import register from '../assets/register.png';
import sleepover from '../assets/sleepover.png';
import announcement from '../assets/announcement.png';
import '../css/Home.css';

function Home(){
    return (
        <>
            <Navbar />
            <div className='content-container'>
                <p className='board_title'>공지사항</p>
                <div className='board'>
                    내용
                </div>
                <p className='board_title'>오늘의 메뉴</p>
                <div className='board'>
                    내용
                </div>
                <div className='menu-container'>
                    <div className='menu'>
                        <img src={repair} className='menu_icon'/>
                        수리 요청
                    </div>
                    <div className='menu'>
                        <img src={register} className='menu_icon'/>
                        입사 신청
                    </div>
                    <div className='menu'>
                        <img src={sleepover} className='menu_icon'/>
                        외박 신청
                    </div>
                    <div className='menu'>
                        <img src={announcement} className='menu_icon'/>
                        점호 방송
                    </div>
                </div>
                
            </div>
            <Bottombar />
        </> 
    );
}

export default Home;
