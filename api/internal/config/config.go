package config

import (
	"log"
	"os"
)

type Config struct {
	MongoURI   string
	Database   string
	Collection string
	Port       string
}

func Load() Config {
	cfg := Config{
		MongoURI:   getEnv("MONGODB_URI", "mongodb://localhost:27017"),
		Database:   getEnv("MONGODB_DB", "resume_db"),
		Collection: getEnv("MONGODB_COLLECTION", "resumes"),
		Port:       getEnv("PORT", "8080"),
	}
	log.Printf("[config] db=%s col=%s port=%s", cfg.Database, cfg.Collection, cfg.Port)
	return cfg
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
