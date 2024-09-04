import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { updateOrderStatus } from '../api/order';

const OrderDetailsDialog = ({ order, isOpen, onClose, onStatusUpdated }) => {
    const [status, setStatus] = useState(order ? order.status : '');

    useEffect(() => {
        if (order) {
            setStatus(order.status); // order가 있을 때만 상태를 업데이트
        }
    }, [order]);

    if (!order) {
        return null; // order가 null이거나 undefined일 경우, 아무것도 렌더링하지 않음
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleSaveStatus = async () => {
        try {
            // 주문 상태 업데이트 API 호출
            await updateOrderStatus(order.orderId, status);
            alert('Order status updated successfully');
            onStatusUpdated(status); // 부모 컴포넌트에 상태가 업데이트되었음을 알림
            onClose(); // 다이얼로그 닫기
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
                {order && (
                    <>
                        <DialogContentText>
                            <strong>Order ID:</strong> {order.orderId}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Address:</strong> {order.address}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Order Type:</strong> {order.orderType}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Order Request:</strong> {order.orderRequest}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Delivery Request:</strong> {order.deliveryRequest}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Total Price:</strong> {order.totalPrice} 원
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Store ID:</strong> {order.storeId}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Payment ID:</strong> {order.paymentId}
                        </DialogContentText>

                        {/* 주문 상태 변경을 위한 Select 컴포넌트 */}
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status}
                                onChange={handleStatusChange}
                                label="Status"
                            >
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="CONFIRM">Confirm</MenuItem>
                                <MenuItem value="CANCEL">Cancel</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Order Products
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.orderProducts.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.amount} 개</TableCell>
                                            <TableCell>{product.price} 원</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {/* 상태 변경 저장 버튼 */}
                <Button onClick={handleSaveStatus} color="primary" variant="contained">
                    Save Status
                </Button>
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog;
