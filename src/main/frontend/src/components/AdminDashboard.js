import React, {useState} from 'react';
import {Box, Drawer, List, ListItem, ListItemText, Typography} from '@mui/material';
import UsersTable from './UsersTable';
import PaymentsTable from './PaymentsTable';
import OrdersTable from "./OrdersTable";
import OrdersChart from "./OrdersChart";

function AdminDashboard() {
    const [selectedMenu, setSelectedMenu] = useState('Management Console');

    const getPageTitle = () => {
        switch (selectedMenu) {
            case 'Users':
                return '회원 정보';
            case 'Orders':
                return '주문 정보';
            case 'Payments':
                return '결제 정보';
            default:
                return 'Management Console';
        }
    };

    const renderContent = () => {
        switch (selectedMenu) {
            case 'Users':
                return <UsersTable />;
            case 'Orders':
                return <OrdersTable />;
            case 'Payments':
                return <PaymentsTable />;
            default:
                return <OrdersChart />;
        }
    };

    return (
        <Box display="flex">
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <List>
                    <ListItem button onClick={() => setSelectedMenu('Management Console')}>
                        <ListItemText primary="Management Console" />
                    </ListItem>
                    <ListItem button onClick={() => setSelectedMenu('Users')}>
                        <ListItemText primary="Users" />
                    </ListItem>
                    <ListItem button onClick={() => setSelectedMenu('Orders')}>
                        <ListItemText primary="Orders" />
                    </ListItem>
                    <ListItem button onClick={() => setSelectedMenu('Payments')}>
                        <ListItemText primary="Payments" />
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4">{getPageTitle()}</Typography>
                {renderContent()} {/* 페이지에 따른 컨텐츠를 렌더링 */}
            </Box>
        </Box>
    );
}

export default AdminDashboard;