import './App.scss';
import Routes from './pages/Routes'
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { useAuthContext } from './contexts/AuthContext'; 
import { CSpinner } from '@coreui/react';
import logo from 'assets/img/logo.png'
function App() {
  const { isAppLoading } = useAuthContext()

  if (isAppLoading)
    return (
      <div className="loader-container">
        <img src={logo} alt="" />
     <span class="loader">Student-Management-System</span>
      </div>
  )
  return (
    <Routes/>
  );
}

export default App;
