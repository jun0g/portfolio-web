import React, { useState, useEffect } from 'react';
import { fetchResume, saveResume } from '../api/resume';
import EditProfile from '../components/Edit/EditProfile';
import EditTimeline from '../components/Edit/EditTimeline';
import EditProjects from '../components/Edit/EditProjects';
import EditSkills from '../components/Edit/EditSkills';
import EditSideProjects from '../components/Edit/EditSideProjects';
import EditAdditional from '../components/Edit/EditAdditional';

export default function EditPage() {
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResume()
      .then(data => setResume(data))
      .catch(err => setError(err.message));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveResume(resume);
      window.location.href = '/';
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!resume) return <div>로딩중...</div>;

  return (
    <div>
      <h2>이력서 수정</h2>
      <EditProfile profile={resume.profile || {}} setProfile={p => setResume(r => ({ ...r, profile: p }))} />
      <EditTimeline timeline={resume.timeline || []} setTimeline={t => setResume(r => ({ ...r, timeline: t }))} />
      <EditProjects projects={resume.projects || []} setProjects={p => setResume(r => ({ ...r, projects: p }))} />
      <EditSkills skills={resume.skills || []} setSkills={s => setResume(r => ({ ...r, skills: s }))} />
      <EditSideProjects sideProjects={resume.sideProjects || []} setSideProjects={sp => setResume(r => ({ ...r, sideProjects: sp }))} />
      <EditAdditional additional={resume.additional || ''} setAdditional={g => setResume(r => ({ ...r, additional: g }))} />
      <button onClick={handleSave} disabled={saving}>{saving ? '저장중...' : '저장'}</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
