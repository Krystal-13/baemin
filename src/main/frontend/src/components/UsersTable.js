import React, {useEffect, useState} from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {deleteUser, fetchUsers, updateUser} from "../api/users";

const MemberManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedRole, setUpdatedRole] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchUsers(); // fetchUsers 함수 호출
            setUsers(data);
        };
        loadUsers();
    }, []);

    const handleDeleteClick = async (email) => {
        const isDeleted = await deleteUser(email);
        if (isDeleted) {
            // 사용자 목록을 필터링하여 삭제된 사용자 제외
            setUsers((prevUsers) => prevUsers.filter(user => user.username !== email));
        } else {
            alert('Failed to delete user');
        }
    };

    const handleUpdateUser = async () => {
        const updatedUser = await updateUser(updatedEmail, updatedRole);
        if (updatedUser) {
            setUsers(users.map(user =>
                user.id === selectedUser.id
                    ? { ...user, email: updatedEmail, role: updatedRole }
                    : user
            ));
            setIsEditDialogOpen(false);
            setSelectedUser(null);
        } else {
            alert('Failed to update user');
        }
    };

    const handleEditSubmit = () => {
        handleUpdateUser();
    };

    return (
        <Box p={3}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="secondary" onClick={() => handleDeleteClick(user.username)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Email"
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <Select
                        label="Role"
                        value={updatedRole}
                        onChange={(e) => setUpdatedRole(e.target.value)}
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
                        <MenuItem value="ROLE_OWNER">Owner</MenuItem>
                        <MenuItem value="ROLE_MANAGER">Manager</MenuItem>
                    </Select>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default MemberManagement;
