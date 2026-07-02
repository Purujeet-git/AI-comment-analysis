"use client";

import { useEffect, useState } from "react";

interface AnalysisResponse {
  success?: boolean;
  jobId?: string;
  status?: string;
  error?: string;
}

interface JobStatus {
  status: string;
  summary?: string;
  stats?: {
    totalComments: number;
    processedComments: number;
  };
  error?: string;
}

export default function AnalyzePage() {
  const [mediaId, setMediaId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const [jobId, setJobId] = useState("");
  const [job, setJob] = useState<JobStatus | null>(null);

  const [loading, setLoading] = useState(false);

  async function startAnalysis() {
    setLoading(true);
    setJob(null);
    setJobId("");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mediaId,
        accessToken,
      }),
    });

    const data: AnalysisResponse = await res.json();

    setLoading(false);

    if (data.jobId) {
      setJobId(data.jobId);
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/analyze/status?jobId=${jobId}`
      );

      const data = await res.json();

      setJob(data);

      if (
        data.status === "completed" ||
        data.status === "failed"
      ) {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        Instagram Analyzer
      </h1>

      <div className="space-y-5">

        <input
          className="w-full border rounded p-3"
          placeholder="Media ID"
          value={mediaId}
          onChange={(e) => setMediaId(e.target.value)}
        />

        <textarea
          className="w-full border rounded p-3 h-40"
          placeholder="Access Token"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
        />

        <button
          onClick={startAnalysis}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded"
        >
          {loading ? "Starting..." : "Analyze"}
        </button>

      </div>

      {jobId && (
        <div className="mt-8 border rounded p-4">
          <h2 className="font-semibold">
            Job ID
          </h2>

          <p>{jobId}</p>
        </div>
      )}

      {job && (
        <div className="mt-6 border rounded p-4 space-y-3">

          <h2 className="text-xl font-semibold">
            Analysis Status
          </h2>

          <p>
            <strong>Status:</strong> {job.status}
          </p>

          {job.stats && (
            <>
              <p>
                <strong>Total Comments:</strong>{" "}
                {job.stats.totalComments}
              </p>

              <p>
                <strong>Processed:</strong>{" "}
                {job.stats.processedComments}
              </p>
            </>
          )}

          {job.summary && (
            <>
              <hr />

              <p>
                <strong>Summary</strong>
              </p>

              <p>{job.summary}</p>
            </>
          )}

          {job.error && (
            <>
              <hr />

              <p className="text-red-500">
                {job.error}
              </p>
            </>
          )}

        </div>
      )}

    </div>
  );
}