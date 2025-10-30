import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import NotificationsPage from "./pages/NotificationsPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnBoardingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
