import React from 'react';

const LEVELS = ['설계', '운영', '고도화'];

export default function EditSkills({ skills, setSkills }) {
  const addItem = () => setSkills([...skills, { name: '', level: [] }]);
  const updateItem = (idx, field, value) => {
    setSkills(skills.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const toggleLevel = (idx, level) => {
    const skill = skills[idx];
    const has = skill.level.includes(level);
    const newLevel = has ? skill.level.filter(l => l !== level) : [...skill.level, level];
    updateItem(idx, 'level', newLevel);
  };
  const removeItem = idx => setSkills(skills.filter((_, i) => i !== idx));

  return (
    <section>
      <h3>보유 기술</h3>
      {skills.map((item, idx) => (
        <div key={idx} style={{ border: '1px solid #eee', marginBottom: 8, padding: 8 }}>
          <input type="text" placeholder="기술명" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} />
          {LEVELS.map(level => (
            <label key={level} style={{ marginLeft: 8 }}>
              <input
                type="checkbox"
                checked={item.level.includes(level)}
                onChange={() => toggleLevel(idx, level)}
              />
              {level}
            </label>
          ))}
          <button type="button" onClick={() => removeItem(idx)}>삭제</button>
        </div>
      ))}
      <button type="button" onClick={addItem}>항목 추가</button>
    </section>
  );
}
