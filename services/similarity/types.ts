export interface CommentEmbedding {
    id:string;
    text:string;
    embeddings:number[];
}

export interface Cluster {
    id:string;

    comments: CommentEmbedding[];

    centroid: number[];

    averageSimilarity: number;
}

