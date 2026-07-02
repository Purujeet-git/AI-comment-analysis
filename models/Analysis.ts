// src/models/Analysis.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalysis extends Document {
  // Job Information
  mediaId: string;
  status: "processing" | "completed" | "failed";
  error?: string;

  // Reel Metadata
  reel?: {
    caption?: string;
    permalink?: string;
    mediaType?: string;
    timestamp?: Date;
  };

  // Statistics
  stats: {
    totalComments: number;
    processedComments: number;
    uniqueComments: number;
    spamComments: number;
    aiComments: number;
  };

  // AI Summary
  summary?: string;

  // Sentiment Analysis
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };

  // Emotion Analysis
  emotions: {
    joy: number;
    admiration: number;
    surprise: number;
    curiosity: number;
    anger: number;
    sadness: number;
    disgust: number;
    fear: number;
  };

  // Main Discussion Topics
  topics: {
    topic: string;
    percentage: number;
  }[];

  // Frequently Asked Questions
  faqs: {
    question: string;
    count: number;
    examples: string[];
  }[];

  // Spam Comments
  spam: {
    text: string;
    reason: string;
  }[];

  // AI Generated Comments
  aiGenerated: {
    text: string;
    confidence: number;
  }[];

  // Actionable Insights
  recommendations: string[];

  // Metadata
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    // --------------------------
    // Job
    // --------------------------

    mediaId: {
      type: String,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },

    error: {
      type: String,
    },

    // --------------------------
    // Reel Metadata
    // --------------------------

    reel: {
      caption: String,
      permalink: String,
      mediaType: String,
      timestamp: Date,
    },

    // --------------------------
    // Statistics
    // --------------------------

    stats: {
      totalComments: {
        type: Number,
        default: 0,
      },

      processedComments: {
        type: Number,
        default: 0,
      },

      uniqueComments: {
        type: Number,
        default: 0,
      },

      spamComments: {
        type: Number,
        default: 0,
      },

      aiComments: {
        type: Number,
        default: 0,
      },
    },

    // --------------------------
    // Summary
    // --------------------------

    summary: {
      type: String,
    },

    // --------------------------
    // Sentiment
    // --------------------------

    sentiment: {
      positive: {
        type: Number,
        default: 0,
      },

      neutral: {
        type: Number,
        default: 0,
      },

      negative: {
        type: Number,
        default: 0,
      },
    },

    // --------------------------
    // Emotion Detection
    // --------------------------

    emotions: {
      joy: {
        type: Number,
        default: 0,
      },

      admiration: {
        type: Number,
        default: 0,
      },

      surprise: {
        type: Number,
        default: 0,
      },

      curiosity: {
        type: Number,
        default: 0,
      },

      anger: {
        type: Number,
        default: 0,
      },

      sadness: {
        type: Number,
        default: 0,
      },

      disgust: {
        type: Number,
        default: 0,
      },

      fear: {
        type: Number,
        default: 0,
      },
    },

    // --------------------------
    // Topics
    // --------------------------

    topics: [
      {
        topic: String,
        percentage: Number,
      },
    ],

    // --------------------------
    // FAQs
    // --------------------------

    faqs: [
      {
        question: String,
        count: Number,
        examples: [String],
      },
    ],

    // --------------------------
    // Spam
    // --------------------------

    spam: [
      {
        text: String,
        reason: String,
      },
    ],

    // --------------------------
    // AI Generated
    // --------------------------

    aiGenerated: [
      {
        text: String,
        confidence: Number,
      },
    ],

    // --------------------------
    // Recommendations
    // --------------------------

    recommendations: {
      type: [String],
      default: [],
    },

    // --------------------------
    // Time
    // --------------------------

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Analysis: Model<IAnalysis> =
  mongoose.models.Analysis ||
  mongoose.model<IAnalysis>("Analysis", AnalysisSchema);

export default Analysis;