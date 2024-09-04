import axios from 'axios';

export const fetchPayments = async (page, startDate, endDate) => {
    const token = localStorage.getItem('token'); // 저장된 토큰 가져오기

    try {
        const response = await axios.get('/v1/payments', {
            params: {
                page: page - 1,
                startDate: startDate ? startDate.toLocaleDateString('en-CA') : null,
                endDate: endDate ? endDate.toLocaleDateString('en-CA') : null,
            },
            headers: {
                Authorization: token,
            },
        });
        return response.data; // API 응답 데이터를 반환
    } catch (error) {
        console.error('Error fetching payments:', error);
        throw error; // 호출한 쪽에서 에러를 처리할 수 있도록 에러를 던짐
    }
};
