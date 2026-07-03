import { EmbeddedComment } from "./embeddingService";

export interface Cluster {
    id:string;

    comments: EmbeddedComment[];

    centroid: number[];

    representative: EmbeddedComment;

    confidence: number;

    createdAt: Date;

    updatedAt: Date;
}

export interface ClusterOptions {
    // Minimum Cosine similarity required
    // for a comment to join a cluster.

    similarityThreshold: number;
}

const DEFAULT_OPTIONS: ClusterOptions = {
    similarityThreshold: 0.85,
}

export class ClusterEngine {
    private readonly options: ClusterOptions;

    constructor(
        options: Partial<ClusterOptions> = {}
    ) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
    }

    cluster(
        comments: EmbeddedComment[]
    ):Cluster[] {
        throw new Error(
            "cluster() not implemented."
        );
    }

    // Creates a brand new cluster.

    private createCluster(
        comment:EmbeddedComment
    ):Cluster{
        throw new Error(
            "createCluster() not implemented."
        );
    }

    // Finds the best matching cluster
    // for a Comment.

    private findBestCluster(
        comment: EmbeddedComment,
        clusters:Cluster[]
    ): {
        cluster: Cluster | null,
        similarity: number;
    } {
        throw new Error(
            "findBestCluster() not implemented."
        );
    }

    // Adds a comment to an existing cluster.

    private addComment(
        cluster: Cluster,
        comment: EmbeddedComment
    ): void {
        throw new Error(
            "addComment() not implemented."
        );
    }

    // Recomputes the centroid
    // after a new comment joins.

    private updateCentroid(
        cluster: Cluster
    ): void {
        throw new Error(
            "updateCentroid() not implemented."
        );
    }

    // Updates the representative comment.

    private updateRepresentative(
        cluster: Cluster
    ): void {
        throw new Error(
            "updateRepresentative() not implemented."
        );
    }

    // Recalculates confidence.

    private calculateConfidence(
        cluster:Cluster
    ):number {
        throw new Error(
            "calculateConfidence() not implemented."
        );
    }

    // Generates a unique cluster id.

    private generateClusterId(): string {
        return crypto.randomUUID();
    }
}

export const clusterEngine = new ClusterEngine();


