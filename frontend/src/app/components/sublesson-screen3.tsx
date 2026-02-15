import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, CheckCircle, RotateCcw } from 'lucide-react';

interface SublessonScreen3Props {
  wordPhrase: string;
  onComplete: () => void;
  onBack: () => void;
}

export default function SublessonScreen3({ 
  wordPhrase, 
  onComplete, 
  onBack 
}: SublessonScreen3Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(0);
  const [reRecordCount, setReRecordCount] = useState(0);
  
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fixed duration for recording (6 seconds - 3x a typical 2-second sign)
  const maxRecordingDuration = 6;

  // Start camera access
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false 
      });
      console.log('✅ Camera access granted');
      setStream(mediaStream);
    } catch (error) {
      console.error('❌ Error accessing camera:', error);
      alert('Could not access camera. Please allow camera permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Start recording
  const startRecording = () => {
    if (!stream) {
      console.error('❌ No stream available');
      return;
    }
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      console.log('📼 MediaRecorder stopped, processing chunks...');
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      console.log('📦 Blob created, size:', blob.size, 'bytes');
      setRecordedBlob(blob);
      setHasRecorded(true);
      
      setTimeout(() => {
        if (recordedVideoRef.current) {
          const url = URL.createObjectURL(blob);
          recordedVideoRef.current.src = url;
          recordedVideoRef.current.load();
          console.log('✅ Recording saved and loaded, URL:', url);
          
          recordedVideoRef.current.play().catch(err => {
            console.log('Auto-play blocked:', err);
          });
        } else {
          console.error('❌ recordedVideoRef.current is null!');
        }
        
        // If this is the second recording, auto-submit
        if (reRecordCount >= 1) {
          console.log('🎯 Second recording complete - auto-submitting in 2 seconds...');
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }, 100);
    };

    mediaRecorder.start();
    setIsRecording(true);
    console.log('🔴 Recording started');

    // Auto-stop after fixed duration
    const maxDuration = maxRecordingDuration * 1000;
    setRecordingTimeLeft(maxRecordingDuration);
    console.log(`⏱️ Max recording duration: ${maxRecordingDuration} seconds`);
    
    // Countdown timer
    const startTime = Date.now();
    countdownIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, maxRecordingDuration - elapsed);
      setRecordingTimeLeft(remaining);
      
      if (remaining <= 0 && countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }, 100);
    
    recordingTimerRef.current = setTimeout(() => {
      console.log('⏹️ Auto-stopping recording (max duration reached)');
      stopRecording();
    }, maxDuration);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('⏹️ Stopping recording');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      
      console.log('📹 Camera stream kept active for potential re-record');
    }
  };

  // Reset and try again
  const resetRecording = () => {
    const newCount = reRecordCount + 1;
    setReRecordCount(newCount);
    
    console.log(`🔄 Re-recording attempt ${newCount}/1`);
    
    setHasRecorded(false);
    setRecordedBlob(null);
    if (recordedVideoRef.current) {
      if (recordedVideoRef.current.src) {
        URL.revokeObjectURL(recordedVideoRef.current.src);
      }
      recordedVideoRef.current.src = '';
    }
    
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  // Attach camera stream
  useEffect(() => {
    if (stream && userVideoRef.current) {
      userVideoRef.current.srcObject = stream;
      console.log('✅ Camera stream attached');
    }
  }, [stream, hasRecorded]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3a3a38] via-[#4A4A48] to-[#3a3a38] text-[#F1F2EB]">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#A4C2A5] hover:text-[#F1F2EB] transition"
        >
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold">Welcome & Basics</h1>
        <div className="w-20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Instructions Section (replaces example video) */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#D8DAD3] flex items-center gap-2">
              <span className="bg-[#566246] rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
              Remember
            </h3>
            <div className="bg-[#3a3a38] rounded-2xl p-8 shadow-2xl aspect-video flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🤔</div>
                <h4 className="text-2xl font-bold text-[#A4C2A5] mb-3">Think back!</h4>
                <p className="text-[#D8DAD3]/70 text-lg">How do you sign:</p>
                <p className="text-4xl font-bold text-white mt-2">"{wordPhrase}"</p>
              </div>
            </div>
          </div>

          {/* User Recording Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#D8DAD3] flex items-center gap-2">
              <span className="bg-[#566246] rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
              Your Turn
            </h3>
            
            {!stream && !hasRecorded && (
              <div className="bg-[#3a3a38] rounded-2xl p-12 text-center shadow-2xl aspect-video flex flex-col items-center justify-center">
                <Video className="w-16 h-16 text-[#A4C2A5] mb-4" />
                <p className="text-[#D8DAD3]/50 mb-6">Ready to practice?</p>
                <button
                  onClick={startCamera}
                  className="bg-[#566246] hover:bg-[#4A4A48] text-white px-8 py-3 rounded-full font-semibold transition shadow-lg"
                >
                  Start Camera
                </button>
              </div>
            )}

          {stream && !hasRecorded && (
            <div className="space-y-4">
              <div className="relative bg-[#3a3a38] rounded-2xl overflow-hidden shadow-2xl">
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full aspect-video object-cover bg-black scale-x-[-1]"
                  onLoadedMetadata={() => console.log('✅ Camera stream loaded')}
                >
                  Your browser does not support video.
                </video>
                {isRecording && (
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">Recording</span>
                    </div>
                    <div className="bg-black bg-opacity-70 px-3 py-1 rounded-full">
                      <span className="text-xs font-mono text-white">
                        {Math.ceil(recordingTimeLeft)}s left
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex-1 bg-[#4A4A48] hover:bg-[#566246] text-white px-6 py-4 rounded-xl font-semibold transition shadow-lg"
                  >
                    Stop Recording
                  </button>
                )}
                <button
                  onClick={stopCamera}
                  className="px-6 py-4 bg-[#4A4A48] hover:bg-[#566246] rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {hasRecorded && (
            <div className="space-y-4">
              <div className="relative bg-[#3a3a38] rounded-2xl overflow-hidden shadow-2xl">
                <video
                  ref={recordedVideoRef}
                  controls
                  playsInline
                  className="w-full aspect-video object-cover bg-black scale-x-[-1]"
                  onLoadedData={() => {
                    console.log('✅ Recorded video loaded');
                    if (recordedVideoRef.current) {
                      recordedVideoRef.current.play().catch(err => {
                        console.log('Auto-play blocked:', err);
                      });
                    }
                  }}
                  onError={(e) => console.error('❌ Recorded video error:', e)}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {reRecordCount >= 1 ? (
                <div className="bg-[#566246]/20 border border-[#A4C2A5]/40 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-[#A4C2A5] mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-[#A4C2A5] mb-2">Great job!</h3>
                  <p className="text-[#D8DAD3]/70">Completing lesson...</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={resetRecording}
                    className="flex-1 bg-[#4A4A48] hover:bg-[#566246] text-white px-6 py-4 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Try Again (1 re-record left)
                  </button>
                  <button
                    onClick={onComplete}
                    className="flex-1 bg-[#566246] hover:bg-[#6b7a55] text-white px-6 py-4 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Complete
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-[#566246]/15 rounded-2xl p-6 border border-[#A4C2A5]/20">
          <h4 className="font-semibold text-lg mb-3 text-[#D8DAD3]">💡 Tips:</h4>
          <ul className="space-y-2 text-[#D8DAD3]/70">
            <li>• Remember what you learned - there's no example this time!</li>
            <li>• Make sure you're in a well-lit area</li>
            <li>• Keep your hands visible in the camera frame</li>
            <li>• Take your time - you have {maxRecordingDuration} seconds to sign</li>
          </ul>
        </div>
      </div>
    </div>
  );
}