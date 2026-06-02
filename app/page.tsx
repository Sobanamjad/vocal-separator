'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [vocalsUrl, setVocalsUrl] = useState<string | null>(null);
  const [instrumentalUrl, setInstrumentalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeparate = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setVocalsUrl(null);
    setInstrumentalUrl(null);

    // Create form data
    const formData = new FormData();
    formData.append('audio', file);

    try {
      // Call your API route (we'll create this next)
      const response = await fetch('/api/separate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Separation failed');
      }

      const data = await response.json();
      setVocalsUrl(data.vocalsUrl);
      setInstrumentalUrl(data.instrumentalUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎵 AI Vocal Remover
          </h1>
          <p className="text-gray-300 text-lg">
            Upload any song - Get vocals & instrumental separated for FREE!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-white mb-2 font-semibold">
              Choose Audio File
            </label>
            <input
              type="file"
              accept=".mp3,.wav,.m4a"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-3 bg-white/20 rounded-lg text-white
                       file:mr-4 file:py-2 file:px-4 file:rounded-lg
                       file:bg-pink-500 file:text-white file:border-0
                       file:cursor-pointer hover:file:bg-pink-600"
            />
            {file && (
              <p className="text-green-300 text-sm mt-2">
                ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            onClick={handleSeparate}
            disabled={!file || loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 
                     rounded-xl font-bold text-white text-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              '🚀 Separate Now'
            )}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-300 text-center">{error}</p>
            </div>
          )}

          {(vocalsUrl || instrumentalUrl) && (
            <div className="mt-8 space-y-6">
              <div className="bg-white/5 rounded-xl p-5 border border-pink-500/30">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  🎤 Vocals Only
                </h3>
                <audio controls src={vocalsUrl || undefined} className="w-full mb-3 rounded-lg" />
                <a href={vocalsUrl || undefined} download="vocals.wav"
                  className="inline-flex items-center gap-2 text-pink-300 hover:text-pink-200 transition">
                  💾 Download Vocals
                </a>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  🎸 Instrumental
                </h3>
                <audio controls src={instrumentalUrl || undefined} className="w-full mb-3 rounded-lg" />
                <a href={instrumentalUrl || undefined} download="instrumental.wav"
                  className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition">
                  💾 Download Instrumental
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          🚀 Runs in browser | No servers needed
        </div>
      </div>
    </div>
  );
}