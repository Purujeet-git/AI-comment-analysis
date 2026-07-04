import { nanoid } from "nanoid";
import { EmbeddedComment } from "./embeddingService";
import { randomUUID } from "crypto";
import { similarityService } from "./similarityService";
export interface Cluster {
    id:string;

    comments: EmbeddedComment[];

    centroid: number[];

    representative: EmbeddedComment;

    confidence: number;

    averageSimilarity: number,

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
        const clusters: Cluster[] = [];

        for ( const comment of comments) {
            const {
                cluster,
                similarity,
            } = this.findBestCluster(
                comment,
                clusters
            );

            if(
                cluster && 
                similarity >= this.options.similarityThreshold
            ) {
                this.addComment(
                    cluster,
                    comment
                );
            } else {
                clusters.push(
                    this.createCluster(comment)
                );
            }
        }

        return clusters;
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
        if (clusters.length === 0){
            return {
                cluster: null,
                similarity:0,
            };
        }

        let bestCluster: Cluster | null = null;
        let bestSimilarity = -1;

        for(const cluster of clusters) {
            const result = similarityService.compare(
                comment.embedding,
                cluster.centroid,
            );

            if(result.score > bestSimilarity) {
                bestSimilarity = result.score;
                bestCluster = cluster;
            }
        }

        return {
            cluster: bestCluster,

            similarity: bestSimilarity,
        };
    }

    // Adds a comment to an existing cluster.

    private addComment(
        cluster: Cluster,
        comment: EmbeddedComment,
        recalculatedCentroid = true,
    ): void {
        cluster.comments.push(comment);

        this.updateCentroid(cluster);

        // Representative will be implemented in Commit 5
        this.updateRepresentative(cluster);
        // Confidence will be implemented in commit 6
        cluster.confidence = this.calculateConfidence(cluster);

        // Update Timestamp
        cluster.updatedAt = new Date();
    }

  
    // Updates the representative comment.

    private updateRepresentative(
        cluster: Cluster
    ): void {
        if(cluster.comments.length === 0) {
            return;
        }

        let representative = cluster.comments[0];

        let bestScore = -1;

        for(const comment of cluster.comments) {
            const similarity = similarityService.compare(
                comment.embedding,
                cluster.centroid
            );

            if(similarity.score > bestScore) {
                bestScore = similarity.score;
                representative = comment;
            }
        }

        cluster.representative = representative;
    }

    // Recalculates confidence.

    private calculateConfidence(
        cluster:Cluster
    ):number {
        if(cluster.comments.length === 0) {
            return 0;
        }
        let totalSimilarity = 0;

        for(const comment of cluster.comments) {
            totalSimilarity += similarityService.compare(
                comment.embedding,
                cluster.centroid
            ).score;
        }

        return (
            totalSimilarity / cluster.comments.length
        );
    }

    // Generates a unique cluster id.

    private generateClusterId(): string {
        return nanoid();
    }

    private createCluster (
        comment: EmbeddedComment
    ): Cluster {
        const now = new Date();

        
        return {
            
            id:this.generateClusterId(),

            comments: [comment],

            centroid: [...comment.embedding],

            representative: comment,

            averageSimilarity: 1,

            confidence: 1,

            createdAt: now,

            updatedAt: now,
        };
    }

    private updateCentroid(
        cluster: Cluster
    ): void {
        if(cluster.comments.length === 0) {
            return ;
        }

        const dimensions = cluster.comments[0].embedding.length;

        const centroid = new Array(dimensions).fill(0);

        for(const comment of cluster.comments) {
            for (let i=0;i<dimensions;i++){
                centroid[i] += comment.embedding[i];
            }
        }

        for(let i=0;i<dimensions;i++){
            centroid[i] /= cluster.comments.length;
        }

        cluster.centroid = centroid;
        cluster.updatedAt = new Date();


    }
}

export const clusterEngine = new ClusterEngine();


