import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function EditSideProjects({ sideProjects, setSideProjects }) {
  const addItem = () => setSideProjects([...sideProjects, { title: '', link: '', description: '' }]);
  const updateItem = (idx, field, value) => {
    setSideProjects(sideProjects.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const removeItem = idx => setSideProjects(sideProjects.filter((_, i) => i !== idx));

  return (
    <section>
      <h3>업무 외 프로젝트</h3>
      {sideProjects.map((item, idx) => (
        <div key={idx} style={{ border: '1px solid #eee', marginBottom: 8, padding: 8 }}>
          <input type="text" placeholder="제목" value={item.title} onChange={e => updateItem(idx, 'title', e.target.value)} />
          <input type="text" placeholder="링크" value={item.link} onChange={e => updateItem(idx, 'link', e.target.value)} />
          <div style={{ display: 'flex', gap: 16 }}>
            <textarea
              placeholder="설명 (Markdown 가능)"
              rows={2}
              style={{ width: '50%' }}
              value={item.description}
              onChange={e => updateItem(idx, 'description', e.target.value)}
            />
            <div style={{ width: '50%', background: '#fafafa', minHeight: 30, padding: 8 }}>
              <ReactMarkdown>{item.description}</ReactMarkdown>
            </div>
          </div>
          <button type="button" onClick={() => removeItem(idx)}>삭제</button>
        </div>
      ))}
      <button type="button" onClick={addItem}>항목 추가</button>
    </section>
  );
}
