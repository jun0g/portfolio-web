package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"careerPage/api/internal/config"
	"careerPage/api/internal/db"
	"careerPage/api/internal/models"
)

const payload = `
{
  "profile":{
    "avatarUrl": "https://cdn.example.com/me.jpg",
    "name":"박준형",
    "contact":{"email":"jjbro@kakao.com","phone":"010-6848-2351"},
    "intro": "안녕하세요. 박준형입니다"
  },
  "timeline":[
    {"type":"education","title":"수원정보과학고등학교","start":"2014-03","end":"2017-02","summary":"디지털네트워크과","detail":"","current":false,"disabled":false},
    {"type":"military","title":"군복무","start":"2017-08","end":"2019-05","job":"네트워크운용/정비","detail":"","current":false,"disabled":false},
    {"type":"experience","title":"누리미디어","start":"2019-05","end":"2022-04","job":"시스템엔지니어","detail":"- 대내외 인프라 구축 및 운영\n- 사내 S/W 및 라이선스 관리\n- 외부 관제업체 컨트롤 및 장애 대응\n- 신규 서비스를 위한 인프라 설계 및 구축","current":false,"disabled":false},
    {"type":"education","title":"한양대학교","start":"2021-03","end":"2025-02","job":"정보공학전공","detail":"","current":false,"disabled":false},
    {"type":"experience","title":"쿠캣","start":"2022-04","end":"2022-06","job":"AWS엔지니어","detail":"","current":false,"disabled":false},
    {"type":"experience","title":"위치컴퍼니","start":"2022-12","end":"2024-05","job":"DevOps/PM","detail":"","current":false,"disabled":false},
    {"type":"experience","title":"전기아이피","start":"2024-12","end":null,"job":"DevOps","detail":"","current":true,"disabled":false}
  ],
  "skills":[
    {"category":"infra","stacks":[
      {"name":"AWS","detail":"- 온프레미스 to AWS 마이그레이션\n - 인프라 통합 설계 및 구축"},
      {"name":"Kubernetes","detail":"EKS 클러스터 운영 및 관리"},
      {"name":"Container","detail":"서비스 이미지 빌드 및 배포"}]},
    {"category":"CI/CD","stacks":[
      {"name":"GitHub Actions","detail":"서비스 빌드 및 배포"},
      {"name":"ArgoCD","detail":"HELM 차트 배포 및 관리"},
      {"name":"Jenkins","detail":"서비스 이미지 빌드 및 배포"}]}
  ],
  "certifications":[{"name":"정보처리기사","organization":"한국산업인력공단","date":"2020-11-11","number":"aa12345f"}],
  "extra":[
    {"title":"성장과정","content":"저는 항상 새로운 기술을 배우고 적용하는 것을 즐깁."},
    {"title":"지원동기","content":"저는 항상 새로운 기술을 배우고 적용하는 것을 즐깁."}
  ],
  "projects":[
    {"title":"AWS 기반 인프라 구축","start":"2022-01","end":"2022-03","role":"주요 설계 및 구축 담당","description":"온프레미스 환경에서 AWS로의 마이그레이션 프로젝트로, EKS 클러스터를 활용한 컨테이너 기반 서비스 운영을 구현하였습니다.","skills":["AWS","EKS","Docker"]},
    {"title":"CI/CD 파이프라인 구축","start":"2023-01","end":"2023-04","role":"파이프라인 설계 및 구현","description":"GitHub Actions와 ArgoCD를 활용하여 자동화된 CI/CD 파이프라인을 구축하였습니다.","skills":["GitHub Actions","ArgoCD","Helm"]}
  ],
  "portfolio":[
    {"title":"불법 주정차 단손 데이터 기반 공영 주차장 입지 선정","start":"2023-01","end":"2023-04","url":"https://blog.example.com","role":"파이프라인 설계 및 구현","description":"기술 블로그로, DevOps 관련 기술과 경험을 공유합니다."}
  ]
}
`

func main() {
	cfg := config.Load()
	store, err := db.Connect(cfg)
	if err != nil {
		log.Fatal(err)
	}

	var r models.Resume
	if err := json.Unmarshal([]byte(payload), &r); err != nil {
		log.Fatal(err)
	}
	now := time.Now().UTC()
	r.CreatedAt = now
	r.UpdatedAt = now

	ctx := context.Background()
	if _, err := store.Collection.InsertOne(ctx, r); err != nil {
		log.Fatal(err)
	}
	log.Println("seed inserted for:", r.Profile.Contact.Email)
}
