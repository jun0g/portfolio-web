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
  const [flatSkills, setFlatSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResume()
      .then(data => {
        setResume(data);
        setFlatSkills(flattenSkills(data.skills));
      })
      .catch(err => setError(err.message));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const groupedSkills = groupSkillsByCategory(flatSkills);
      await saveResume({ ...resume, skills: groupedSkills });
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
      <EditProfile
        profile={resume.profile || {}}
        setProfile={p => setResume(r => ({ ...r, profile: p }))}
      />
      <EditTimeline
        timeline={resume.timeline || []}
        setTimeline={t => setResume(r => ({ ...r, timeline: t }))}
      />
      <EditProjects
        projects={resume.projects || []}
        setProjects={p => setResume(r => ({ ...r, projects: p }))}
      />
      <EditSkills
        skills={flatSkills}
        setSkills={setFlatSkills}
      />
      <EditSideProjects
        sideProjects={resume.sideProjects || []}
        setSideProjects={sp => setResume(r => ({ ...r, sideProjects: sp }))}
      />
      <EditAdditional
        additional={resume.additional || ''}
        setAdditional={g => setResume(r => ({ ...r, additional: g }))}
      />
      <button onClick={handleSave} disabled={saving}>
        {saving ? '저장중...' : '저장'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

// 🧩 객체형 skills → 배열로 평탄화
function flattenSkills(skillsObj) {
  return Object.values(skillsObj || {}).flat();
}

// 🧩 기술명 기반 카테고리 추정 후 그룹화
function groupSkillsByCategory(flatSkills) {
  const grouped = {};
  for (const skill of flatSkills) {
    const category = guessCategory(skill.name);
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(skill);
  }
  return grouped;
}

// 🧩 단순 카테고리 추정 함수
function guessCategory(name = '') {
  const lower = name.toLowerCase();
  if (/aws|azure|kubernetes|terraform|docker/.test(lower)) return 'Infra';
  if (/gitlab|argo|helm|jenkins|devops/.test(lower)) return 'DevOps';
  if (/prometheus|grafana|elk|newrelic|zabbix/.test(lower)) return 'Observability';
  if (/python|go|node/.test(lower)) return 'Backend';
  return 'Etc';
}
