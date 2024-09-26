import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import Settings from "./pages/Setting";
import ForgotPassword from "./pages/ForgotPassword";
import ConfirmPassword from "./pages/ConfirmPassword";
import Navbar from "./components/Navbar";
import { VerifyEmail } from "./pages/VerifyEmail";
import QuesAns from "./pages/QuesAns";
import SecurityAnswers from "./pages/SecurityAnswer";
import { AccountProvider } from "./context/Account";
import UserProfile from "./pages/UserProfile";
import Landing from "./pages/Landing";
import Rooms from "./pages/Rooms";
import Concerns from "./pages/Concerns";
import ConcernChat from "./pages/CocnernChat";
import AddRoom from "./pages/AddRoom";
import BookingHistory from "./pages/BookingHistory";
import RoomDetails from "./pages/RoomDetails";
import KommunicateChat from "./components/KommunicateChat";
import UserStatistics from "./pages/UserStatistics";
import { useEffect } from "react";

const App: React.FC = () => {
  useEffect(()=>{
    console.log(import.meta.env.VITE_COGNITO_USER_POOL_ID)
  })
  return (
    <>
      <AccountProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/confirm-password" element={<ConfirmPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/ques" element={<QuesAns email={""} />} />
            <Route path="/security" element={<SecurityAnswers />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/concerns" element={<Concerns />} />
            <Route path="/concerns/:bookingId" element={<ConcernChat />} />
            <Route path="/room/:roomId" element={<RoomDetails />} />
            <Route path="/addRoom" element={<AddRoom />} />
            <Route path="/bookingHistory" element={<BookingHistory />} />
            <Route path="/user-statistics" element={<UserStatistics />} />
          </Routes>
        </BrowserRouter>
        <KommunicateChat />
      </AccountProvider>
    </>
  );
};

export default App;
