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

// YYYY-MM-DD 전제
const parseYMD = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// 해당 월의 일수
const daysInMonth = (y: number, m0: number) => new Date(y, m0 + 1, 0).getDate();

// 년/월 차이 계산 (일수 반영 + 올림)
const diffYearsMonths = (start: Date, end: Date) => {
  // 기본 '월' 차이 (일수 무시)
  const baseMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  // 일수 차이를 '부분 달'로 환산
  const dim = daysInMonth(start.getFullYear(), start.getMonth());
  const fractional = (end.getDate() - start.getDate()) / dim;

  // 부분 달은 올림 처리
  let totalMonths = Math.ceil(baseMonths + fractional);
  if (totalMonths < 0) totalMonths = 0;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return { years, months };
};

// 'YYYY년 M월'로 표기 (일은 표시하지 않음)
const formatYearMonth = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월`;

// 타임라인 좌측 표기 문자열
const getRangeAndDuration = (item: any) => {
  const start = parseYMD(item.start as string);
  const end = item.current ? new Date() : parseYMD(item.end as string);

  const rangeText = `${formatYearMonth(start)} ~ ${
    item.current ? "현재" : formatYearMonth(end)
  }`;

  const { years, months } = diffYearsMonths(start, end);
  const durationText =
    years === 0 && months === 0
      ? ""
      : `(${years ? `${years}년` : ""}${years && months ? " " : ""}${
          months ? `${months}개월` : ""
        })`;

  return { rangeText, durationText };
};

// 타임라인 내 experience 타입의 총 경력 계산 함수
const getTotalExperience = (timeline: any[]) => {
  let totalMonths = 0;
  timeline
    .filter((item) => item.type === "experience")
    .forEach((item) => {
      const start = parseYMD(item.start);
      const end = item.current ? new Date() : parseYMD(item.end);
      const { years, months } = diffYearsMonths(start, end);
      totalMonths += years * 12 + months;
    });
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0 && months === 0) return "";
  return `${years ? `${years}년` : ""}${years && months ? " " : ""}${months ? `${months}개월` : ""}`;
};

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

  // 자격번호 마스킹 함수: 앞 2자리, 뒤 2자리만 남기고 나머지는 *
const maskCertNumber = (num: string) => {
  if (!num || num.length <= 4) return num;
  const start = num.slice(0, 2);
  const end = num.slice(-2);
  const masked = "*".repeat(num.length - 4);
  return `${start}${masked}${end}`;
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
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 0 }}>
          타임라인
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
          {getTotalExperience(resume.timeline) && `(총 경력: ${getTotalExperience(resume.timeline)})`}
        </Typography>
      </Box>

      <Timeline
        sx={{
          pl: 0, // 전체 타임라인의 왼쪽 패딩 제거
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.32, // 날짜 칼럼 비율 유지
            paddingLeft: 0, // OppositeContent 왼쪽 여백 제거
            marginLeft: 0,
          },
          "& .MuiTimelineItem-root": {
            "&:before": {
              flex: 0, // 디폴트 세로 라인 앞 공간 제거
              padding: 0,
            },
          },
        }}
      >
        {resume.timeline.map((item: any, idx: number) => {
          const { rangeText, durationText } = getRangeAndDuration(item);
          return (
            <TimelineItem key={idx}>
              <TimelineOppositeContent color="text.secondary" sx={{ fontSize: "0.95rem" }}>
                <Box display="flex" flexDirection="column" lineHeight={1.2}>
                  <span>{rangeText}</span>
                  {durationText && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {durationText}
                    </Typography>
                  )}
                </Box>
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot sx={{ backgroundColor: typeColors[item.type] || "grey" }} />
                {idx < resume.timeline.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent>
                <Typography variant="h6">
                  {item.title}
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }} // 왼쪽에 간격 주기
                  >
                    {item.summary}
                  </Typography>
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {item.detail}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          );
        })}
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
      <Stack spacing={1}>
        {resume.certifications.map((cert: any, idx: number) => (
          <Card key={idx} sx={{ mb: 0.5 }}>
            <CardContent sx={{ pb: '12px !important' }}>
              <Typography variant="h6">
                {cert.name}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                  sx={{ ml: 1 }}
                >
                  {cert.organization} | 취득일: {cert.date} | 자격증번호: {maskCertNumber(cert.number)}
                </Typography>
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
              <Typography variant="h6" fontWeight="bold">
                {item.title}
              </Typography>
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