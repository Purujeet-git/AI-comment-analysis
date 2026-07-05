import { openai } from "@/lib/openai";
import { embeddingCache } from "./embeddingCache";
import { UniqueComment } from "./deduplicationService";

export interface EmbeddedComment extends UniqueComment {
    embedding: number[];
    source: "cache" | "openai";
}

export interface EmbeddingGenerationResult {
    embeddedComments: EmbeddedComment[];
    cacheHits: number;
    cacheMisses: number;
}

interface CachedEmbedding {
    normalizedText:string;
    embedding: number[];
    embeddingModel: string;
    dimensions: number;
}

class EmbeddingService {

    /**
     * Public API
     */
    async generateEmbeddings(
        comments: UniqueComment[]
    ): Promise<EmbeddingGenerationResult> {

        if (comments.length === 0) {
            return {
                embeddedComments: [],
                cacheHits: 0,
                cacheMisses: 0,
            };
        }

        // 1. Find cached embeddings
        const cacheMap = await this.getCachedEmbeddings(comments);

        // 2. Generate missing embeddings
        const newEmbeddings = await this.generateNewEmbeddings(
            comments,
            cacheMap
        );

        // 3. Save newly generated embeddings
        if (newEmbeddings.length > 0) {
            await this.saveEmbeddings(newEmbeddings);
        }

        // 4. Merge cached + new
        const embeddedComments = this.mergeEmbeddings(
            comments,
            cacheMap,
            newEmbeddings
        );

        return {
            embeddedComments,
            cacheHits: cacheMap.size,
            cacheMisses: newEmbeddings.length,
        };
    }

    /**
     * Find cached embeddings.
     */
    private async getCachedEmbeddings(
        comments: UniqueComment[]
    ) {

        const normalizedTexts = comments.map(
            comment => comment.normalizedText
        );

        const cached =
            await embeddingCache.findMany(normalizedTexts);

        return new Map(
            cached.map(item => [
                item.normalizedText,
                item
            ])
        );
    }

    /**
     * Generate embeddings only for missing comments.
     */
    private async generateNewEmbeddings(
        comments: UniqueComment[],
        cacheMap: Map<any, any>
    ) {

        const missing = comments.filter(
            comment =>
                !cacheMap.has(comment.normalizedText)
        );

        if (missing.length === 0) {
            return [];
        }

        const response =
            await openai.embeddings.create({

                model: "text-embedding-3-small",

                input: missing.map(
                    comment => comment.normalizedText
                ),
            });

        return missing.map((comment, index) => ({

            normalizedText: comment.normalizedText,

            embedding:
                response.data[index].embedding,

            embeddingModel:
                "text-embedding-3-small",

            dimensions:
                response.data[index].embedding.length,

        }));
    }

    /**
     * Save embeddings into MongoDB.
     */
    private async saveEmbeddings(
        embeddings: any[]
    ) {

        await embeddingCache.saveMany(
            embeddings
        );

    }

    /**
     * Merge cached + new embeddings.
     */
    private mergeEmbeddings(

        comments: UniqueComment[],

        cacheMap: Map<any, any>,

        newEmbeddings: any[]

    ): EmbeddedComment[] {

        const newMap = new Map(

            newEmbeddings.map(item => [

                item.normalizedText,

                item

            ])

        );

        return comments.map(comment => {

            const cached =
                cacheMap.get(comment.normalizedText);

            if (cached) {

                return {

                    ...comment,

                    embedding:
                        cached.embedding,

                    source: "cache",

                };

            }

            const generated =
                newMap.get(comment.normalizedText);

            return {

                ...comment,

                embedding:
                    generated.embedding,

                source: "openai",

            };

        });

    }

}

export const embeddingService =
    new EmbeddingService();