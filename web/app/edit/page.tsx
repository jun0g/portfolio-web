// app/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

type Resume = any;

const emptyTimelineItem = () => ({
  type: "experience",
  title: "",
  start: "",
  end: "",
  current: false,
  job: "",
  summary: "",
  detail: "",
});

const emptySkillCategory = () => ({
  category: "",
  stacks: [{ name: "", detail: "" }],
});

const emptyCertification = () => ({
  name: "",
  organization: "",
  date: "",
  number: "",
});

const emptyExtra = () => ({
  title: "",
  content: "",
});

const DEFAULT_RESUME: Resume = {
  profile: {
    avatarUrl: "",
    name: "",
    intro: "",
    contact: { email: "", phone: "" },
  },
  timeline: [emptyTimelineItem()],
  skills: [emptySkillCategory()],
  certifications: [],
  extra: [],
};

export default function EditPage() {
  const [resume, setResume] = useState<Resume>(DEFAULT_RESUME);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const showSnack = (message: string, severity: typeof snack.severity = "success") =>
    setSnack({ open: true, message, severity });

  // 최초 로드: 가장 최근 1건
  const fetchFirst = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resumes?limit=1");
      const data = await res.json();
      if (data?.items?.length) {
        const r = data.items[0];
        setResume(stripMeta(r));
        setResumeId(r.id || r._id || r.ID || (r?._id?.hex) || null);
      } else {
        setResume(DEFAULT_RESUME);
        setResumeId(null);
      }
    } catch (e: any) {
      showSnack(`불러오기 실패: ${e?.message || e}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 메타필드 제거(백엔드가 관리하는 값)
  function stripMeta(obj: any) {
    if (!obj || typeof obj !== "object") return obj;
    const { _id, id, ID, createdAt, updatedAt, ...rest } = obj;
    return rest;
  }

  // ===== 공통 저장 함수들 =====
  const createResume = async () => {
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `status ${res.status}`);
      }
      const created = await res.json();
      setResume(stripMeta(created));
      setResumeId(created.id || created._id || created.ID || (created?._id?.hex) || null);
      showSnack("생성 완료(POST)", "success");
    } catch (e: any) {
      showSnack("생성 실패: " + (e?.message || e), "error");
    }
  };

  const saveAllPut = async () => {
    if (!resumeId) {
      showSnack("저장할 대상이 없습니다. 먼저 생성하세요.", "warning");
      return;
    }
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `status ${res.status}`);
      }
      const updated = await res.json();
      setResume(stripMeta(updated));
      showSnack("전체 저장 완료(PUT)", "success");
    } catch (e: any) {
      showSnack("저장 실패: " + (e?.message || e), "error");
    }
  };

  const patchSection = async (section: Partial<Resume>) => {
    if (!resumeId) {
      showSnack("패치할 대상이 없습니다. 먼저 생성하세요.", "warning");
      return;
    }
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `status ${res.status}`);
      }
      const updated = await res.json();
      setResume(stripMeta(updated));
      showSnack("부분 저장 완료(PATCH)", "success");
    } catch (e: any) {
      showSnack("부분 저장 실패: " + (e?.message || e), "error");
    }
  };

  const handleDelete = async () => {
    if (!resumeId) {
      showSnack("삭제할 대상이 없습니다.", "warning");
      return;
    }
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `status ${res.status}`);
      }
      setResume(DEFAULT_RESUME);
      setResumeId(null);
      showSnack("삭제 완료", "success");
    } catch (e: any) {
      showSnack("삭제 실패: " + (e?.message || e), "error");
    }
  };

  const reloadFromServer = () => fetchFirst();

  // ====== 렌더링 보조 ======
  const SectionHeader = ({
    title,
    onSave,
    onAdd,
  }: {
    title: string;
    onSave?: () => void;
    onAdd?: () => void;
  }) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>
      <Stack direction="row" spacing={1}>
        {onAdd && (
          <Button variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />} onClick={onAdd}>
            추가
          </Button>
        )}
        {onSave && (
          <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={onSave}>
            저장
          </Button>
        )}
      </Stack>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          이력서 편집
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="서버에서 다시 불러오기">
            <span>
              <IconButton onClick={reloadFromServer} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="새로 생성(POST)">
            <span>
              <Button variant="outlined" onClick={createResume}>
                새 문서
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="전체 저장(PUT)">
            <span>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={saveAllPut}>
                전체 저장
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="삭제">
            <span>
              <IconButton color="error" onClick={handleDelete} disabled={!resumeId}>
                <DeleteForeverIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* 안내 */}
        <Grid item xs={12}>
          <Alert severity="info">
            각 섹션별로 개별 수정 후, 오른쪽 상단의 <b>저장</b> 버튼으로 해당 섹션만 PATCH 저장할 수 있습니다.
            필요하면 상단의 <b>전체 저장</b>으로 한 번에 PUT도 가능합니다.
          </Alert>
        </Grid>

        {/* 프로필 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <SectionHeader
                title="프로필"
                onSave={() => patchSection({ profile: resume.profile })}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="이름"
                    fullWidth
                    value={resume.profile?.name || ""}
                    onChange={(e) =>
                      setResume((r: any) => ({ ...r, profile: { ...r.profile, name: e.target.value } }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="아바타 URL"
                    fullWidth
                    value={resume.profile?.avatarUrl || ""}
                    onChange={(e) =>
                      setResume((r: any) => ({ ...r, profile: { ...r.profile, avatarUrl: e.target.value } }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="소개"
                    fullWidth
                    multiline
                    minRows={2}
                    value={resume.profile?.intro || ""}
                    onChange={(e) =>
                      setResume((r: any) => ({ ...r, profile: { ...r.profile, intro: e.target.value } }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="이메일"
                    fullWidth
                    value={resume.profile?.contact?.email || ""}
                    onChange={(e) =>
                      setResume((r: any) => ({
                        ...r,
                        profile: { ...r.profile, contact: { ...r.profile?.contact, email: e.target.value } },
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="전화번호"
                    fullWidth
                    value={resume.profile?.contact?.phone || ""}
                    onChange={(e) =>
                      setResume((r: any) => ({
                        ...r,
                        profile: { ...r.profile, contact: { ...r.profile?.contact, phone: e.target.value } },
                      }))
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 타임라인 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <SectionHeader
                title="타임라인"
                onSave={() => patchSection({ timeline: resume.timeline })}
                onAdd={() =>
                  setResume((r: any) => ({ ...r, timeline: [...(r.timeline || []), emptyTimelineItem()] }))
                }
              />
              <Stack spacing={2}>
                {(resume.timeline || []).map((item: any, idx: number) => (
                  <Card key={idx} variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          항목 #{idx + 1}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            color="error"
                            onClick={() =>
                              setResume((r: any) => ({
                                ...r,
                                timeline: (r.timeline || []).filter((_: any, i: number) => i !== idx),
                              }))
                            }
                          >
                            삭제
                          </Button>
                        </Stack>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Select
                            fullWidth
                            value={item.type || "experience"}
                            onChange={(e) =>
                              setResume((r: any) => {
                                const t = [...(r.timeline || [])];
                                t[idx] = { ...t[idx], type: e.target.value };
                                return { ...r, timeline: t };
                              })
                            }
                          >
                            <MenuItem value="experience">experience</MenuItem>
                            <MenuItem value="education">education</MenuItem>
                            <MenuItem value="military">military</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            label="제목"
                            fullWidth
                            value={item.title || ""}
                            onChange={(e) =>
                              setResume((r: any) => {
                                const t = [...(r.timeline || [])];
                                t[idx] = { ...t[idx], title: e.target.value };
                                return { ...r, timeline: t };
                              })
                            }
                          />
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <TextField
                            label="시작(YYYY.MM)"
                            fullWidth
                            value={item.start || ""}
                            onChange={(e) =>
                              setResume((r: any) => {
                                const t = [...(r.timeline || [])];
                                t[idx] = { ...t[idx], start: e.target.value };
                                return { ...r, timeline: t };
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <TextField
                            label="종료(YYYY.MM)"
                            fullWidth
                            disabled={!!item.current}
                            value={item.end || ""}
                            onChange={(e) =>
                              setResume((r: any) => {
                                const t = [...(r.timeline || [])];
                                t[idx] = { ...t[idx], end: e.target.value };
                                return { ...r, timeline: t };
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!item.current}
                                onChange={(e) =>
                                  setResume((r: any) => {
                                    const t = [...(r.timeline || [])];
                                    t[idx] = { ...t[idx], current: e.target.checked, end: e.target.checked ? "" : t[idx].end };
                                    return { ...r, timeline: t };
                                  })
                                }
                              />
                            }
                            label="현재 재직/진행"
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            label="직무"
                            fullWidth
                            value={item.job || ""}
                            onChange={(e) =>
                              setResume((r: any) => {
                                const t = [...(r.timeline || [])];
                                t[idx] = { ...t[idx], job: e.target.value };
                                return { ...r, timeline: t };
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="요약"
                            fullWidth
                            value={item.summary || ""}
                            onChange={(e) =>
                              setResume((r: any) => {
                                const t = [...(r.timeline || [])];
                                t[idx] = { ...t[idx], summary: e.target.value };
                                return { ...r, timeline: t };
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="상세"
                            fullWidth
                            multiline
                            minRows={3}
                            value={item.detail || ""}
                            onChange={(e) =>
                              setResume((r: any) => {
                                const t = [...(r.timeline || [])];
                                t[idx] = { ...t[idx], detail: e.target.value };
                                return { ...r, timeline: t };
                              })
                            }
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 스킬 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <SectionHeader
                title="스킬"
                onSave={() => patchSection({ skills: resume.skills })}
                onAdd={() =>
                  setResume((r: any) => ({ ...r, skills: [...(r.skills || []), emptySkillCategory()] }))
                }
              />
              <Stack spacing={2}>
                {(resume.skills || []).map((cat: any, cIdx: number) => (
                  <Card key={cIdx} variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <TextField
                          label="카테고리"
                          value={cat.category || ""}
                          onChange={(e) =>
                            setResume((r: any) => {
                              const s = [...(r.skills || [])];
                              s[cIdx] = { ...s[cIdx], category: e.target.value };
                              return { ...r, skills: s };
                            })
                          }
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            setResume((r: any) => ({
                              ...r,
                              skills: (r.skills || []).filter((_: any, i: number) => i !== cIdx),
                            }))
                          }
                        >
                          카테고리 삭제
                        </Button>
                      </Box>

                      <Stack spacing={1}>
                        {(cat.stacks || []).map((st: any, sIdx: number) => (
                          <Grid container spacing={1} key={sIdx}>
                            <Grid item xs={12} md={3}>
                              <TextField
                                label="스택명"
                                fullWidth
                                value={st.name || ""}
                                onChange={(e) =>
                                  setResume((r: any) => {
                                    const s = [...(r.skills || [])];
                                    const stacks = [...(s[cIdx].stacks || [])];
                                    stacks[sIdx] = { ...stacks[sIdx], name: e.target.value };
                                    s[cIdx] = { ...s[cIdx], stacks };
                                    return { ...r, skills: s };
                                  })
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                label="상세"
                                fullWidth
                                multiline
                                minRows={1}
                                value={st.detail || ""}
                                onChange={(e) =>
                                  setResume((r: any) => {
                                    const s = [...(r.skills || [])];
                                    const stacks = [...(s[cIdx].stacks || [])];
                                    stacks[sIdx] = { ...stacks[sIdx], detail: e.target.value };
                                    s[cIdx] = { ...s[cIdx], stacks };
                                    return { ...r, skills: s };
                                  })
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={1}>
                              <Button
                                color="error"
                                onClick={() =>
                                  setResume((r: any) => {
                                    const s = [...(r.skills || [])];
                                    const stacks = (s[cIdx].stacks || []).filter((_: any, i: number) => i !== sIdx);
                                    s[cIdx] = { ...s[cIdx], stacks };
                                    return { ...r, skills: s };
                                  })
                                }
                              >
                                삭제
                              </Button>
                            </Grid>
                          </Grid>
                        ))}
                        <Button
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={() =>
                            setResume((r: any) => {
                              const s = [...(r.skills || [])];
                              const stacks = [...(s[cIdx].stacks || []), { name: "", detail: "" }];
                              s[cIdx] = { ...s[cIdx], stacks };
                              return { ...r, skills: s };
                            })
                          }
                        >
                          스택 추가
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 자격/어학 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <SectionHeader
                title="자격 / 어학"
                onSave={() => patchSection({ certifications: resume.certifications })}
                onAdd={() =>
                  setResume((r: any) => ({
                    ...r,
                    certifications: [...(r.certifications || []), emptyCertification()],
                  }))
                }
              />
              <Stack spacing={2}>
                {(resume.certifications || []).map((cert: any, idx: number) => (
                  <Grid container spacing={2} key={idx} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="자격명"
                        fullWidth
                        value={cert.name || ""}
                        onChange={(e) =>
                          setResume((r: any) => {
                            const list = [...(r.certifications || [])];
                            list[idx] = { ...list[idx], name: e.target.value };
                            return { ...r, certifications: list };
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="발급기관"
                        fullWidth
                        value={cert.organization || ""}
                        onChange={(e) =>
                          setResume((r: any) => {
                            const list = [...(r.certifications || [])];
                            list[idx] = { ...list[idx], organization: e.target.value };
                            return { ...r, certifications: list };
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="취득일"
                        fullWidth
                        value={cert.date || ""}
                        onChange={(e) =>
                          setResume((r: any) => {
                            const list = [...(r.certifications || [])];
                            list[idx] = { ...list[idx], date: e.target.value };
                            return { ...r, certifications: list };
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="번호"
                        fullWidth
                        value={cert.number || ""}
                        onChange={(e) =>
                          setResume((r: any) => {
                            const list = [...(r.certifications || [])];
                            list[idx] = { ...list[idx], number: e.target.value };
                            return { ...r, certifications: list };
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Button
                        color="error"
                        onClick={() =>
                          setResume((r: any) => ({
                            ...r,
                            certifications: (r.certifications || []).filter((_: any, i: number) => i !== idx),
                          }))
                        }
                      >
                        삭제
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 추가사항 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <SectionHeader
                title="추가사항"
                onSave={() => patchSection({ extra: resume.extra })}
                onAdd={() =>
                  setResume((r: any) => ({ ...r, extra: [...(r.extra || []), emptyExtra()] }))
                }
              />
              <Stack spacing={2}>
                {(resume.extra || []).map((ex: any, idx: number) => (
                  <Card key={idx} variant="outlined">
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="제목"
                            fullWidth
                            value={ex.title || ""}
                            onChange={(e) =>
                              setResume((r: any) => {
                                const list = [...(r.extra || [])];
                                list[idx] = { ...list[idx], title: e.target.value };
                                return { ...r, extra: list };
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={7}>
                          <TextField
                            label="내용"
                            fullWidth
                            multiline
                            minRows={2}
                            value={ex.content || ""}
                            onChange={(e) =>
                              setResume((r: any) => {
                                const list = [...(r.extra || [])];
                                list[idx] = { ...list[idx], content: e.target.value };
                                return { ...r, extra: list };
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <Button
                            color="error"
                            onClick={() =>
                              setResume((r: any) => ({
                                ...r,
                                extra: (r.extra || []).filter((_: any, i: number) => i !== idx),
                              }))
                            }
                          >
                            삭제
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 하단 액션 */}
        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<CleaningServicesIcon />}
              onClick={() => setResume(DEFAULT_RESUME)}
            >
              기본 스키마
            </Button>
            <Box flex={1} />
            <Button
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={saveAllPut}
            >
              전체 저장(PUT)
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}