import { useState, useRef } from 'react';
import { ArrowLeft, Play, Pause, CheckCircle, X } from 'lucide-react';

interface MultipleChoiceQuizProps {
  wordPhrase: string;
  videoPath: string;
  correctAnswer: string;
  wrongAnswers: string[];
  onComplete: (wasCorrect: boolean) => void;
  onBack: () => void;
}

export default function MultipleChoiceQuiz({ 
  wordPhrase, 
  videoPath, 
  correctAnswer,
  wrongAnswers,
  onComplete, 
  onBack 
}: MultipleChoiceQuizProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const firstAttemptCorrect = useRef<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Shuffle answers
  const [options] = useState(() => {
    const allOptions = [correctAnswer, ...wrongAnswers];
    return allOptions.sort(() => Math.random() - 0.5);
  });

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAnswerClick = (answer: string) => {
    if (hasAnswered) return;

    setSelectedAnswer(answer);
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);

    // Record first attempt only (retries don't change the mastery signal)
    if (firstAttemptCorrect.current === null) {
      firstAttemptCorrect.current = correct;
    }

    if (correct) {
      setTimeout(() => {
        onComplete(firstAttemptCorrect.current ?? true);
      }, 1500);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setHasAnswered(false);
  };

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
        <h1 className="text-2xl font-bold">Greetings</h1>
        <div className="w-20"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#A4C2A5] mb-2">What sign is this?</h2>
          <p className="text-[#D8DAD3]/70">Watch the video and select the correct answer</p>
        </div>

        {/* Video Section */}
        <div className="mb-8">
          <div className="relative bg-[#3a3a38] rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
            <video
              ref={videoRef}
              src={videoPath}
              controls
              className="w-full aspect-video object-cover bg-black"
              preload="auto"
              playsInline
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={() => console.log('✅ Video loaded')}
              onError={(e) => console.error('❌ Video error:', e)}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 max-w-2xl mx-auto">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const showCorrect = hasAnswered && option === correctAnswer;
            const showWrong = hasAnswered && isSelected && !isCorrect;
            
            let buttonClass = "w-full px-6 py-4 rounded-xl font-semibold text-lg transition shadow-lg flex items-center justify-between ";
            
            if (showCorrect) {
              buttonClass += "bg-[#566246] text-white border-2 border-[#A4C2A5]";
            } else if (showWrong) {
              buttonClass += "bg-red-600 text-white border-2 border-red-400";
            } else if (isSelected) {
              buttonClass += "bg-[#566246] text-white border-2 border-[#A4C2A5]";
            } else {
              buttonClass += "bg-[#4A4A48] hover:bg-[#566246] text-white border-2 border-transparent";
            }
            
            if (hasAnswered) {
              buttonClass += " cursor-default";
            } else {
              buttonClass += " cursor-pointer hover:scale-102";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                className={buttonClass}
                disabled={hasAnswered}
              >
                <span>{option}</span>
                {showCorrect && <CheckCircle className="w-6 h-6" />}
                {showWrong && <X className="w-6 h-6" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {hasAnswered && (
          <div className="mt-8 max-w-2xl mx-auto">
            {isCorrect ? (
              <div className="bg-[#566246]/20 border border-[#A4C2A5]/40 rounded-xl p-6 text-center">
                <CheckCircle className="w-16 h-16 text-[#A4C2A5] mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-[#A4C2A5] mb-2">Correct! 🎉</h3>
                <p className="text-[#D8DAD3]/70">Great job! Moving to next lesson...</p>
              </div>
            ) : (
              <div className="bg-red-900/20 border border-red-600/40 rounded-xl p-6 text-center">
                <X className="w-16 h-16 text-red-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-red-300 mb-2">Not quite!</h3>
                <p className="text-[#D8DAD3]/70 mb-4">The correct answer is "{correctAnswer}"</p>
                <button
                  onClick={handleTryAgain}
                  className="bg-[#566246] hover:bg-[#4A4A48] text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-[#566246]/15 rounded-2xl p-6 border border-[#A4C2A5]/20 max-w-2xl mx-auto">
          <h4 className="font-semibold text-lg mb-3 text-[#D8DAD3]">💡 Tip:</h4>
          <p className="text-[#D8DAD3]/70">You can replay the video as many times as you need before selecting your answer!</p>
        </div>
      </div>
    </div>
  );
}