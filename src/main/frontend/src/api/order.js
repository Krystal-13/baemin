import axios from 'axios';

export const fetchOrders = async (page, searchQuery, statusFilter) => {
    const token = localStorage.getItem('token'); // 저장된 토큰 가져오기

    try {
        const response = await axios.get('/v1/orders', {
            params: {
                page: page - 1,
                search: searchQuery,
                status: statusFilter
            },
            headers: {
                Authorization: token
            }
        });
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error; // 호출한 쪽에서 에러를 처리할 수 있도록 에러를 던짐
    }
};

export const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
    console.log('token : ', token);
    try {
        const response = await axios.patch(`/v1/orders/${orderId}`,{
                cancelRequest: newStatus === 'CANCEL',
                newStatus: newStatus
            },
            {
                headers: {
                    Authorization: token
                }
            });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};
