package handlers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"careerPage/api/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ResumeHandler struct {
	Col      *mongo.Collection
	Validate *validator.Validate
}

func NewResumeHandler(col *mongo.Collection) *ResumeHandler {
	v := validator.New(validator.WithRequiredStructEnabled())
	return &ResumeHandler{Col: col, Validate: v}
}

// POST /api/resumes
func (h *ResumeHandler) Create(c *gin.Context) {
	var in models.Resume
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.Validate.Struct(in.Profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid profile: " + err.Error()})
		return
	}
	now := time.Now().UTC()
	in.ID = primitive.NilObjectID
	in.CreatedAt = now
	in.UpdatedAt = now

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	res, err := h.Col.InsertOne(ctx, in)
	if err != nil {
		writeMongoErr(c, err)
		return
	}
	in.ID = res.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusCreated, in)
}

// GET /api/resumes/:id
func (h *ResumeHandler) Get(c *gin.Context) {
	oid, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var out models.Resume
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	err = h.Col.FindOne(ctx, bson.M{"_id": oid}).Decode(&out)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, out)
}

// GET /api/resumes/by-email/:email
func (h *ResumeHandler) GetByEmail(c *gin.Context) {
	email := c.Param("email")
	var out models.Resume
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	err := h.Col.FindOne(ctx, bson.M{"profile.contact.email": email}).Decode(&out)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, out)
}

// GET /api/resumes?limit=20&skip=0
func (h *ResumeHandler) List(c *gin.Context) {
	limit := parseIntDefault(c.Query("limit"), 20)
	skip := parseIntDefault(c.Query("skip"), 0)

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	findOpts := options.Find().
		SetLimit(int64(limit)).
		SetSkip(int64(skip)).
		SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cur, err := h.Col.Find(ctx, bson.M{}, findOpts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cur.Close(ctx)

	var items []models.Resume
	for cur.Next(ctx) {
		var r models.Resume
		if err := cur.Decode(&r); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		items = append(items, r)
	}
	c.JSON(http.StatusOK, gin.H{"items": items, "count": len(items)})
}

// PUT /api/resumes/:id (전체 교체)
func (h *ResumeHandler) Update(c *gin.Context) {
	oid, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var in models.Resume
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.Validate.Struct(in.Profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid profile: " + err.Error()})
		return
	}
	in.UpdatedAt = time.Now().UTC()

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	opts := options.FindOneAndReplace().SetReturnDocument(options.After)
	res := h.Col.FindOneAndReplace(ctx, bson.M{"_id": oid}, in, opts)

	var out models.Resume
	if err := res.Decode(&out); err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		writeMongoErr(c, err)
		return
	}
	out.ID = oid
	c.JSON(http.StatusOK, out)
}

// PATCH /api/resumes/:id (부분 수정)
func (h *ResumeHandler) Patch(c *gin.Context) {
	oid, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var patch map[string]any
	if err := c.ShouldBindJSON(&patch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	patch["updatedAt"] = time.Now().UTC()

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	_, err = h.Col.UpdateByID(ctx, oid, bson.M{"$set": patch})
	if err != nil {
		writeMongoErr(c, err)
		return
	}
	var out models.Resume
	if err := h.Col.FindOne(ctx, bson.M{"_id": oid}).Decode(&out); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, out)
}

// DELETE /api/resumes/:id
func (h *ResumeHandler) Delete(c *gin.Context) {
	oid, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	res, err := h.Col.DeleteOne(ctx, bson.M{"_id": oid})
	if err != nil {
		writeMongoErr(c, err)
		return
	}
	if res.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.Status(http.StatusNoContent)
}

func writeMongoErr(c *gin.Context, err error) {
	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
}

func parseIntDefault(s string, def int) int {
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return v
}
