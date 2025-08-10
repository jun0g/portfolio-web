
import React, { useEffect, useState } from 'react';
import { fetchResume } from '../api/resume';
import Profile from '../components/Profile';
import Timeline from '../components/Timelines';
import ProjectList from '../components/ProjectList';
import Skills from '../components/Skills';
import SideProjects from '../components/SideProjects';
import Additional from '../components/Additional';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

export default function MainPage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResume()
      .then(data => {
        console.log("[MainPage] fetchResume data:", data);
        setResume(data);
      })
      .catch(err => {
        console.error("[MainPage] fetchResume error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log("[MainPage] resume state changed:", resume);
  }, [resume]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!resume) return <div>이력서 데이터 없음</div>;

  return (
    <Stack spacing={3} sx={{ maxWidth: 800, margin: '0 auto', padding: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Profile profile={resume.profile || {}} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Timeline timeline={resume.timeline || []} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <ProjectList projects={resume.projects || []} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Skills skills={resume.skills || {}} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <SideProjects sideProjects={resume.sideProjects || []} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Additional additional={resume.additional || ''} />
      </Paper>
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <a href="/edit"><button>수정하기</button></a>
      </div>
    </Stack>
  );
}
