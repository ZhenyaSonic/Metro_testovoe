import { useEffect, useState } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { getUsers, getUserDetails } from '../../api/users';
import { User, UserBase } from '../../types/user';
import { UserCard } from '../../components/User/UserCard';

export const Users = () => {
  const [users, setUsers] = useState<UserBase[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = async (userId: number) => {
    try {
      const user = await getUserDetails(userId);
      setSelectedUser(user);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Пользователи</Typography>
      {users.map(user => (
        <Box 
          key={user.id} 
          onClick={() => handleUserClick(user.id)}
          sx={{ cursor: 'pointer', mb: 2 }}
        >
          <Typography>{user.full_name} - {user.email}</Typography>
        </Box>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Детали пользователя</DialogTitle>
        <DialogContent>
          {selectedUser && <UserCard user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};