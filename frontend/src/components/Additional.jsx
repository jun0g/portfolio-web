import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function Additional({ additional }) {
  return (
    <section>
      <h3>성장 과정</h3>
      <ReactMarkdown>{additional}</ReactMarkdown>
    </section>
  );
}
