import {useEffect} from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import {jwtDecode} from 'jwt-decode';
import {Outlet, useNavigate} from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const payload = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (payload.exp < currentTime) {
          localStorage.removeItem('jwt');
          navigate('/login');
        } else {
          navigate('/home');
        }
      } catch (error) {
        console.error('Failed to decode token', error);
        localStorage.removeItem('jwt');
        navigate('/login');
      }
    } else {
      localStorage.removeItem('jwt');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div id="app-container" style={{backgroundColor: '#9A7872'}}>
      <div id="content-container">
        <Outlet />
      </div>
      <div id="footer-container">
        <Footer />
      </div>
    </div>
  );
}

export default App;
