// Audio synthesizers, sound effects, and microphone recorder for Tajweed Kids

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Playful sound effects
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

export function playStarSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.07);
      osc.stop(ctx.currentTime + i * 0.07 + 0.25);
    });
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

export function playSuccessFanfare() {
  try {
    const ctx = getAudioContext();
    const chords = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.1 },
      { f: 783.99, t: 0.2 },
      { f: 1046.5, t: 0.3 },
      { f: 1318.51, t: 0.45 },
    ];
    chords.forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + t);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.45);
    });
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

export function playBounceSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

export function playGhunnaHum() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime); // nasal resonance
    filter.Q.setValueAtTime(8, ctx.currentTime);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, ctx.currentTime + 1.2);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.6);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

export function playMaddStretch() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4 melodic pitch
    // Gentle vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(5, ctx.currentTime);
    lfoGain.gain.setValueAtTime(4, ctx.currentTime);
    lfo.connect(osc.frequency);
    lfo.start();
    lfo.stop(ctx.currentTime + 2.5);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime + 2.0);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

export function playTryAgainSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

// Qari Letter & Word Recitation Synthesizer with Speech Synthesis + Harmonized Formant Support
export function speakTajweedLetter(text: string, transliteration?: string, ruleType?: string) {
  try {
    // If browser supports SpeechSynthesis with Arabic, use it with child-friendly pitch
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('SA') || v.lang.includes('EG'));
      const urVoice = voices.find(v => v.lang.startsWith('ur') || v.lang.includes('PK'));

      if (arVoice) {
        utterance.voice = arVoice;
        utterance.lang = arVoice.lang;
      } else if (urVoice) {
        utterance.voice = urVoice;
        utterance.lang = urVoice.lang;
      } else {
        utterance.lang = 'ar-SA';
      }

      utterance.rate = 0.85; // slightly slower for clear Tajweed listening
      utterance.pitch = 1.05; // warm, gentle Qari teacher pitch
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {
    console.warn('SpeechSynthesis error:', e);
  }

  // Also trigger corresponding acoustic resonance based on rule
  if (ruleType === 'qualqalah' || text.includes('ْ')) {
    playBounceSound();
  } else if (ruleType === 'ghunna' || text.includes('ّ')) {
    playGhunnaHum();
  } else if (ruleType === 'madd' || text.includes('آ') || text.includes('~')) {
    playMaddStretch();
  } else {
    playClickSound();
  }
}

// Microphone Recorder Class
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;

  async start(onVolumeUpdate?: (volume: number) => void): Promise<boolean> {
    try {
      this.audioChunks = [];
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Analyser for real-time waveform visualization
      const ctx = getAudioContext();
      const source = ctx.createMediaStreamSource(this.stream);
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        if (onVolumeUpdate) {
          onVolumeUpdate(normalized);
        }
        this.animationFrameId = requestAnimationFrame(updateMeter);
      };
      updateMeter();

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      return false;
    }
  }

  stop(): Promise<string | null> {
    return new Promise((resolve) => {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Stop audio tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }
        resolve(audioUrl);
      };

      this.mediaRecorder.stop();
    });
  }
}
