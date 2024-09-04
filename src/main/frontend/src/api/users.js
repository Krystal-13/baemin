import axios from 'axios';
export const fetchUsers = async () => {
    const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
    try {
        const response = await axios.get('/v1/members/page', {
            headers: {
                Authorization: token,
            },
        });
        return response.data.content;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const updateUser = async (updatedEmail, updatedRole) => {
    const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
    try {
        const response = await axios.patch('/v1/members/update', {
            email: updatedEmail,
            roleCode: updatedRole,
        }, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // 수정된 사용자 데이터를 반환
    } catch (error) {
        console.error('Error updating user:', error);
        return null; // 오류 발생 시 null 반환
    }
};

export const deleteUser = async (email) => {
    const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
    try {
        await axios.delete(`/v1/members/delete/${email}`, {
            headers: {
                Authorization: token,
            },
        });
        // 삭제 후 사용자 목록 갱신
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
};
