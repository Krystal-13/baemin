import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import {CalendarToday, ChevronRight, Clear} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {fetchPayments} from "../api/payment";

const CustomDateInput = React.forwardRef(({ value, onClick, label, onClear }, ref) => (
    <TextField
        label={label}
        value={value}
        onClick={onClick}
        ref={ref}
        fullWidth
        variant="outlined"
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    {value && (
                        <IconButton size="small" onClick={onClear}>
                            <Clear />
                        </IconButton>
                    )}
                    <CalendarToday />
                </InputAdornment>
            ),
        }}
        sx={{
            cursor: 'pointer',
            backgroundColor: 'white',
            height: '56px', // TextField의 높이 고정
            minWidth: '150px', // 최소 너비 고정
        }}
    />
));

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        loadPayments();
    }, [page, startDate, endDate]); // 페이지, 시작 날짜, 종료 날짜 변경 시에 fetchPayments 호출

    const loadPayments = async () => {
        try {
            const data = await fetchPayments(page, startDate, endDate);
            setPayments(data.content || []);
            setTotalPages(data.page.totalPages);
        } catch (error) {
            console.error('Error loading payments:', error);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = () => {
        setPage(1);
        loadPayments(); // Search 버튼 클릭 시 서버 요청 실행
    };

    const handleClearStartDate = () => {
        setStartDate(null);
    };

    const handleClearEndDate = () => {
        setEndDate(null);
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="flex-end" mb={2} gap={2}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        customInput={<CustomDateInput label="Start Date" onClear={handleClearStartDate}/>}
                        dateFormat="yyyy-MM-dd"
                        popperPlacement="bottom-end"
                        popperContainer={({ children }) => <div>{children}</div>}
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        customInput={<CustomDateInput label="End Date" onClear={handleClearEndDate}/>}
                        dateFormat="yyyy-MM-dd"
                        popperPlacement="bottom-end"
                        popperContainer={({ children }) => <div>{children}</div>}
                    />
                </Box>
                <Button variant="contained" color="primary" onClick={handleSearch} sx={{ height: '56px' }}>
                    Search
                </Button>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Card Number</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.paymentId}>
                                    <TableCell>{payment.paymentId}</TableCell>
                                    <TableCell>{payment.totalPrice} 원</TableCell>
                                    <TableCell>{payment.payDate}</TableCell>
                                    <TableCell>{payment.cardNumber}</TableCell>
                                    <TableCell>{payment.status}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary">
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
        </Box>
    );
};

export default PaymentManagement;