import './App.scss';
import Routes from './pages/Routes'
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { useAuthContext } from './contexts/AuthContext'; 
import { CSpinner } from '@coreui/react';

function App() {
  const { isAppLoading } = useAuthContext()

  if (isAppLoading)
    return (
      <div className="loader-container">
       <CSpinner color="success" variant="grow" />
      </div>
  )
  return (
    <Routes/>
  );
}

export default App;
