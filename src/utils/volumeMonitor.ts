
export class VolumeMonitor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private onVolumeChange: (isMuted: boolean) => void;
  private checkInterval: NodeJS.Timeout | null = null;
  private lastVolumeLevel = 0;
  private mutedCount = 0;

  constructor(onVolumeChange: (isMuted: boolean) => void) {
    this.onVolumeChange = onVolumeChange;
  }

  async startMonitoring() {
    try {
      // Get microphone access to detect if audio is working
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: false, noiseSuppression: false }
      });
      
      const AudioContextConstructor = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextConstructor();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      
      this.microphone.connect(this.analyser);
      this.analyser.fftSize = 256;
      
      this.startVolumeCheck();
      console.log('Volume monitoring started');
    } catch (error) {
      console.error('Could not start volume monitoring:', error);
    }
  }

  private startVolumeCheck() {
    this.checkInterval = setInterval(() => {
      if (!this.analyser) return;
      
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / bufferLength;
      
      // If volume is consistently very low, assume muted
      if (average < 5) {
        this.mutedCount++;
        if (this.mutedCount > 3) { // After 3 checks (6 seconds), consider muted
          this.onVolumeChange(true);
        }
      } else {
        this.mutedCount = 0;
        this.onVolumeChange(false);
      }
      
      this.lastVolumeLevel = average;
    }, 2000); // Check every 2 seconds
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    console.log('Volume monitoring stopped');
  }
}
