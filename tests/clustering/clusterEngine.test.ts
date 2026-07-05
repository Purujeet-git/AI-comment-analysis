import { describe, it, expect } from "vitest";

import { ClusterEngine } from "@/services/similarity/clusterEngine";
import { createEmbeddedComment } from "./fixtures";
import { Cluster } from "@/services/similarity/clusterEngine";

const VECTORS = {
    BUYING: [1, 0],
    BUYING_SIMILAR: [0.98, 0.02],
    BUYING_VARIANT: [0.95, 0.05],

    PRAISE: [0, 1],
    PRAISE_SIMILAR: [0.02, 0.98],
    PRICING: [0.7, 0.3],
    PRICE: [0.5, 0.5],
};

function getOnlyCluster(clusters: Cluster[]): Cluster {
    expect(clusters).toHaveLength(1);
    return clusters[0];
}

function createTestEngine(
    threshold = 0.85
) {
    return new ClusterEngine({
        similarityThreshold: threshold,
    });
}

describe("ClusterEngine", () => {
    const engine = new ClusterEngine({
        similarityThreshold: 0.85,
    });
    describe("Test commit 1", () => {
        it("returns no clusters for empty input", () => {
            const clusters = engine.cluster([]);

            expect(clusters).toHaveLength(0);
        });
    })


    it("creates one cluster for one comment", () => {
        const comments = [
            createEmbeddedComment(
                "Where is the link?",
                [1, 0]
            ),
        ];

        const clusters = engine.cluster(comments);

        expect(clusters).toHaveLength(1);

        expect(
            clusters[0].comments
        ).toHaveLength(1);

        expect(clusters[0].representative.normalizedText).toBe(
            "where is the link?"
        );

        expect(
            clusters[0].confidence
        ).toBe(1);
    });

    it("groups identical vectors", () => {
        const comments = [
            createEmbeddedComment("A", [1, 0]),

            createEmbeddedComment("B", [1, 0])
        ];

        const clusters =
            engine.cluster(comments);
        expect(clusters).toHaveLength(1);
        expect(clusters[0].comments).toHaveLength(2);
    });

    it("groups identical vectors into one cluster", () => {
        const comments = [
            createEmbeddedComment(
                "Need the link",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "Where can I buy this?",
                VECTORS.BUYING
            ),
        ];

        const clusters = engine.cluster(comments);

        expect(clusters).toHaveLength(1);

        expect(clusters[0].comments).toHaveLength(2);

        expect(clusters[0].confidence).toBeCloseTo(1);

        expect(clusters[0].centroid).toEqual(
            VECTORS.BUYING
        );

        expect(
            clusters[0].representative.normalizedText
        ).toBe("need the link");
    });

    it("creates seperate clusters for different vectors", () => {
        const comments = [
            createEmbeddedComment(
                "Need the link",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "Amazing ❤️",
                VECTORS.PRAISE
            ),
        ];

        const clusters = engine.cluster(comments);

        expect(clusters).toHaveLength(2);

        expect(clusters[0].comments).toHaveLength(1);

        expect(clusters[1].comments).toHaveLength(1);

        expect(
            clusters[1].representative.normalizedText
        ).toBe("amazing ❤️");


    });

    it("calculates the centroid as the average of two vectors", () => {
        const comments = [
            createEmbeddedComment("A", [1, 2]),
            createEmbeddedComment("B", [3, 4]),
        ];

        const engine = new ClusterEngine({
            similarityThreshold: 0,
        });

        const clusters = engine.cluster(comments);

        expect(clusters).toHaveLength(1);

        expect(clusters[0].centroid).toEqual([2, 3]);
    });

    it("calculates the centroid correctly for three vectors", () => {
        const comments = [
            createEmbeddedComment("A", [1, 1]),

            createEmbeddedComment("B", [3, 3]),

            createEmbeddedComment("C", [5, 5]),
        ];

        const engine = new ClusterEngine({
            similarityThreshold: 0,
        });

        const clusters = engine.cluster(comments);

        expect(clusters[0].centroid).toEqual([3, 3]);
    });

    it("keeps centroid unchanged for identical vectors", () => {
        const comments = [
            createEmbeddedComment(
                "A",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "B",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "C",
                VECTORS.BUYING
            ),
        ];

        const engine = new ClusterEngine({
            similarityThreshold: 0,
        });

        const clusters = engine.cluster(comments);

        expect(clusters[0].centroid).toEqual(VECTORS.BUYING);
    });

    it("chooses the comment closest to the centroid as representative", () => {

        const comments = [

            createEmbeddedComment(
                "Comment A",
                [1, 0]
            ),

            createEmbeddedComment(
                "Comment B",
                [0.9, 0.1]
            ),

            createEmbeddedComment(
                "Comment C",
                [0, 1]
            ),

        ];

        const engine = createTestEngine(0);

        const clusters =
            engine.cluster(comments);

        expect(
            clusters[0].representative.normalizedText
        ).toBe(
            "comment b"
        );

    });

    it("uses the only comment as representative", () => {

        const comments = [

            createEmbeddedComment(
                "Only Comment",
                [1, 0]
            ),

        ];

        const clusters =
            createTestEngine()
                .cluster(comments);

        expect(
            clusters[0].representative.normalizedText
        ).toBe(
            "only comment"
        );

    });

    it("returns confidence of 1 for identical vectors", () => {

        const comments = [

            createEmbeddedComment(
                "A",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "B",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "C",
                VECTORS.BUYING
            ),

        ];

        const clusters =
            createTestEngine(0)
                .cluster(comments);

        expect(
            clusters[0].confidence
        ).toBeCloseTo(1);

    });

    it("returns high confidence for similar vectors", () => {

        const comments = [

            createEmbeddedComment(
                "A",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "B",
                VECTORS.BUYING_SIMILAR
            ),

            createEmbeddedComment(
                "C",
                VECTORS.BUYING_VARIANT
            ),

        ];

        const clusters =
            createTestEngine(0)
                .cluster(comments);

        expect(
            clusters[0].confidence
        ).toBeGreaterThan(0.90);

        expect(
            clusters[0].confidence
        ).toBeLessThan(1);

    });

    it("returns lower confidence for mixed vectors", () => {

        const comments = [

            createEmbeddedComment(
                "Buying",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "Praise",
                VECTORS.PRAISE
            ),

            createEmbeddedComment(
                "Pricing",
                VECTORS.PRICING
            ),

        ];

        const clusters =
            createTestEngine(0)
                .cluster(comments);

        expect(
            clusters[0].confidence
        ).toBeLessThan(0.90);

    });

    it("always returns confidence between 0 and 1", () => {

        const comments = [

            createEmbeddedComment(
                "Buying",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "Praise",
                VECTORS.PRAISE
            ),

        ];

        const clusters =
            createTestEngine(0)
                .cluster(comments);

        expect(
            clusters[0].confidence
        ).toBeGreaterThanOrEqual(0);

        expect(
            clusters[0].confidence
        ).toBeLessThanOrEqual(1);

    });

    it("creates two clusters when similarity is below a strict threshold", () => {

        const comments = [

            createEmbeddedComment(
                "Need link",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "Buying link",
                VECTORS.BUYING_VARIANT
            ),

        ];

        const clusters =
            createTestEngine(0.999)
                .cluster(comments);

        expect(clusters).toHaveLength(2);

    });

    it("groups similar vectors when threshold is relaxed", () => {

        const comments = [

            createEmbeddedComment(
                "Need link",
                VECTORS.BUYING
            ),

            createEmbeddedComment(
                "Buying link",
                VECTORS.BUYING_VARIANT
            ),

        ];

        const clusters =
            createTestEngine(0.90)
                .cluster(comments);

        expect(clusters).toHaveLength(1);

        expect(
            getOnlyCluster(clusters).comments
        ).toHaveLength(2);

    });

});