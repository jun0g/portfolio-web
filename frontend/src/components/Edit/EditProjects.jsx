import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function EditProjects({ projects, setProjects }) {
  const addItem = () => setProjects([...projects, { name: '', period: '', content: '', summary: '' }]);
  const updateItem = (idx, field, value) => {
    setProjects(projects.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const removeItem = idx => setProjects(projects.filter((_, i) => i !== idx));

  return (
    <section>
      <h3>주요 프로젝트</h3>
      {projects.map((item, idx) => (
        <div key={idx} style={{ border: '1px solid #eee', marginBottom: 8, padding: 8 }}>
          <input type="text" placeholder="프로젝트명" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} />
          <input type="text" placeholder="기간" value={item.period} onChange={e => updateItem(idx, 'period', e.target.value)} />
          <input type="text" placeholder="요약" value={item.summary} onChange={e => updateItem(idx, 'summary', e.target.value)} />
          <div style={{ display: 'flex', gap: 16 }}>
            <textarea
              placeholder="상세 내용 (Markdown 가능)"
              rows={3}
              style={{ width: '50%' }}
              value={item.content}
              onChange={e => updateItem(idx, 'content', e.target.value)}
            />
            <div style={{ width: '50%', background: '#fafafa', minHeight: 60, padding: 8 }}>
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </div>
          </div>
          <button type="button" onClick={() => removeItem(idx)}>삭제</button>
        </div>
      ))}
      <button type="button" onClick={addItem}>항목 추가</button>
    </section>
  );
}
