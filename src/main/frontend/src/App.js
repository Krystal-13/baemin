import './App.css';
import React, {useState} from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <div>
            {isAuthenticated ? (
                <AdminDashboard /> // 로그인 성공 시 보여줄 페이지
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;
