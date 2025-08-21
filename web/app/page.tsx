// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";

export default function HomePage() {
  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((data) => {
        if (data?.items?.length) {
          setResume(data.items[0]);
        }
      });
  }, []);

  if (!resume) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        Loading...
      </Typography>
    );
  }

  // type별 색상 매핑
  const typeColors: Record<string, string> = {
    experience: "#5ca8ffff",
    education: "#6bf77eff",
    military: "#db835bff",
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 프로필 헤더 */}
      <Box display="flex" alignItems="center" gap={3} mb={4}>
        <Avatar
          src={resume.profile.avatarUrl}
          alt={resume.profile.name}
          sx={{ width: 96, height: 96 }}
        />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {resume.profile.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {resume.profile.intro}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📧 {resume.profile.contact.email} | 📱 {resume.profile.contact.phone}
          </Typography>
        </Box>
      </Box>

      {/* 이력서 타임라인 */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        타임라인
      </Typography>

      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.22, // 날짜 칼럼 비율
          },
        }}
      >
        {resume.timeline.map((item: any, idx: number) => (
          <TimelineItem key={idx}>
            <TimelineOppositeContent
              color="text.secondary"
              sx={{ fontSize: "0.95rem" }} // 글씨 크기 줄이기
            >
              {item.start} ~ {item.current ? "현재" : item.end || "-"}
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor: typeColors[item.type] || "grey",
                }}
              />
              {idx < resume.timeline.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2">
                    {item.summary}
                  </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {item.detail}
                </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      <Divider sx={{ my: 4 }} />

      {/* 스킬 */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        스킬
      </Typography>
      <Grid container spacing={2}>
        {resume.skills.map((cat: any, idx: number) => (
          <Grid key={idx}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {cat.category}
                </Typography>
                {cat.stacks.map((stack: any, sIdx: number) => (
                  <Box key={sIdx} mb={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {stack.name}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {stack.detail}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* 자격/어학 */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        자격 / 어학
      </Typography>
      <Stack spacing={2}>
        {resume.certifications.map((cert: any, idx: number) => (
          <Card key={idx}>
            <CardContent>
              <Typography variant="h6">{cert.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {cert.organization} | 취득일: {cert.date} | 번호: {cert.number}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* 추가사항 */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        추가내용
      </Typography>
      <Stack spacing={2}>
        {resume.extra.map((item: any, idx: number) => (
          <Card key={idx}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {item.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}