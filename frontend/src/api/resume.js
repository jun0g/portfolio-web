const API_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:4030/api/resume'
    : 'http://backend:4030/api/resume');


export async function fetchResume() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('이력서 조회 실패');
  return await res.json();
}

export async function saveResume(data) {
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('이력서 저장 실패');
  return await res.json();
}
