package main

import (
	"log"

	"careerPage/api/internal/config"
	"careerPage/api/internal/db"
	"careerPage/api/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	store, err := db.Connect(cfg)
	if err != nil {
		log.Fatal(err)
	}

	r := gin.New()
	r.Use(gin.Recovery(), gin.Logger())

	h := handlers.NewResumeHandler(store.Collection)

	api := r.Group("/api")
	{
		api.POST("/resumes", h.Create)
		api.GET("/resumes", h.List)
		api.GET("/resumes/:id", h.Get)
		api.GET("/resumes/by-email/:email", h.GetByEmail)
		api.PUT("/resumes/:id", h.Update)
		api.PATCH("/resumes/:id", h.Patch)
		api.DELETE("/resumes/:id", h.Delete)
	}

	log.Printf("listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
