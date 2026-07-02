/**
 * Similarity Service
 *
 * Responsible for all vector similarity calculations.
 * This service is completely independent of OpenAI,
 * databases, and clustering logic.
 */

export interface SimilarityResult {
  score: number;
  isSimilar: boolean;
}

export class SimilarityService {
  constructor(
    private readonly threshold: number = 0.85
  ) {}

  /**
   * Calculates cosine similarity between two vectors.
   *
   * Returns a value between:
   * 1   -> Identical
   * 0   -> Unrelated
   * -1  -> Opposite
   */
  cosineSimilarity(
    vectorA: number[],
    vectorB: number[]
  ): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error(
        "Vectors must have the same dimensions."
      );
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] * vectorA[i];
      magnitudeB += vectorB[i] * vectorB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Returns similarity metadata.
   */
  compare(
    vectorA: number[],
    vectorB: number[]
  ): SimilarityResult {
    const score = this.cosineSimilarity(vectorA, vectorB);

    return {
      score,
      isSimilar: score >= this.threshold,
    };
  }

  /**
   * Calculates average similarity between one vector
   * and a list of vectors.
   */
  averageSimilarity(
    target: number[],
    vectors: number[][]
  ): number {
    if (vectors.length === 0) return 0;

    let total = 0;

    for (const vector of vectors) {
      total += this.cosineSimilarity(target, vector);
    }

    return total / vectors.length;
  }

  /**
   * Returns the most similar vector from a list.
   */
  findMostSimilar(
    target: number[],
    vectors: number[][]
  ): {
    index: number;
    score: number;
  } {
    let bestIndex = -1;
    let bestScore = -Infinity;

    vectors.forEach((vector, index) => {
      const score = this.cosineSimilarity(target, vector);

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    return {
      index: bestIndex,
      score: bestScore,
    };
  }
}

export const similarityService = new SimilarityService();