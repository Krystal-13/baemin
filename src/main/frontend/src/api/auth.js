import axios from 'axios';
import {jwtDecode} from "jwt-decode";

export const login = async (email, password) => {
    try {
        const response = await axios.post('/v1/logIn', {
            email,
            password,
        });

        // 응답 헤더에서 토큰 추출
        const token = response.headers['authorization']; // 헤더에서 'Authorization'을 가져옴

        if (!token) {
            throw new Error('No token found in the response');
        }

        const decodedToken = jwtDecode(token);
        const userRoles = decodedToken.role;

        // 역할 검증
        const hasAccess = Array.isArray(userRoles)
            ? userRoles.includes('ROLE_MASTER') || userRoles.includes('ROLE_MANAGER')
            : userRoles === 'ROLE_MASTER' || userRoles === 'ROLE_MANAGER';

        if (!hasAccess) {
            throw new Error('You do not have permission to access this application.');
        }

        // 토큰을 localStorage에 저장
        localStorage.setItem('token', token);

        return true; // 성공적으로 로그인하면 true 반환
    } catch (error) {
        console.error('Error logging in:', error);
        throw error; // 에러 발생 시 에러를 다시 던짐
    }
};