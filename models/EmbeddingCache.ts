import mongoose, { Schema, Model } from "mongoose";

export interface IEmbeddingCache {
    normalizedText: string;
    embedding: number[];
    embeddingModel: string;
    dimensions: number;
}

const EmbeddingCacheSchema = new Schema<IEmbeddingCache>(
    {
        normalizedText: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        embedding: {
            type: [Number],
            required: true,
        },

        embeddingModel: {
            type: String,
            required: true,
            default: "text-embedding-3-small",
        },

        dimensions: {
            type: Number,
            required: true,
            default: 1536,
        },
    },
    {
        timestamps: true,
    }
);

const EmbeddingCache: Model<IEmbeddingCache> =
    mongoose.models.EmbeddingCache ||
    mongoose.model<IEmbeddingCache>(
        "EmbeddingCache",
        EmbeddingCacheSchema
    );

export default EmbeddingCache;