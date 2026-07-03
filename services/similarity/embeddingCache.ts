import EmbeddingCache,{IEmbeddingCache} from "@/models/EmbeddingCache";

export class EmbeddingCacheService {
    // Find a cached embedding by normalized text.

    async find(
        normalizedText: string
    ):Promise<IEmbeddingCache | null> {
        return EmbeddingCache.findOne({
            normalizedText,
        }).lean();
    }

    async findMany(
        normalizedTexts:string[]
    ):Promise<IEmbeddingCache[]>{
        return EmbeddingCache.find({
            normalizedText:{
                $in: normalizedTexts,
            },
        }).lean();
    }

    // Save a new embedding.

    async save(
        embedding: IEmbeddingCache
    ) {
        return EmbeddingCache.create(embedding);
    }

    async saveMany(
        embeddings:IEmbeddingCache[]
    ) {
        if(embeddings.length === 0) {
            return [];
        }
        return EmbeddingCache.insertMany(
            embeddings,
            {
                ordered:false,
            }
        );
    }
}

export const embeddingCache = new EmbeddingCacheService(); 