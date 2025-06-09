import { Card, CardContent, Typography } from '@mui/material';
import { User } from '../../types/user';

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {user.full_name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {user.email}
        </Typography>
        {user.address && (
          <Typography variant="body2">
            Адрес: {user.address}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};