'use client'

import { useEffect, useRef, useState } from 'react'

export default function WavePlayer({ url, username, date, badge, actions }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [bars] = useState(() =>
    Array.from({ length: 40 }, () => Math.random() * 0.7 + 0.3)
  )

  function togglePlay() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  function handleTimeUpdate() {
    setCurrentTime(audioRef.current.currentTime)
  }

  function handleLoadedMetadata() {
    setDuration(audioRef.current.duration)
  }

  function handleEnded() {
    setPlaying(false)
    setCurrentTime(0)
  }

  function handleSeek(e) {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / rect.width
    audioRef.current.currentTime = ratio * duration
    setCurrentTime(ratio * duration)
  }

  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration ? currentTime / duration : 0

  if (!url) return null

  return (
    <div className="bg-white/5 rounded-xl p-4">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-white/60">{username}</p>
          {badge}
        </div>
        <p className="text-xs text-white/30">{date}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center flex-shrink-0 transition"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <rect x="1" y="1" width="4" height="10" rx="1"/>
              <rect x="7" y="1" width="4" height="10" rx="1"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
              <path d="M2 1.5L11 6L2 10.5V1.5Z"/>
            </svg>
          )}
        </button>

        {/* Waveform bars */}
        <div
          className="flex-1 flex items-center gap-[2px] h-12 cursor-pointer"
          onClick={handleSeek}
        >
          {bars.map((height, i) => {
            const barProgress = i / bars.length
            const isPlayed = barProgress < progress
            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-colors"
                style={{
                  height: `${height * 100}%`,
                  background: isPlayed
                    ? '#ef4444'
                    : 'rgba(255,255,255,0.15)',
                }}
              />
            )
          })}
        </div>

        <span className="text-xs text-white/30 font-mono flex-shrink-0 min-w-[36px] text-right">
          {formatTime(currentTime)}
        </span>
      </div>

      {actions && <div className="flex items-center gap-2 mt-3">{actions}</div>}
    </div>
  )
}