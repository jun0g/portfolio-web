import React from 'react';

const LEVEL_LABELS = {
  '설계': '설계',
  '운영': '운영',
  '고도화': '고도화'
};

export default function Skills({ skills }) {
  return (
    <section>
      <h3>보유 기술</h3>
      <ul>
        {skills?.map((skill, idx) => (
          <li key={idx}>
            {skill.name} :
            {['설계', '운영', '고도화'].map(lv =>
              <span key={lv} style={{
                marginLeft: 8,
                fontWeight: skill.level?.includes(lv) ? 'bold' : 'normal',
                color: skill.level?.includes(lv) ? '#1976d2' : '#bbb'
              }}>
                {LEVEL_LABELS[lv]}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
