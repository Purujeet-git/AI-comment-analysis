// Preprocessor

// Responsible for normalizing comments before
// they are embedded.

export interface PreprocessOptions {
    removeEmojis?: boolean;
    removeMentions?: boolean;
    removeUrls?: boolean;
    lowercase?: boolean;
}

const DEFAULT_OPTIONS: Required<PreprocessOptions> = {
    removeEmojis: true,
    removeMentions: true,
    removeUrls: true,
    lowercase: true,
};

export class Preprocessor {
    preprocess(
        text: string,
        options: PreprocessOptions = {}
    ): string {
        const settings = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        let result = text;

        if (settings.lowercase) {
            result = result.toLowerCase();
        }

        if (settings.removeUrls) {
            result = result.replace(/https?:\/\/\S+/gi, "");
            result = result.replace(/www\.\S+/gi, "");
        }

        if(settings.removeMentions){
            result = result.replace(/@\w+/g,"");
        }

        if(settings.removeEmojis){
            result = result.replace(
                /[\p{Extended_Pictographic}]/gu,
                ""
            );
        }

        //Collapse repeated punctuation
        result = result.replace(/([!?.,])\1+/g,"$1");

        //Normalize whitespace
        result = result.replace(/\s+/g," ");

        //Remove zero-width characters
        result = result.replace(
            /[\u200B-\u200D\uFEFF]/g,
            ""
        );

        return result.trim();
    }

    preprocessMany(
        comments:string[],
        options?:PreprocessOptions
    ):string[] {
        return comments.map(comment =>
            this.preprocess(comment,options)
        );
    }
}


export const preprocessor = new Preprocessor();