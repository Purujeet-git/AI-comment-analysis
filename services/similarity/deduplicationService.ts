// Groups comments by their normalized text.
// This dramatically reduces embedding requests.


export interface ProcessedComment {
    id: string;
    originalText: string;
    normalizedText: string;
}

export interface UniqueComment {
    normalizedText: string;
    originals: ProcessedComment[];
    count: number;
}

export class DeduplicationService {
    deduplicate(
        comments: ProcessedComment[]
    ): UniqueComment[] {
        const map = new Map<string, UniqueComment>();

        for (const comment of comments) {
            const key = comment.normalizedText;

            if (!map.has(key)) {
                map.set(key, {
                    normalizedText: key,
                    originals: [],
                    count: 0,
                });
            }

            const entry = map.get(key)!;

            entry.originals.push(comment);
            entry.count++;
        }

        return Array.from(map.values());
    }
}

export const deduplicationService = new DeduplicationService();
