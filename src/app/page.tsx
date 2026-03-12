
// Material UI imports
"use client";
import { Box, Stack, Avatar, Typography, ToggleButton, ToggleButtonGroup, Tabs, Tab, Paper, Divider, Chip } from '@mui/material';
import { useState } from 'react';

// Pretendard, NotoSans, Roboto 폰트 비교용 (실제 적용은 globals.css 등에서)


import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CareerPage() {
  const [section, setSection] = useState('resume');
  const [profile, setProfile] = useState<any>(null);
  const [career, setCareer] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certification, setCertification] = useState<any[]>([]);
  const [aboutme, setAboutme] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [work_logs, setWorkLogs] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatMonths = (monthsStr: string) => {
    const months = parseInt(monthsStr);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) {
      return `${remainingMonths}개월`;
    } else if (remainingMonths === 0) {
      return `${years}년`;
    } else {
      return `${years}년 ${remainingMonths}개월`;
    }
  };

  const formatSerial = (serial: string) => {
    if (serial.length <= 4) return serial;
    return serial.slice(0, 2) + '***' + serial.slice(-2);
  };

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        // profile (가장 첫번째 row)
        const { data: profileData, error: profileErr } = await supabase.from('profile').select('*').limit(1).single();
        if (profileErr) throw profileErr;
        setProfile(profileData);

        // career
        const { data: careerData, error: careerErr } = await supabase.from('career').select('*').order('start_date', { ascending: false });
        if (careerErr) throw careerErr;
        setCareer(careerData || []);

        // education
        const { data: educationData, error: educationErr } = await supabase.from('education').select('*').order('start_date', { ascending: false });
        if (educationErr) throw educationErr;
        setEducation(educationData || []);

        // skills
        const { data: skillsData, error: skillsErr } = await supabase.from('skills').select('*');
        if (skillsErr) throw skillsErr;
        setSkills(skillsData || []);

        // certification
        const { data: certData, error: certErr } = await supabase.from('certification').select('*');
        if (certErr) throw certErr;
        setCertification(certData || []);

        // aboutme
        const { data: aboutmeData, error: aboutmeErr } = await supabase.from('aboutme').select('*');
        if (aboutmeErr) throw aboutmeErr;
        setAboutme(aboutmeData || []);

        // projects
        const { data: projectsData, error: projectsErr } = await supabase.from('project').select('*').order('start_date', { ascending: false });
        if (projectsErr) throw projectsErr;
        setProjects(projectsData || []);

        // work_logs
        const { data: workLogsData, error: workLogsErr } = await supabase.from('work_log').select('*').order('created_at', { ascending: false });
        if (workLogsErr) throw workLogsErr;
        setWorkLogs(workLogsData || []);

        // labs
        const { data: labsData, error: labsErr } = await supabase.from('lab').select('*').order('created_at', { ascending: false });
        if (labsErr) throw labsErr;
        setLabs(labsData || []);

      } catch (err: any) {
        setError(err.message || '데이터 로딩 오류');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);


  if (loading) {
    return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>;
  }
  if (error) {
    return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>{error}</Box>;
  }

  const sectionTabs = [
    { value: 'resume', label: '이력서' },
    { value: 'project', label: '프로젝트' },
    { value: 'work_log', label: 'Work Log' },
    { value: 'lab', label: 'Lab' },
  ];

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', fontFamily: 'Pretendard, Noto Sans, Roboto, sans-serif', color: '#444', fontSize: 10 }}>
      {/* 프로필 */}
      <Paper elevation={2} sx={{ maxWidth: 800, mx: 'auto', mt: 6, p: 4, borderRadius: 4 }}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Avatar src={profile?.photo || '/profile.jpg'} sx={{ width: 100, height: 100 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 30, lineHeight: 1.8, color: '#111' }}>{profile?.name}</Typography>
            <Typography sx={{ fontSize: 14, color: '#888' }}>📱 {profile?.phone_number}</Typography>
            <Typography sx={{ fontSize: 14, color: '#888' }}>✉️ {profile?.email}</Typography>
          </Box>
        </Stack>

        {/* 섹션탭 */}
        <Box mt={4} mb={2}>
          <ToggleButtonGroup
            value={section}
            exclusive
            onChange={(_, v) => v && setSection(v)}
            color="primary"
            sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}
          >
            {sectionTabs.map(tab => (
              <ToggleButton key={tab.value} value={tab.value} sx={{ fontSize: 12, fontWeight: 600, color: '#333', px: 3 }}>
                {tab.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* 섹션 */}
        {section === 'resume' && (
          <Box>
            {/* 간단소개 */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24, color: '#111', mb: 1 }}>간단소개</Typography>
            <Typography sx={{ mb: 2 , whiteSpace: 'pre-wrap', fontSize: 14 }}>{profile?.introduction}</Typography>

            {/* 경력 */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24, color: '#111', mb: 1 }}>경력</Typography>
            <Stack spacing={1} mb={2}>
              {career.map((c, i) => (
                <Box key={i} sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 2 }}>
                  <Typography sx={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                      <span style={{ fontWeight: 600, fontSize: 18 }}>{c.role}</span>
                      <span style={{ fontSize: 16, color: '#888' }}> | {c.company} - {c.department} </span>
                    </span>
                    <span style={{ fontSize: 14, color: '#888' }}>
                      {c.start_date.slice(0,7)} ~ {c.end_date ? c.end_date.slice(0,7) : '현재'} ({formatMonths(c.months)})
                    </span>
                  </Typography>

                  <Typography sx={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{c.description}</Typography>
                </Box>
              ))}
            </Stack>

            {/* 학력 및 경험 */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24, color: '#111', mb: 1 }}>학력 및 경험</Typography>
            <Stack spacing={1} mb={2}>
              {education.map((e, i) => (
                <Box key={i} sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 2 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
                    <span>
                      <span> {e.major} </span>
                      <span style={{ fontWeight: 'normal', fontSize: 16, color: '#888' }}> | {e.institution}</span>
                    </span>
                    <span style={{ fontWeight: 'normal', fontSize: 14, color: '#888' }}>{e.start_date.slice(0,7)} ~ {e.end_date ? e.end_date.slice(0,7) : '현재'}</span>
                  </Typography>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{e.description}</Typography>
                </Box>
              ))}
            </Stack>

            {/* 기술스택 */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24, color: '#111', mb: 1 }}>기술스택</Typography>
            <Stack spacing={1} mb={2}>
              {skills.map((s, i) => (
                <Box key={i} sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 2 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 18}}>{s.category}</Typography>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{s.skill}</Typography>
                </Box>
              ))}
            </Stack>

            {/* 자격증 */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24, color: '#111', mb: 1 }}>자격증</Typography>
            <Stack spacing={1} mb={2}>
              {certification.map((c, i) => (
                <Box key={i} sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 2 }}>
                  <Typography>
                    <span style={{ fontWeight: 600, fontSize: 18 }}>{c.name} </span>
                    <span style={{ fontSize: 14, color: '#888' }}> {c.issuer} | {c.issue_date} | {formatSerial(c.serial)}</span>
                  </Typography>
                </Box>
              ))}
            </Stack>

            {/* aboutme */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24, color: '#111', mb: 1 }}>About Me</Typography>
            <Stack spacing={1} mb={2}>
              {aboutme.map((a, i) => (
                <Box key={i} sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 2 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 18 }}>{a.title}</Typography>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{a.content}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {section === 'project' && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 24, color: '#111', mb: 2 }}>프로젝트</Typography>
            <Stack spacing={1}>
              {projects.map((p, i) => (
                <Box key={i} sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 2 }}>

                  {/* Title + Date */}
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 18,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{p.title}</span>
                    <span style={{ fontWeight: 'normal', fontSize: 14, color: '#888' }}>
                      {p.start_date.slice(0,7)} ~ {p.end_date.slice(0,7)}
                    </span>
                  </Typography>

                  {/* 개요 */}
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>개요</Typography>
                    <Typography sx={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>
                      {p.overview}
                    </Typography>
                  </Box>

                  {/* 역할 */}
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>역할</Typography>
                    <Typography sx={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>
                      {p.role}
                    </Typography>
                  </Box>

                  {/* 성과 및 결과 */}
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>성과 및 결과</Typography>
                    <Typography sx={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>
                      {p.achievements}
                    </Typography>
                  </Box>

                  {/* 관련 스킬 */}
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>관련 스킬</Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      sx={{ mt: 0.5 }}
                    >
                      {p.skills?.split(',').map((skill: string, idx: number) => (
                        <Chip
                          key={idx}
                          label={skill.trim()}
                          size="small"
                          variant="outlined"
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </Stack>
                  </Box>

                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {section === 'work_log' && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14, color: '#111', mb: 2 }}>Work Log</Typography>
            <Stack spacing={1}>
              {work_logs.map((w, i) => (
                <Box key={i} sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 2 }}>
                  <Typography sx={{ fontWeight: 600 }}>{w.title}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#e65100' }}>문제: {w.problem}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#fbc02d' }}>원인: {w.cause}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#43a047' }}>해결: {w.resolution}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#1976d2' }}>결과: {w.result}</Typography>
                  {w.detail_link && <a href={w.detail_link} style={{ fontSize: 10, color: '#1976d2' }}>상세보기</a>}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {section === 'lab' && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14, color: '#111', mb: 2 }}>Lab</Typography>
            <Stack spacing={1}>
              {labs.map((l, i) => (
                <Box key={i} sx={{ bgcolor: '#f8fafc', borderRadius: 2, p: 2 }}>
                  <Typography sx={{ fontWeight: 600 }}>{l.title}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#1976d2' }}>목적: {l.purpose}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#43a047' }}>환경: {l.environment}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#e65100' }}>과정: {l.process}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#1976d2' }}>결과: {l.results}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#43a047' }}>적용성: {l.applicability}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#fbc02d' }}>제한사항: {l.limitations}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
