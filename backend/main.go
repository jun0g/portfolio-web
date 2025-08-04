package main

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

const dataPath = "/app/data/resume.json"

func main() {
	http.HandleFunc("/api/resume", resumeHandler)

	log.Println("서버 시작: 4030")
	log.Fatal(http.ListenAndServe(":4030", nil))
}

// 요청 로그 및 GET, PUT 처리
func resumeHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("[%s] %s %s %s\n", time.Now().Format("2006-01-02 15:04:05"), r.RemoteAddr, r.Method, r.URL.Path)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// OPTIONS 메소드 우선 처리 (프리플라이트 대응)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		log.Printf("OPTIONS 요청 완료 (%s)\n", r.URL.Path)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		handleGetResume(w)
		log.Printf("GET 요청 완료 (%s)\n", r.URL.Path)
	case http.MethodPut:
		handlePutResume(w, r)
		log.Printf("PUT 요청 완료 (%s)\n", r.URL.Path)
	default:
		http.Error(w, `{"result":"error","message":"Method not allowed"}`, http.StatusMethodNotAllowed)
		log.Printf("허용되지 않은 메서드: %s (%s)\n", r.Method, r.URL.Path)
	}
}

// GET: 파일 읽어서 반환
func handleGetResume(w http.ResponseWriter) {
	if _, err := os.Stat(dataPath); os.IsNotExist(err) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{}`))
		return
	}

	data, err := ioutil.ReadFile(dataPath)
	if err != nil {
		http.Error(w, `{"result":"error","message":"파일 읽기 실패"}`, http.StatusInternalServerError)
		log.Printf("파일 읽기 실패: %v\n", err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

// PUT: 파일로 저장
func handlePutResume(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, `{"result":"error","message":"입력값 오류"}`, http.StatusBadRequest)
		log.Printf("입력값 오류: %v\n", err)
		return
	}
	// JSON 검증
	var js map[string]interface{}
	if err := json.Unmarshal(body, &js); err != nil {
		http.Error(w, `{"result":"error","message":"JSON 파싱 오류"}`, http.StatusBadRequest)
		log.Printf("JSON 파싱 오류: %v\n", err)
		return
	}
	// 경로 폴더 미존재시 생성
	if err := os.MkdirAll(filepath.Dir(dataPath), 0755); err != nil {
		http.Error(w, `{"result":"error","message":"경로 생성 실패"}`, http.StatusInternalServerError)
		log.Printf("경로 생성 실패: %v\n", err)
		return
	}
	if err := ioutil.WriteFile(dataPath, body, 0644); err != nil {
		http.Error(w, `{"result":"error","message":"파일 저장 실패"}`, http.StatusInternalServerError)
		log.Printf("파일 저장 실패: %v\n", err)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"result":"ok"}`))
}
