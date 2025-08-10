import React from 'react';
import { Box, Typography, Paper, Stack, Chip } from '@mui/material';

const LEVEL_COLORS = {
  '설계': 'primary',
  '운영': 'info',
  '고도화': 'success',
  'PoC': 'warning',
  '구축': 'primary' // 'skills'에 포함된 숙련도 키워드
};

export default function Skills({ skills }) {
  if (!skills || Object.keys(skills).length === 0) {
    return <Typography>표시할 보유 기술 정보가 없습니다.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>보유 기술 요약</Typography>
      {Object.entries(skills).map(([category, skillList]) => (
        <Box key={category} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {category}
          </Typography>
          {skillList.map((skill, idx) => (
            <Paper key={idx} elevation={2} sx={{ p: 1.5, mb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontWeight: 500, minWidth: 120 }}>
                  {skill.name}
                </Typography>
                {skill.level.map((lv, i) => (
                  <Chip
                    key={i}
                    label={lv}
                    size="small"
                    color={LEVEL_COLORS[lv] || 'default'}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Paper>
          ))}
        </Box>
      ))}
    </Box>
  );
}

