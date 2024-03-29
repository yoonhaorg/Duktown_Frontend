import { useLocation, useNavigate } from 'react-router-dom';
import community from '../assets/edit.png';
import home from '../assets/home.png';
import unit from '../assets/unit.png';
import community_blue from '../assets/edit_blue2.png';
import home_blue from '../assets/home_blue.png';
import unit_blue from '../assets/unit_blue.png';
import chat from '../assets/chat.png';
import chat_blue from '../assets/chat_blue.png';
import '../css/Bottombar.css';

const BottomBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className='bottom_bar'>
            <ul className='bottom_tabs'>
                <li onClick={() => handleNavigation('/home')}>
                    <img src={location.pathname === '/home' ? home_blue : home} alt="Home" className='bottom_bar_icon'/>
                </li>
                <li onClick={() => handleNavigation('/community?category=daily')}>
                    <img src={location.pathname === '/community' ? community_blue : community} alt="Community" className='community_icon'/>
                </li>
                <li onClick={() => handleNavigation('/chat')}>
                    <img src={location.pathname === '/chat' ? chat_blue : chat} alt="Chat" className='bottom_bar_icon'/>
                </li>
                <li onClick={() => handleNavigation('/unit')}>
                    <img src={location.pathname === '/unit' ? unit_blue : unit} alt="Unit" className='bottom_bar_icon'/>
                </li>
            </ul>
        </nav>
    );
};

export default BottomBar;
