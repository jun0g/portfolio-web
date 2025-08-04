import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function EditAdditional({ additional, setAdditional }) {
  return (
    <section>
      <h3>성장 과정</h3>
      <div style={{ display: 'flex', gap: 16 }}>
        <textarea
          rows={5}
          style={{ width: '50%' }}
          value={additional}
          onChange={e => setAdditional(e.target.value)}
        />
        <div style={{ width: '50%', background: '#fafafa', minHeight: 60, padding: 8 }}>
          <ReactMarkdown>{additional}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
