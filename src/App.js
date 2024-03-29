import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoggedOut from "./routes/LoggedOut";
import SignIn from "./routes/SignIn";
import FindId from './routes/FindId';
import FindPassword from './routes/FindPassword';
import Announcement from "./routes/Announcement";
import RepairApply from "./routes/RepairApply";
import Stayout from "./routes/Stayout";
import FindFillIn from "./routes/FindFillIn";
import SignUp from './routes/SignUp';
import Terms from './routes/Terms';
import MyPage from "./routes/MyPage";
import NewPost from "./routes/NewPost";
import RepairHistory from "./routes/RepairHistory";
import RepairHistoryDetail from "./routes/RepairHistoryDetail";
import NoticeList from "./routes/NoticeList";
import NoticeListDetail from "./routes/NoticeListDetail";
import PostView from './routes/PostView';
import DeliveryPostView from './routes/DeliveryPostView';
import ChatRoom from "./routes/ChatRoom";
import MyPostList from "./routes/MyPostList";
import DormGuide from "./routes/DormGuide";
import MyPenalty from "./routes/MyPenalty";
import Penalty from "./routes/Penalty";
import ApplicationTerms from './routes/ApplicationTerms';
import MyUnit from "./routes/MyUnit";
import CleaningHistory from "./routes/CleaningHistory";
import CommunitySearch from './routes/CommunitySearch';
import NewHome from './routes/NewHome';
import Community from './routes/Community';
import ChatRoomList from './routes/ChatRoomList';
import Unit from './routes/Unit';

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  function setScreenSize() {
    let vh = windowSize.height * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    setScreenSize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerHeight]);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoggedOut />}/>
        <Route path='/signup' element={<SignUp />}/>
        <Route path='/terms' element={<Terms />}/>
        <Route path="/signin" element={<SignIn />}/>
        <Route path="/findid" element={<FindId />}/>
        <Route path="/findpassword" element={<FindPassword />}/>
        <Route path="/home" element={<NewHome />}/>
        <Route path="/community" element={<Community />}/>
        <Route path="/chat" element={<ChatRoomList />}/>
        <Route path="/unit" element={<Unit />}/>
        <Route path="/announcement/historys" element={<Announcement />}/>
        <Route path="/repairs/apply" element={<RepairApply />}/>
        <Route path="/stayout" element={<Stayout />}/>
        <Route path="/findFillIn" element={<FindFillIn />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/newpost" element={<NewPost />} />
        <Route path="/repairs/historys" element={<RepairHistory />}/>
        <Route path="/repairs/historys/detail/:id" element={<RepairHistoryDetail />}/>
        <Route path="/notice/list" element={<NoticeList />}/>
        <Route path="/notice/list/detail/:id" element={<NoticeListDetail />}/>
        <Route path="/post/:postId" element={<PostView />}/>
        <Route path="/delivery/:deliveryId" element={<DeliveryPostView />}/>
        <Route path="/chatRoom/:chatRoomId" element={<ChatRoom />}/>
        <Route path="/user/wrote/:type" element={<MyPostList />}/>
        <Route path="/dormGuide" element={<DormGuide />}/>
        <Route path="/user/penalty" element={<MyPenalty />}/>
        <Route path="/penalty" element={<Penalty />}/>
        <Route path="/appTerms" element={<ApplicationTerms />}/>
        <Route path="community/search" element={<CommunitySearch />}/>
        <Route path="/user/unit" element={<MyUnit />}/>
        <Route path="/cleaning" element={<CleaningHistory />}/>
      </Routes>
    </Router>
  );
}

export default App;
