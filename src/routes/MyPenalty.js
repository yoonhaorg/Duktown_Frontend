import React, {useEffect, useState} from "react";
import arrow_left from "../assets/arrow_left.png";
import information_icon from "../assets/information.png";
import '../css/MyPenalty.css';
import {useNavigate} from "react-router-dom";
import ListView from "../components/ListView";
function MyPenalty() {
    const navigate = useNavigate();
    const [point, setPoint] = useState(null);
    const [pointHistory, setPointHistory] = useState([]);
    const accessToken = localStorage.getItem('accessToken');
    const serverUrl = process.env.REACT_APP_BASEURL;

    useEffect(() => {
        if (accessToken === '' || accessToken === undefined || accessToken === null) {
            navigate('/signin');
        }

        const apiUrl = serverUrl + '/my/penaltyPoints';
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    if (response.errorMessage.includes('Token') || response.errorMessage === undefined) {
                        window.open('http://localhost:3000/signin', '_self');
                    } else {
                        throw new EvalError(response.errorMessage);
                    }
                }
            })
            .then((data) => {
                console.log(data);
                if (data.totalPenaltyPoint === null) {
                    setPoint(0);
                } else {
                    setPoint(data.totalPenaltyPoint);
                }
                setPointHistory(data.penaltyPointsList);
            })
            .catch((errorResponse) => {
                if (errorResponse.errorMessage.includes('Token') || errorResponse.errorMessage === undefined) {
                    window.open('http://localhost:3000/signin', '_self');
                } else {
                    throw new EvalError(errorResponse.errorMessage);
                }
            });
    }, []);

    return (
        <>
            <div className='myPenalty_title_container'>
                <div className='myPenalty_title_horizontal_container'>
                    <img className='myPenalty_title_icon' src={arrow_left} alt="뒤로 가기" onClick={()=>{navigate('/myPage');}}/>
                    벌점 관리
                </div>
                <img className='myPenalty_info_icon' src={information_icon} alt="벌점 기준 보기" onClick={()=>{navigate('/penalty');}}/>
            </div>
            <div className='myPenalty_body_container'>
                <div className='myPenalty_total_container'>
                    이번 학기 총 벌점
                    <div className='myPenalty_total_score'>{point<10 ? `0${point}점` : `${point}점`}</div>
                </div>
                <div className='myPenalty_list_container'>
                    <ListView
                        tableFor='myPenalty'
                        items={pointHistory}
                    />
                </div>
            </div>
        </>
    );
}

export default MyPenalty;