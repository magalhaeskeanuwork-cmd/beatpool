'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SubmitSnippet() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestId = searchParams.get('requestId')
  const requestTitle = searchParams.get('title')
  const requestBudget = searchParams.get('budget')

  const [audio, setAudio] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timer, setTimer] = useState(10)
  const [submitted, setSubmitted] = useState(false)
  const [snippetId, setSnippetId] = useState(null)
  const [storagePath, setStoragePath] = useState(null)
  const [counterOffer, setCounterOffer] = useState('')
  const [showCounterOffer, setShowCounterOffer] = useState(false)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []
    mediaRecorder.ondataavailable = e => chunksRef.current.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      setAudio(blob)
      setAudioUrl(URL.createObjectURL(blob))
    }
    mediaRecorder.start()
    setRecording(true)
    setTimer(10)
    let t = 10
    timerRef.current = setInterval(() => {
      t -= 1
      setTimer(t)
      if (t <= 0) stopRecording()
    }, 1000)
  }

  function stopRecording() {
    clearInterval(timerRef.current)
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop())
    }
    setRecording(false)
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setAudio(file)
    setAudioUrl(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!audio) return
    setLoading(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be logged in.'); setLoading(false); return }

    const filename = `${user.id}-${Date.now()}.webm`
    const { error: uploadError } = await supabase.storage.from('snippets').upload(filename, audio)
    if (uploadError) { setError(uploadError.message); setLoading(false); return }

    const { data: { publicUrl } } = supabase.storage.from('snippets').getPublicUrl(filename)

    const { data, error: insertError } = await supabase.from('snippets').insert({
      request_id: requestId,
      producer_id: user.id,
      audio_url: publicUrl,
      counter_offer: counterOffer ? parseInt(counterOffer) : null,
    }).select().single()

    if (insertError) { setError(insertError.message); setLoading(false); return }

    setSnippetId(data.id)
    setStoragePath(filename)
    setSubmitted(true)
    setLoading(false)
  }

  async function handleDelete() {
    setLoading(true)
    if (storagePath) await supabase.storage.from('snippets').remove([storagePath])
    if (snippetId) await supabase.from('snippets').delete().eq('id', snippetId)
    setSubmitted(false)
    setSnippetId(null)
    setStoragePath(null)
    setAudio(null)
    setAudioUrl(null)
    setCounterOffer('')
    setLoading(false)
  }

  async function handleReplaceAudio(e) {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    if (storagePath) await supabase.storage.from('snippets').remove([storagePath])
    const { data: { user } } = await supabase.auth.getUser()
    const filename = `${user.id}-${Date.now()}.webm`
    const { error: uploadError } = await supabase.storage.from('snippets').upload(filename, file)
    if (uploadError) { setError(uploadError.message); setLoading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('snippets').getPublicUrl(filename)
    await supabase.from('snippets').update({ audio_url: publicUrl }).eq('id', snippetId)
    setStoragePath(filename)
    setAudioUrl(URL.createObjectURL(file))
    setLoading(false)
  }

  async function handleUpdateCounterOffer() {
    if (!snippetId) return
    setLoading(true)
    await supabase.from('snippets').update({ counter_offer: counterOffer ? parseInt(counterOffer) : null }).eq('id', snippetId)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 md:px-12 py-16 relative z-10">

        {/* Header */}
        <div className="border-b border-white/10 pb-12 mb-16">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-4">/ Submit snippet</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
            YOUR<br /><span className="text-red-600">SNIPPET</span>
          </h1>
          {requestTitle && (
            <p className="font-mono text-white/40 text-sm">
              Responding to: <span className="text-white">{requestTitle}</span>
              {requestBudget && <span className="text-green-400 ml-3 font-bold">${requestBudget}</span>}
            </p>
          )}
        </div>

        {!submitted ? (
          <div className="space-y-6">

            {/* Record */}
            <div className="border border-white/10 p-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-6">/ Record live</p>
              <div className="flex items-center gap-4">
                {!recording ? (
                  <button onClick={startRecording} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition">
                    Start recording
                  </button>
                ) : (
                  <button onClick={stopRecording} className="bg-white text-black font-black uppercase tracking-widest text-xs px-6 py-3 transition">
                    Stop
                  </button>
                )}
                {recording && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 animate-pulse" />
                    <span className="font-mono text-red-400 text-sm">{timer}s</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload */}
            <div className="border border-white/10 p-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-6">/ Or upload a file</p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="text-[10px] font-mono text-white/40 file:mr-4 file:py-2 file:px-4 file:border file:border-white/20 file:bg-transparent file:text-white file:text-[10px] file:font-black file:uppercase file:tracking-widest hover:file:border-white/40 transition"
              />
            </div>

            {/* Preview */}
            {audioUrl && (
              <div className="border border-white/10 p-8">
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-6">/ Preview</p>
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}

            {/* Counter offer */}
            <div className="border border-white/10 p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">/ Counter offer</p>
                <button
                  onClick={() => setShowCounterOffer(!showCounterOffer)}
                  className="text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white transition"
                >
                  {showCounterOffer ? 'Cancel' : '+ Add'}
                </button>
              </div>
              {showCounterOffer && (
                <div>
                  <p className="font-mono text-white/30 text-xs mb-4">
                    Propose a different price than the artist's budget of ${requestBudget ?? '—'}
                  </p>
                  <div className="flex items-center border border-white/10 hover:border-white/20 focus-within:border-white/40 transition">
                    <span className="text-white/30 font-mono px-4 border-r border-white/10">$</span>
                    <input
                      type="number"
                      value={counterOffer}
                      onChange={e => setCounterOffer(e.target.value)}
                      placeholder={requestBudget ?? '100'}
                      className="flex-1 bg-transparent px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-[10px] font-mono uppercase tracking-widest text-red-400">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !audio}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black uppercase tracking-widest py-4 text-sm transition"
            >
              {loading ? 'Uploading...' : 'Submit snippet →'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Success */}
            <div className="border border-green-500/20 bg-green-500/5 p-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-green-400 mb-1">✓ Snippet submitted</p>
              <p className="font-mono text-white/30 text-xs">The artist will be notified and can listen to your snippet.</p>
            </div>

            {/* Current audio */}
            <div className="border border-white/10 p-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-6">/ Your snippet</p>
              <audio controls src={audioUrl} className="w-full" />
            </div>

            {/* Replace */}
            <div className="border border-white/10 p-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-6">/ Replace audio</p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleReplaceAudio}
                className="text-[10px] font-mono text-white/40 file:mr-4 file:py-2 file:px-4 file:border file:border-white/20 file:bg-transparent file:text-white file:text-[10px] file:font-black file:uppercase file:tracking-widest hover:file:border-white/40 transition"
              />
            </div>

            {/* Update counter offer */}
            <div className="border border-white/10 p-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-6">/ Counter offer</p>
              <div className="flex gap-3">
                <div className="flex items-center border border-white/10 hover:border-white/20 focus-within:border-white/40 transition flex-1">
                  <span className="text-white/30 font-mono px-4 border-r border-white/10">$</span>
                  <input
                    type="number"
                    value={counterOffer}
                    onChange={e => setCounterOffer(e.target.value)}
                    placeholder={requestBudget ?? '100'}
                    className="flex-1 bg-transparent px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none"
                  />
                </div>
                <button
                  onClick={handleUpdateCounterOffer}
                  disabled={loading}
                  className="bg-white text-black hover:bg-red-600 hover:text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition disabled:opacity-40"
                >
                  Update
                </button>
              </div>
            </div>

            {error && <p className="text-[10px] font-mono uppercase tracking-widest text-red-400">{error}</p>}

            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full border border-red-500/30 hover:border-red-500 text-red-400 font-black uppercase tracking-widest py-4 text-xs transition disabled:opacity-40"
            >
              {loading ? 'Please wait...' : 'Delete submission'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}