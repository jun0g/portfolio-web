package db

import (
	"context"
	"log"
	"time"

	"careerPage/api/internal/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Store struct {
	Client     *mongo.Client
	Collection *mongo.Collection
}

func Connect(cfg config.Config) (*Store, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		return nil, err
	}
	if err := client.Ping(ctx, nil); err != nil {
		return nil, err
	}

	col := client.Database(cfg.Database).Collection(cfg.Collection)

	// 인덱스: 이메일 unique, createdAt desc
	_, err = col.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "profile.contact.email", Value: 1}},
			Options: options.Index().SetUnique(true).SetName("uniq_profile_email"),
		},
		{
			Keys:    bson.D{{Key: "createdAt", Value: -1}},
			Options: options.Index().SetName("createdAt_desc"),
		},
	})
	if err != nil {
		return nil, err
	}
	log.Println("[mongo] connected; indexes ensured")
	return &Store{Client: client, Collection: col}, nil
}
