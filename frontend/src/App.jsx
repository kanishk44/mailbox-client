import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import MailboxLayout from "./components/MailboxLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inbox" element={<MailboxLayout />} />
        <Route path="/sent" element={<MailboxLayout />} />
        <Route path="/drafts" element={<MailboxLayout />} />
        <Route path="/starred" element={<MailboxLayout />} />
        <Route path="/spam" element={<MailboxLayout />} />
        <Route path="/trash" element={<MailboxLayout />} />
        <Route path="/archive" element={<MailboxLayout />} />
        <Route path="/unread" element={<MailboxLayout />} />
        <Route path="/" element={<Navigate to="/inbox" replace />} />
        <Route path="*" element={<Navigate to="/inbox" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
