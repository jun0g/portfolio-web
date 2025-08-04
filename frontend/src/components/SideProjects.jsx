import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function SideProjects({ sideProjects }) {
  return (
    <section>
      <h3>업무 외 프로젝트</h3>
      {sideProjects?.map((p, idx) => (
        <div key={idx} style={{ marginBottom: 16 }}>
          <a href={p.link} target="_blank" rel="noopener noreferrer">{p.title}</a>
          <ReactMarkdown>{p.description}</ReactMarkdown>
        </div>
      ))}
    </section>
  );
}
