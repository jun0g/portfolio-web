
import * as React from 'react';
import { Box, Typography, Paper, useTheme } from "@mui/material";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';


function parseYM(ym) {
  if (!ym || typeof ym !== "string") return null;
  const [y, m] = ym.split("-");
  if (!y || !m || isNaN(+y) || isNaN(+m)) return null;
  return new Date(+y, +m - 1, 1);
}

function formatYM(d) {
  if (!d) return "";
  return d.getFullYear() + "." + String(d.getMonth() + 1).padStart(2, "0");
}

export default function TimelineComponent({ timeline }) {
  const theme = useTheme();
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    return <Typography>표시할 타임라인 데이터가 없습니다.</Typography>;
  }

  // 최신순 정렬 (시작일 기준)
  const sorted = [...timeline].sort((a, b) => {
    const aDate = parseYM(a.start);
    const bDate = parseYM(b.start);
    return bDate - aDate;
  });

  const getDotColor = (type) => {
    switch (type) {
      case "military": return "warning.main";
      case "education": return "success.main";
      case "experience": return "info.main";
      default: return "grey.400";
    }
  };

  // 월 차이 계산
  const monthDiff = (a, b) => {
    if (!a || !b) return 0;
    return (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth() + 1;
  };

  const getLabel = (item) => {
    const S = parseYM(item.start);
    const E = item.current || !item.end ? new Date() : parseYM(item.end);
    const periodM = monthDiff(S, E);
    let periodStr = "";
    if (periodM > 0) {
      const y = Math.floor(periodM / 12);
      const m = periodM % 12;
      if (y > 0) periodStr += `${y}년`;
      if (m > 0) periodStr += `${y > 0 ? ' ' : ''}${m}개월`;
    }
    return {
      date: `${formatYM(S)} ~ ${item.current ? "현재" : (E ? formatYM(E) : "")}`,
      period: periodStr
    };
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>타임라인</Typography>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.3,
          },
        }}
      >
        {sorted.map((item, idx) => (
          <TimelineItem key={idx}>
            <TimelineOppositeContent color="textSecondary" sx={{ whiteSpace: 'pre-line' }}>
              {(() => {
                const label = getLabel(item);
                return <>
                  {label.date}
                  {label.period && <><br />({label.period})</>}
                </>;
              })()}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="inherit" sx={{ bgcolor: theme.palette[getDotColor(item.type).split('.')[0]][getDotColor(item.type).split('.')[1]], minWidth: 0, minHeight: 0 }} />
              {idx < sorted.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={2} sx={{ p: 2, mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.title}
                  {item.job && (
                    <span style={{ fontWeight: 400, fontSize: '0.95em', marginLeft: 6, color: '#555' }}>
                      ({item.job})
                    </span>
                  )}
                </Typography>
                {item.detail && item.detail.trim() && (
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', width: '200%' }}>
                    {item.detail}
                  </Typography>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}
