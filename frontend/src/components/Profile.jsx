
import React from 'react';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Profile({ profile }) {
  return (
    <Stack direction="row" alignItems="flex-start" spacing={2}>
      <Avatar
        src={profile.photo || "/profile.jpg"}
        alt="프로필"
        sx={{ height: 80, width: 80 }}
        imgProps={{
          onError: (e) => {
            if (!e.target.src.endsWith("/profile.jpg")) {
              e.target.src = "/profile.jpg";
            }
          }
        }}
      />
      <Box display="flex" flexDirection="column" justifyContent="flex-start">
        <Typography variant="h5" component="div" sx={{ m: 0 }}>
          {profile?.name || '이름 없음'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile?.contact?.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile?.contact?.phone}
        </Typography>
      </Box>
    </Stack>
  );
}

