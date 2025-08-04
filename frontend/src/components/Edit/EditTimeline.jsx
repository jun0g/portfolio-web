import React from "react";
import { Box, Typography, Paper, Grid, TextField, Select, MenuItem, Checkbox, FormControlLabel, Button, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const EMPTY_ITEM = { type: "experience", title: "", start: "", end: "", job: "", detail: "", current: false };
const isYM = v => /^\d{4}-\d{2}$/.test(v);
function parseYM(ym) {
  if (!ym) return new Date();
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1, 1);
}
function formatPeriod(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  let str = "";
  if (y > 0) str += `${y}년`;
  if (m > 0) str += `${y > 0 ? ' ' : ''}${m}개월`;
  return str;
}
function monthDiff(start, end) {
  return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;
}

export default function EditTimeline({ timeline, setTimeline }) {
  // 항목 추가
  const addItem = type => setTimeline([...timeline, { ...EMPTY_ITEM, type }]);
  // 항목 수정
  const update = (idx, field, value) => {
    setTimeline(timeline.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    ));
  };
  // 재직중 처리
  const toggleCurrent = idx => {
    setTimeline(timeline.map((item, i) =>
      i === idx ? { ...item, current: !item.current, end: !item.current ? "" : item.end } : item
    ));
  };
  // 항목 삭제
  const remove = idx => setTimeline(timeline.filter((_, i) => i !== idx));

  // 시작일 오름차순 정렬
  const sortedTimeline = [...timeline].sort((a, b) => {
    const aDate = isYM(a.start) ? parseYM(a.start) : new Date(2100, 0, 1);
    const bDate = isYM(b.start) ? parseYM(b.start) : new Date(2100, 0, 1);
    return aDate - bDate;
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>타임라인 (경력/학력/군복무)</Typography>
      <Box mb={2}>
        <Button variant="contained" size="small" onClick={() => addItem("experience")} sx={{ mr: 1 }}>경력 추가</Button>
        <Button variant="contained" size="small" onClick={() => addItem("education")} sx={{ mr: 1 }}>학력 추가</Button>
        <Button variant="contained" size="small" onClick={() => addItem("military")}>군복무 추가</Button>
      </Box>
      <Grid container spacing={2}>
        {sortedTimeline.map((item, idx) => {
          // 기간 계산
          const start = isYM(item.start) ? parseYM(item.start) : null;
          const end = item.current ? new Date() : isYM(item.end) ? parseYM(item.end) : null;
          const period = start && end ? formatPeriod(monthDiff(start, end)) : "";
          return (
            <Grid item xs={12} key={idx}>
              <Paper elevation={2} sx={{ p: 2, mb: 1 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} sm={2}>
                    <Select
                      value={item.type}
                      onChange={e => update(idx, "type", e.target.value)}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="experience">경력</MenuItem>
                      <MenuItem value="education">학력</MenuItem>
                      <MenuItem value="military">군복무</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="제목"
                      value={item.title}
                      onChange={e => update(idx, "title", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="직무/직급"
                      value={item.job || ""}
                      onChange={e => update(idx, "job", e.target.value)}
                      size="small"
                      fullWidth
                      placeholder="DevOps"
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="시작일"
                      type="month"
                      value={item.start}
                      onChange={e => update(idx, "start", e.target.value)}
                      size="small"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: "1950-01", max: "2100-12" }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="종료일"
                      type="month"
                      value={item.end}
                      onChange={e => update(idx, "end", e.target.value)}
                      size="small"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: "1950-01", max: "2100-12" }}
                      disabled={item.current}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    {(item.type === "experience") && (
                      <FormControlLabel
                        control={<Checkbox checked={item.current || false} onChange={() => toggleCurrent(idx)} />}
                        label="재직중"
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton onClick={() => remove(idx)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="상세 설명 (여러 줄)"
                    value={item.detail || ""}
                    onChange={e => update(idx, "detail", e.target.value)}
                    size="small"
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={8}
                    placeholder={"- 인프라 운영 및 구축"}
                    sx={{ whiteSpace: 'pre-line' }}
                  />
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
