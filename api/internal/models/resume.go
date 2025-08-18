package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 루트 문서
type Resume struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Profile        Profile            `json:"profile" bson:"profile" validate:"required,dive"`
	Timeline       []TimelineItem     `json:"timeline" bson:"timeline"`
	Skills         []SkillCategory    `json:"skills" bson:"skills"`
	Certifications []Certification    `json:"certifications" bson:"certifications"`
	Extra          []ExtraItem        `json:"extra" bson:"extra"`
	Projects       []Project          `json:"projects" bson:"projects"`
	Portfolio      []PortfolioItem    `json:"portfolio" bson:"portfolio"`
	CreatedAt      time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt      time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type Profile struct {
	AvatarURL string         `json:"avatarUrl" bson:"avatarUrl" validate:"omitempty,url"`
	Name      string         `json:"name" bson:"name" validate:"required"`
	Contact   ProfileContact `json:"contact" bson:"contact" validate:"required,dive"`
	Intro     string         `json:"intro" bson:"intro"`
}

type ProfileContact struct {
	Email string `json:"email" bson:"email" validate:"required,email"`
	Phone string `json:"phone" bson:"phone"`
}

type TimelineItem struct {
	Type     string  `json:"type" bson:"type" validate:"required,oneof=education military experience"`
	Title    string  `json:"title" bson:"title" validate:"required"`
	Start    string  `json:"start" bson:"start" validate:"required"`
	End      *string `json:"end" bson:"end,omitempty"`
	Job      string  `json:"job,omitempty" bson:"job,omitempty"`
	Summary  string  `json:"summary,omitempty" bson:"summary,omitempty"`
	Detail   string  `json:"detail,omitempty" bson:"detail,omitempty"`
	Current  bool    `json:"current" bson:"current"`
	Disabled bool    `json:"disabled" bson:"disabled"`
}

type SkillCategory struct {
	Category string       `json:"category" bson:"category" validate:"required"`
	Stacks   []SkillStack `json:"stacks" bson:"stacks"`
}

type SkillStack struct {
	Name   string `json:"name" bson:"name" validate:"required"`
	Detail string `json:"detail" bson:"detail"`
}

type Certification struct {
	Name         string `json:"name" bson:"name" validate:"required"`
	Organization string `json:"organization" bson:"organization"`
	Date         string `json:"date" bson:"date"`
	Number       string `json:"number" bson:"number"`
}

type ExtraItem struct {
	Title   string `json:"title" bson:"title" validate:"required"`
	Content string `json:"content" bson:"content"`
}

type Project struct {
	Title       string   `json:"title" bson:"title" validate:"required"`
	Start       string   `json:"start" bson:"start"`
	End         string   `json:"end" bson:"end"`
	Role        string   `json:"role" bson:"role"`
	Description string   `json:"description" bson:"description"`
	Skills      []string `json:"skills" bson:"skills"`
}

type PortfolioItem struct {
	Title       string `json:"title" bson:"title" validate:"required"`
	Start       string `json:"start" bson:"start"`
	End         string `json:"end" bson:"end"`
	URL         string `json:"url" bson:"url"`
	Role        string `json:"role" bson:"role"`
	Description string `json:"description" bson:"description"`
}
