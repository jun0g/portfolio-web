import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ProjectList({ projects }) {
  return (
    <section>
      <h3>주요 프로젝트</h3>
      {projects?.map((prj, idx) => (
        <div key={idx} style={{ marginBottom: 24 }}>
          <h4>{prj.name} <small>{prj.period}</small></h4>
          <div><b>{prj.summary}</b></div>
          <ReactMarkdown>{prj.content}</ReactMarkdown>
        </div>
      ))}
    </section>
  );
}
