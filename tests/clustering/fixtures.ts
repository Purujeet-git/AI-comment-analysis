import { EmbeddedComment } from "@/services/similarity/embeddingService";

let id = 0;

export function createEmbeddedComment(
    text:string,
    embedding:number[]
): EmbeddedComment {
    id++;

    return {
        normalizedText: text.toLowerCase(),

        embedding,

        source:"cache",

        count:1,

        originals: [],
    }
}