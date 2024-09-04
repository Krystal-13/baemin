import React, {useEffect, useState} from 'react';
import {
    Box,
    IconButton,
    InputAdornment,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {ChevronRight, Search} from '@mui/icons-material';
import OrderDetailsDialog from './OrderDetailsDialog';
import {fetchOrders} from "../api/order";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchOrders(page, searchQuery, statusFilter);
                setOrders(data.content || []);
                setTotalPages(data.page.totalPages);
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        };

        loadOrders();
    }, [page, searchQuery, statusFilter]);

    const handleStatusUpdated = (updatedStatus) => {
        setIsDialogOpen(false);
        // 주문 목록을 다시 가져오거나 업데이트된 주문만 수정
        const updatedOrders = orders.map(o =>
            o.orderId === selectedOrder.orderId ? { ...o, status: updatedStatus } : o
        );
        setOrders(updatedOrders);
    };

    const handleOpenDialog = (order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedOrder(null);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // 검색어 변경 시 상태 업데이트
        setPage(1); // 검색 시 페이지를 첫 페이지로 리셋
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value); // 상태 필터 변경 시 상태 업데이트
        setPage(1); // 상태 변경 시 페이지를 첫 페이지로 리셋
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    displayEmpty
                    renderValue={(selected) => {
                        if (!selected) {
                            return (
                                <Typography sx={{ color: 'rgba(0, 0, 0, 0.5)' }}>Status</Typography>
                            );
                        }
                        return selected;
                    }}
                    sx={{ width: '200px' }}
                >
                    <MenuItem>All Status</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="CONFIRM">Confirm</MenuItem>
                    <MenuItem value="CANCEL">Cancel</MenuItem>
                </Select>
                <TextField
                    label="Search Orders"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: '300px' }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Address</TableCell>
                                <TableCell>Order Type</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.orderId}>
                                    <TableCell>{order.address}</TableCell>
                                    <TableCell>{order.orderType}</TableCell>
                                    <TableCell>{order.totalPrice} 원</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpenDialog(order)}>
                                            <ChevronRight />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Pagination Component */}
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
            />

            {/* Order Details Dialog */}
            <OrderDetailsDialog
                order={selectedOrder}
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onStatusUpdated={handleStatusUpdated}
            />
        </Box>
    );
};

export default OrdersTable;