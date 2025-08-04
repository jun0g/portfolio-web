import React, { useState } from 'react';
import { Box, Typography, TextField, Grid, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';

export default function EditProfile({ profile, setProfile }) {
  const update = (field, value) => setProfile({ ...profile, [field]: value });
  const updateContact = (field, value) =>
    setProfile({ ...profile, contact: { ...profile.contact, [field]: value } });

  const [introTab, setIntroTab] = useState('edit');

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>프로필</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="이름" value={profile.name || ''} onChange={e => update('name', e.target.value)} fullWidth size="small" sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="사진 URL" value={profile.photo || ''} onChange={e => update('photo', e.target.value)} fullWidth size="small" sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="이메일" value={profile.contact?.email || ''} onChange={e => updateContact('email', e.target.value)} fullWidth size="small" sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="전화번호" value={profile.contact?.phone || ''} onChange={e => updateContact('phone', e.target.value)} fullWidth size="small" sx={{ mb: 2 }} />
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>자기소개 (마크다운 지원)</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            label="자기소개 (Markdown)"
            value={profile.introduction || ''}
            onChange={e => update('introduction', e.target.value)}
            multiline
            minRows={4}
            maxRows={12}
            fullWidth
            sx={{ flex: 1 }}
          />
          <Box sx={{ flex: 1, border: '1px solid #eee', borderRadius: 1, p: 2, bgcolor: '#fafbfc', minHeight: 120, overflow: 'auto' }}>
            <Typography variant="caption" color="text.secondary">미리보기</Typography>
            <ReactMarkdown>{profile.introduction || ''}</ReactMarkdown>
          </Box>
        </Box>
      </Grid> */}
    </Paper>
  );
}
