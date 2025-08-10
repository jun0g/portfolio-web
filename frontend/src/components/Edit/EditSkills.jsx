import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const LEVELS = ['설계', '운영', '고도화', 'PoC'];
const CATEGORIES = ['Infra', 'DevOps', 'Observability', 'Backend', 'Etc'];

export default function EditSkills({ skills, setSkills }) {
  const handleAdd = () => {
    setSkills([...skills, { name: '', level: [], category: 'Etc' }]);
  };

  const handleChange = (idx, field, value) => {
    const updated = [...skills];
    updated[idx][field] = value;
    setSkills(updated);
  };

  const toggleLevel = (idx, level) => {
    const updated = [...skills];
    const has = updated[idx].level.includes(level);
    updated[idx].level = has
      ? updated[idx].level.filter((l) => l !== level)
      : [...updated[idx].level, level];
    setSkills(updated);
  };

  const handleRemove = (idx) => {
    const updated = skills.filter((_, i) => i !== idx);
    setSkills(updated);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        보유 기술 편집
      </Typography>

      <Stack spacing={2}>
        {skills.map((skill, idx) => (
          <Stack
            key={idx}
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <TextField
              label="기술명"
              value={skill.name}
              onChange={(e) => handleChange(idx, 'name', e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>카테고리</InputLabel>
              <Select
                label="카테고리"
                value={skill.category || 'Etc'}
                onChange={(e) => handleChange(idx, 'category', e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {LEVELS.map((level) => (
              <FormControlLabel
                key={level}
                control={
                  <Checkbox
                    size="small"
                    checked={skill.level.includes(level)}
                    onChange={() => toggleLevel(idx, level)}
                  />
                }
                label={level}
              />
            ))}

            <IconButton
              color="error"
              onClick={() => handleRemove(idx)}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}

        <Button
          variant="contained"
          onClick={handleAdd}
          startIcon={<AddIcon />}
          sx={{ width: 'fit-content' }}
        >
          항목 추가
        </Button>
      </Stack>
    </Box>
  );
}
