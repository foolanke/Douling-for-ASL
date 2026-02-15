import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Confetti } from "./confetti";
import { LessonCompleteModal } from "./lesson-complete-modal";
import { Sidebar } from "./sidebar";
import { LearningPath, type PathLesson } from "./learning-path";
import type { LessonStatus } from "./lesson-node";
import SublessonScreen from "./sublesson-screen1";
import SublessonScreen2 from "./sublesson-screen2";
import SublessonScreen3 from "./sublesson-screen3";
import {
  type LessonWord,
  type LessonSlot,
  type MasteryMap,
  defaultWordStats,
  generateSlots,
  overrideSlot3,
  overrideSlot5,
  generateUnitTestSlots,
  updateMastery,
} from "../lib/lesson-algorithm";
import { Zap } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string;
  type: "lesson" | "checkpoint" | "achievement";
  xp: number;
  unit: number;
  position: { x: number; y: number };
}

const lessons: Lesson[] = [
  // Unit 1: Greetings & Basics
  { id: 1, title: "Lesson 1", description: "Greetings", type: "lesson", xp: 10, unit: 1, position: { x: 280, y: 240 } },
  { id: 2, title: "Lesson 2", description: "Polite Expressions", type: "lesson", xp: 10, unit: 1, position: { x: 400, y: 520 } },
  { id: 3, title: "Lesson 3", description: "Politeness Markers", type: "lesson", xp: 15, unit: 1, position: { x: 200, y: 800 } },
  { id: 4, title: "Unit 1 Test", description: "Test your skills", type: "checkpoint", xp: 25, unit: 1, position: { x: 340, y: 1080 } },

  // Unit 2 (Family)
  { id: 5, title: "Lesson 4", description: "Family: Kids", type: "lesson", xp: 15, unit: 2, position: { x: 200, y: 1580 } },
  { id: 6, title: "Lesson 5", description: "Family: Adults", type: "lesson", xp: 15, unit: 2, position: { x: 380, y: 1860 } },
  { id: 7, title: "Lesson 6", description: "Family: Parents", type: "lesson", xp: 20, unit: 2, position: { x: 220, y: 2140 } },
  { id: 8, title: "Unit 2 Test", description: "Test your skills", type: "checkpoint", xp: 50, unit: 2, position: { x: 360, y: 2420 } },

  // Unit 3 (Daily Life)
  { id: 10, title: "Lesson 7", description: "Siblings", type: "lesson", xp: 20, unit: 3, position: { x: 190, y: 2840 } },
  { id: 11, title: "Lesson 8", description: "School Roles", type: "lesson", xp: 20, unit: 3, position: { x: 390, y: 3120 } },
  { id: 12, title: "Lesson 9", description: "Social Bonds", type: "lesson", xp: 25, unit: 3, position: { x: 210, y: 3400 } },
  { id: 13, title: "Unit 3 Test", description: "Checkpoint", type: "checkpoint", xp: 30, unit: 3, position: { x: 350, y: 3680 } },

  // Unit 4 (Out & About)
  { id: 14, title: "Lesson 11", description: "Places & Locations", type: "lesson", xp: 25, unit: 4, position: { x: 180, y: 4100 } },
  { id: 15, title: "Lesson 12", description: "Travel", type: "lesson", xp: 25, unit: 4, position: { x: 380, y: 4380 } },
  { id: 16, title: "Lesson 13", description: "Shopping", type: "lesson", xp: 30, unit: 4, position: { x: 220, y: 4660 } },
  { id: 17, title: "Lesson 14", description: "Weather", type: "lesson", xp: 30, unit: 4, position: { x: 400, y: 4940 } },
  { id: 18, title: "Lesson 15", description: "Time & Dates", type: "lesson", xp: 30, unit: 4, position: { x: 200, y: 5220 } },
  { id: 19, title: "Final Test", description: "You did it!", type: "achievement", xp: 100, unit: 4, position: { x: 300, y: 5540 } },
];

// Words for each lesson (keyed by lesson id)
const lessonWords: Record<number, LessonWord[]> = {
  1: [
    {
      word: "Hello",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson1-hello.mp4`,
      correctAnswer: "Hello",
      wrongAnswers: ["Goodbye", "Thank You", "Please", "Sorry"],
    },
    {
      word: "Goodbye",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson1-goodbye.mp4`,
      correctAnswer: "Goodbye",
      wrongAnswers: ["Hello", "Thank You", "Please", "Sorry"],
    },
  ],
  2: [
    {
      word: "Please",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson1-please.mp4`,
      correctAnswer: "Please",
      wrongAnswers: ["Thank You", "Hello", "Sorry", "Goodbye"],
    },
    {
      word: "Thank You",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson1-thank-you.mp4`,
      correctAnswer: "Thank You",
      wrongAnswers: ["Please", "Hello", "Sorry", "Goodbye"],
    },
  ],
  3: [
    {
      word: "Nice To Meet You",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson1-nice-to-meet-you.mp4`,
      correctAnswer: "Nice To Meet You",
      wrongAnswers: ["Sorry", "Hello", "Please", "Goodbye"],
    },
    {
      word: "Sorry",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson1-sorry.mp4`,
      correctAnswer: "Sorry",
      wrongAnswers: ["Nice To Meet You", "Hello", "Please", "Goodbye"],
    },
  ],

  // Unit 2 lessons
  5: [
    {
      word: "Boy",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson2-boy.mp4`,
      correctAnswer: "Boy",
      wrongAnswers: ["Girl", "Man", "Woman", "Father"],
    },
    {
      word: "Girl",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson2-girl.mp4`,
      correctAnswer: "Girl",
      wrongAnswers: ["Boy", "Woman", "Man", "Mother"],
    },
  ],
  6: [
    {
      word: "Man",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson2-man.mp4`,
      correctAnswer: "Man",
      wrongAnswers: ["Woman", "Boy", "Girl", "Father"],
    },
    {
      word: "Woman",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson2-woman.mp4`,
      correctAnswer: "Woman",
      wrongAnswers: ["Man", "Girl", "Boy", "Mother"],
    },
  ],
  7: [
    {
      word: "Father",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson2-father.mp4`,
      correctAnswer: "Father",
      wrongAnswers: ["Mother", "Man", "Boy", "Girl"],
    },
    {
      word: "Mother",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson2-mother.mp4`,
      correctAnswer: "Mother",
      wrongAnswers: ["Father", "Woman", "Girl", "Boy"],
    },
  ],

  // Unit 3 lessons
  10: [
    {
      word: "Brother",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson3-brother.mp4`,
      correctAnswer: "Brother",
      wrongAnswers: ["Sister", "Father", "Friend", "Student"],
    },
    {
      word: "Sister",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson3-sister.mp4`,
      correctAnswer: "Sister",
      wrongAnswers: ["Brother", "Mother", "Friend", "Teacher"],
    },
  ],
  11: [
    {
      word: "Student",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson3-student.mp4`,
      correctAnswer: "Student",
      wrongAnswers: ["Teacher", "Brother", "Friend", "Father"],
    },
    {
      word: "Teacher",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson3-teacher.mp4`,
      correctAnswer: "Teacher",
      wrongAnswers: ["Student", "Sister", "Mother", "Friend"],
    },
  ],
  12: [
    {
      word: "Family",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson3-family.mp4`,
      correctAnswer: "Family",
      wrongAnswers: ["Friend", "Brother", "Teacher", "Mother"],
    },
    {
      word: "Friend",
      videoPath: `${import.meta.env.BASE_URL}videos/lesson3-friend.mp4`,
      correctAnswer: "Friend",
      wrongAnswers: ["Family", "Sister", "Student", "Father"],
    },
  ],
};

// Lesson IDs belonging to each unit (used to build the unit test word pool)
const unitLessons: Record<number, number[]> = {
  1: [1, 2, 3],
  2: [5, 6, 7],
  3: [10, 11, 12],
  4: [14, 15, 16, 17, 18],
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Cumulative XP required to reach each level (index = level - 1)
const LEVEL_THRESHOLDS = [0, 20, 50, 95, 160, 250, 375, 550, 790, 1120, 1570];

function getLevelInfo(xp: number) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 500;
  const xpIntoLevel = xp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;

  return {
    level,
    xpForNextLevel: nextThreshold - xp,
    levelProgress: Math.round((xpIntoLevel / xpNeeded) * 100),
  };
}

// Build a lesson id → index lookup
const lessonIdToIndex = new Map<number, number>();
lessons.forEach((l, i) => lessonIdToIndex.set(l.id, i));

export function LessonPath() {
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(
    () => new Set<number>(loadFromStorage<number[]>("asl_completedLessons", []))
  );

  const [totalXP, setTotalXP] = useState<number>(() => loadFromStorage("asl_totalXP", 0));
  const [dailyGoal, setDailyGoal] = useState<number>(() => loadFromStorage("asl_dailyGoal", 0));
  const [streak, setStreak] = useState<number>(() => loadFromStorage("asl_streak", 3));

  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  // Persist state
  useEffect(() => {
    localStorage.setItem("asl_completedLessons", JSON.stringify(Array.from(completedLessons)));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem("asl_totalXP", JSON.stringify(totalXP));
  }, [totalXP]);

  useEffect(() => {
    localStorage.setItem("asl_dailyGoal", JSON.stringify(dailyGoal));
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem("asl_streak", JSON.stringify(streak));
  }, [streak]);

  // Slot-based lesson state
  const [activeView, setActiveView] = useState<"path" | "sublesson">("path");
  const [lessonSlots, setLessonSlots] = useState<LessonSlot[]>([]);
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);

  const masteryMap = useRef<MasteryMap>(loadFromStorage("asl_masteryMap", {}));
  const sessionResults = useRef<{ word: string; slotIndex: number; wasCorrect: boolean }[]>([]);

  const isUnitTest = useRef(false);
  const isSkipAttempt = useRef(false);
  const isReviewSession = useRef(false);
  const unitTestCorrectCount = useRef(0);

  // XP gate: if any SS1/SS3 fails (score 1-2), no lesson XP.
  const anySlotFailed = useRef(false);

  // Pass count across all slots in the current session (ss1/ss3: evaluated pass, ss2: correct)
  const slotPassCount = useRef(0);

  const currentUnitWords = useRef<LessonWord[]>([]);
  const lessonStartTime = useRef<number>(0);
  const [lessonDuration, setLessonDuration] = useState<number>(0);
  const [failReason, setFailReason] = useState<'skip' | 'lesson' | 'unit-test' | null>(null);
  const [isReviewModal, setIsReviewModal] = useState(false);

  const { level, xpForNextLevel, levelProgress } = getLevelInfo(totalXP);

  // Refs for measuring star positions for connecting paths
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pathLines, setPathLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      function getOffsetRelativeTo(el: HTMLElement, ancestor: HTMLElement) {
        let x = 0, y = 0;
        let current: HTMLElement | null = el;
        while (current && current !== ancestor) {
          x += current.offsetLeft;
          y += current.offsetTop;
          current = current.offsetParent as HTMLElement | null;
        }
        return { x, y };
      }

      const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
      for (let i = 0; i < lessons.length - 1; i++) {
        const a = nodeRefs.current[i];
        const b = nodeRefs.current[i + 1];
        if (!a || !b) continue;
        const aPos = getOffsetRelativeTo(a, container);
        const bPos = getOffsetRelativeTo(b, container);
        lines.push({
          x1: aPos.x + a.offsetWidth / 2,
          y1: aPos.y + a.offsetHeight / 2,
          x2: bPos.x + b.offsetWidth / 2,
          y2: bPos.y + b.offsetHeight / 2,
        });
      }
      setPathLines(lines);
    }, 300);
    return () => clearTimeout(timer);
  }, [completedLessons, activeView]);

  const completeLesson = useCallback((lessonIndex: number) => {
    const lesson = lessons[lessonIndex];

    // If this was a skip attempt, check pass rate (≥70% SS2 correct)
    if (isSkipAttempt.current) {
      const ss2Results = sessionResults.current;
      const correct = ss2Results.filter((r) => r.wasCorrect).length;
      const total = ss2Results.length;
      const passed = total > 0 && correct / total >= 0.7;

      setActiveView("path");
      setLessonSlots([]);
      setCurrentSlotIndex(0);
      sessionResults.current = [];
      isUnitTest.current = false;
      isSkipAttempt.current = false;
      currentUnitWords.current = [];

      if (passed) {
        // Mark all lessons in this unit as complete
        const unitLessonIndices = lessons
          .map((l, i) => ({ l, i }))
          .filter(({ l }) => l.unit === lesson.unit)
          .map(({ i }) => i);

        setCompletedLessons((prev) => {
          const newSet = new Set(prev);
          unitLessonIndices.forEach((i) => newSet.add(i));
          return newSet;
        });

        // Skip attempt still awards checkpoint XP on pass
        setTotalXP((prev) => prev + lesson.xp);
        setDailyGoal((prev) => prev + lesson.xp);

        setLessonDuration(Math.round((Date.now() - lessonStartTime.current) / 1000));
        setShowConfetti(true);
        setShowModal(true);
      } else {
        setFailReason('skip');
      }

      anySlotFailed.current = false;
      slotPassCount.current = 0;
      return;
    }

    const review = isReviewSession.current;
    const allSlotsPassed = !anySlotFailed.current;

    // ── Unit test pass/fail gate ──────────────────────────────────────────────
    if (isUnitTest.current) {
      const passed = slotPassCount.current >= 10;
      setActiveView("path");
      setLessonSlots([]);
      setCurrentSlotIndex(0);
      sessionResults.current = [];
      isUnitTest.current = false;
      isSkipAttempt.current = false;
      isReviewSession.current = false;
      unitTestCorrectCount.current = 0;
      currentUnitWords.current = [];
      anySlotFailed.current = false;
      slotPassCount.current = 0;

      if (passed) {
        setCompletedLessons((prev) => { const s = new Set(prev); s.add(lessonIndex); return s; });
        setTotalXP((prev) => prev + lesson.xp);
        setDailyGoal((prev) => prev + lesson.xp);
        setLessonDuration(Math.round((Date.now() - lessonStartTime.current) / 1000));
        setShowConfetti(true);
        setShowModal(true);
      } else {
        setFailReason('unit-test');
      }
      return;
    }

    // ── Regular lesson pass/fail gate (need ≥5/6 slots passed) ───────────────
    const lessonPassed = slotPassCount.current >= 5;

    if (!review && !lessonPassed) {
      setActiveView("path");
      setLessonSlots([]);
      setCurrentSlotIndex(0);
      sessionResults.current = [];
      isUnitTest.current = false;
      isSkipAttempt.current = false;
      isReviewSession.current = false;
      unitTestCorrectCount.current = 0;
      currentUnitWords.current = [];
      anySlotFailed.current = false;
      slotPassCount.current = 0;
      setFailReason('lesson');
      return;
    }

    // Mark completion (normal + review)
    if (!review) {
      setCompletedLessons((prev) => {
        const newSet = new Set(prev);
        newSet.add(lessonIndex);
        return newSet;
      });

      // ✅ Binary XP rule: any SS1/SS3 fail => 0 XP. SS1/SS3 pass => full lesson.xp
      if (allSlotsPassed) {
        setTotalXP((prev) => prev + lesson.xp);
        setDailyGoal((prev) => prev + lesson.xp);
      }
    }

    setLessonDuration(Math.round((Date.now() - lessonStartTime.current) / 1000));
    setIsReviewModal(review);

    // Confetti only when a NEW lesson is completed AND XP awarded
    setShowConfetti(!review && allSlotsPassed);

    setShowModal(true);

    setActiveView("path");
    setLessonSlots([]);
    setCurrentSlotIndex(0);

    sessionResults.current = [];
    isUnitTest.current = false;
    isSkipAttempt.current = false;
    isReviewSession.current = false;
    unitTestCorrectCount.current = 0;
    currentUnitWords.current = [];
    anySlotFailed.current = false;
    slotPassCount.current = 0;
  }, [setTotalXP, setDailyGoal]);

  const handleLessonClick = useCallback(
    (lessonIndex: number) => {
      const lesson = lessons[lessonIndex];
      setCurrentLesson(lesson);

      lessonStartTime.current = Date.now();
      sessionResults.current = [];
      anySlotFailed.current = false;

      if (lesson.type === "checkpoint") {
        const unitWords = (unitLessons[lesson.unit] ?? []).flatMap((id) => lessonWords[id] ?? []);
        if (unitWords.length > 0) {
          for (const w of unitWords) {
            if (!masteryMap.current[w.word]) masteryMap.current[w.word] = defaultWordStats();
          }

          isUnitTest.current = true;
          unitTestCorrectCount.current = 0;
          currentUnitWords.current = unitWords;

          setLessonSlots(generateUnitTestSlots(unitWords, masteryMap.current));
          setCurrentSlotIndex(0);
          setActiveView("sublesson");
        } else {
          completeLesson(lessonIndex);
        }
        return;
      }

      if (lesson.type === "achievement") {
        completeLesson(lessonIndex);
        return;
      }

      const words = lessonWords[lesson.id];
      if (lesson.type === "lesson" && words) {
        for (const w of words) {
          if (!masteryMap.current[w.word]) masteryMap.current[w.word] = defaultWordStats();
        }

        isUnitTest.current = false;
        isReviewSession.current = completedLessons.has(lessonIndex);
        currentUnitWords.current = [];

        setLessonSlots(generateSlots(words, masteryMap.current));
        setCurrentSlotIndex(0);
        setActiveView("sublesson");
      } else {
        completeLesson(lessonIndex);
      }
    },
    [completeLesson, completedLessons]
  );

  const handleSkipToTest = useCallback(
    (unitNumber: number) => {
      const checkpoint = lessons.find((l) => l.unit === unitNumber && l.type === "checkpoint");
      if (!checkpoint) return;

      const unitWords = (unitLessons[unitNumber] ?? []).flatMap((id) => lessonWords[id] ?? []);
      if (unitWords.length === 0) return;

      for (const w of unitWords) {
        if (!masteryMap.current[w.word]) masteryMap.current[w.word] = defaultWordStats();
      }

      setCurrentLesson(checkpoint);
      lessonStartTime.current = Date.now();
      sessionResults.current = [];
      anySlotFailed.current = false;

      isUnitTest.current = true;
      isSkipAttempt.current = true;
      unitTestCorrectCount.current = 0;
      currentUnitWords.current = unitWords;

      setLessonSlots(generateUnitTestSlots(unitWords, masteryMap.current));
      setCurrentSlotIndex(0);
      setActiveView("sublesson");
    },
    []
  );

  const handleSlotComplete = useCallback(
    (wasCorrect?: boolean, ss1ss3Passed?: boolean) => {
      const slot = lessonSlots[currentSlotIndex];
      if (!slot) return;

      const words = isUnitTest.current
        ? currentUnitWords.current
        : (lessonWords[currentLesson!.id] ?? []);

      // ✅ Gate XP based on SS1/SS3 score:
      // passed=true only when score is 3 or 4.
      if ((slot.type === "ss1" || slot.type === "ss3") && ss1ss3Passed === false) {
        anySlotFailed.current = true;
      }

      // Track per-slot pass for lesson/unit-test gates
      if (slot.type === "ss2") {
        if (wasCorrect === true) slotPassCount.current += 1;
      } else {
        // ss1 / ss3: count as pass unless explicitly failed
        if (ss1ss3Passed !== false) slotPassCount.current += 1;
      }

      // 1) Update mastery + persist
      masteryMap.current = updateMastery(masteryMap.current, slot, currentSlotIndex, wasCorrect);
      localStorage.setItem("asl_masteryMap", JSON.stringify(masteryMap.current));

      // 2) Track SS2 results (for unit test / overrides)
      if (slot.type === "ss2") {
        sessionResults.current.push({
          word: slot.word,
          slotIndex: currentSlotIndex,
          wasCorrect: wasCorrect ?? true,
        });
      }

      // 3) Runtime overrides
      let updatedSlots = lessonSlots;

      if (!isUnitTest.current) {
        if (currentSlotIndex === 2) {
          updatedSlots = overrideSlot3(lessonSlots, words, slot.word, wasCorrect ?? true);
          setLessonSlots(updatedSlots);
        } else if (currentSlotIndex === 4) {
          updatedSlots = overrideSlot5(lessonSlots, words, sessionResults.current, masteryMap.current);
          setLessonSlots(updatedSlots);
        }
      }

      // 4) Advance
      const nextIndex = currentSlotIndex + 1;
      if (nextIndex < updatedSlots.length) {
        setCurrentSlotIndex(nextIndex);
      } else {
        completeLesson(lessons.findIndex((l) => l.id === currentLesson!.id));
      }
    },
    [lessonSlots, currentSlotIndex, currentLesson, completeLesson]
  );

  const handleBack = useCallback(() => {
    setActiveView("path");
    setLessonSlots([]);
    setCurrentSlotIndex(0);
    sessionResults.current = [];
    isUnitTest.current = false;
    currentUnitWords.current = [];
    anySlotFailed.current = false;
    slotPassCount.current = 0;
    setCurrentLesson(null);
  }, []);

  const getLessonStatus = (lessonIndex: number): "locked" | "unlocked" | "completed" => {
    if (completedLessons.has(lessonIndex)) return "completed";
    if (lessonIndex === 0) return "unlocked";
    const previousCompleted = completedLessons.has(lessonIndex - 1);
    return previousCompleted ? "unlocked" : "locked";
  };

  // Build enriched lessons with status for the path component
  const pathLessons: PathLesson[] = useMemo(() => {
    // Find the first unlocked (non-completed) lesson index
    let firstUnlockedIndex = -1;
    for (let i = 0; i < lessons.length; i++) {
      if (!completedLessons.has(i)) {
        if (i === 0 || completedLessons.has(i - 1)) {
          firstUnlockedIndex = i;
          break;
        }
      }
    }

    return lessons.map((lesson, index) => {
      let status: LessonStatus;
      if (completedLessons.has(index)) {
        status = "completed";
      } else if (index === firstUnlockedIndex) {
        status = "current";
      } else if (index === 0 || completedLessons.has(index - 1)) {
        status = "available";
      } else {
        status = "locked";
      }

      return {
        ...lesson,
        status,
      };
    });
  }, [completedLessons]);

  // Handle click from the LearningPath component (receives lesson id, need to convert to index)
  const handlePathLessonClick = useCallback(
    (lessonId: number) => {
      const index = lessonIdToIndex.get(lessonId);
      if (index !== undefined) {
        handleLessonClick(index);
      }
    },
    [handleLessonClick]
  );

  // Render active sublesson slot
  if (activeView === "sublesson" && lessonSlots.length > 0) {
    const slot = lessonSlots[currentSlotIndex];
    const slotKey = `${currentSlotIndex}-${slot.type}-${slot.word}`;

    const unitNames = ["Greetings & Basics", "Family", "Daily Life", "Out & About"];
    const unitName = unitNames[(currentLesson?.unit ?? 1) - 1] ?? "ASL";

    if (slot.type === "ss1") {
      return (
        <SublessonScreen
          key={slotKey}
          wordPhrase={slot.word}
          videoPath={slot.videoPath}
          unitName={unitName}
          onComplete={(passed) => handleSlotComplete(undefined, passed)}
          onBack={handleBack}
        />
      );
    }
    if (slot.type === "ss2") {
      return (
        <SublessonScreen2
          key={slotKey}
          wordPhrase={slot.word}
          videoPath={slot.videoPath}
          correctAnswer={slot.correctAnswer}
          wrongAnswers={slot.wrongAnswers}
          unitName={unitName}
          onComplete={(correct) => handleSlotComplete(correct)}
          onBack={handleBack}
        />
      );
    }
    if (slot.type === "ss3") {
      return (
        <SublessonScreen3
          key={slotKey}
          wordPhrase={slot.word}
          unitName={unitName}
          onComplete={(passed) => handleSlotComplete(undefined, passed)}
          onBack={handleBack}
        />
      );
    }
  }

  // Otherwise, show the main lesson path
  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <Sidebar
        streak={streak}
        level={level}
        totalXP={totalXP}
        levelProgress={levelProgress}
        xpForNextLevel={xpForNextLevel}
        dailyGoal={dailyGoal}
        completedLessons={completedLessons.size}
        totalLessons={lessons.length}
        dictionary={Array.from(completedLessons).flatMap((index) => lessonWords[lessons[index]?.id] ?? [])}
      />

      <div className="flex-1 ml-80 flex flex-col h-screen relative">
        <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />

        {currentLesson && (
          <LessonCompleteModal
            isOpen={showModal}
            xpEarned={isReviewModal ? 0 : (!anySlotFailed.current ? currentLesson.xp : 0)}
            lessonTitle={currentLesson.title}
            duration={lessonDuration}
            isReview={isReviewModal}
            onContinue={() => {
              setShowModal(false);
              setCurrentLesson(null);
              setIsReviewModal(false);
            }}
          />
        )}

        {failReason !== null && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4">
            <motion.div
              className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Not quite yet!</h2>
              <p className="text-slate-400 mb-6">
                {failReason === 'lesson'
                  ? 'You need to pass at least 5 out of 6 sublessons to complete this lesson. Give it another try!'
                  : failReason === 'unit-test'
                  ? 'You need to pass at least 10 out of 12 questions to pass the unit test. Keep practicing and try again!'
                  : 'Work through the lessons to build up your skills, then try the unit test again.'}
              </p>
              <button
                onClick={() => {
                  setFailReason(null);
                  setCurrentLesson(null);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 text-lg font-bold rounded-xl shadow-lg transition"
              >
                Keep Practicing
              </button>
            </motion.div>
          </div>
        )}

        <div className="flex-1 overflow-x-hidden overflow-y-auto scroll-container relative" style={{ background: '#05050f' }}>
          {/* Full-width space background */}
          <div className="absolute inset-0 pointer-events-none" style={{ height: '5800px' }}>
            {/* Deep space gradient */}
            <div className="absolute inset-0 h-full" style={{
              background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0820 20%, #05050f 40%, #0a0618 60%, #0d0820 80%, #05050f 100%)',
            }} />

            {/* Pixelated star field - uses percentage-based x positions for full width */}
            <svg className="absolute inset-0 w-full pointer-events-none pixelated" style={{ height: '5800px', imageRendering: 'pixelated' }} preserveAspectRatio="none" viewBox="0 0 1000 5800">
              {/* Tiny dim stars */}
              {Array.from({ length: 200 }, (_, i) => {
                const x = ((i * 137 + 29) % 980) + 10;
                const y = ((i * 251 + 73) % 5400) + 50;
                const size = (i % 3 === 0) ? 2 : 1;
                const opacity = 0.2 + (i % 5) * 0.08;
                return <rect key={`s1-${i}`} x={x} y={y} width={size} height={size} fill="white" opacity={opacity} />;
              })}
              {/* Medium bright stars */}
              {Array.from({ length: 100 }, (_, i) => {
                const x = ((i * 193 + 47) % 960) + 20;
                const y = ((i * 317 + 113) % 5300) + 100;
                const opacity = 0.4 + (i % 4) * 0.1;
                return <rect key={`s2-${i}`} x={x} y={y} width={2} height={2} fill="white" opacity={opacity} />;
              })}
              {/* Bright stars with cross glow */}
              {Array.from({ length: 40 }, (_, i) => {
                const x = ((i * 277 + 83) % 940) + 30;
                const y = ((i * 439 + 157) % 5200) + 150;
                const colors = ['#ffffff', '#a5b4fc', '#c4b5fd', '#93c5fd', '#fde68a'];
                const color = colors[i % colors.length];
                return (
                  <g key={`s3-${i}`}>
                    <rect x={x} y={y} width={2} height={2} fill={color} opacity="0.9" />
                    <rect x={x - 2} y={y} width={1} height={2} fill={color} opacity="0.3" />
                    <rect x={x + 2} y={y} width={1} height={2} fill={color} opacity="0.3" />
                    <rect x={x} y={y - 2} width={2} height={1} fill={color} opacity="0.3" />
                    <rect x={x} y={y + 2} width={2} height={1} fill={color} opacity="0.3" />
                  </g>
                );
              })}
            </svg>

            {/* Pixel planet - top right */}
            <svg className="absolute top-16 right-16 pointer-events-none pixelated" width="48" height="48" style={{ imageRendering: 'pixelated' }}>
              <rect x="16" y="4" width="16" height="4" fill="#6366f1" />
              <rect x="8" y="8" width="32" height="4" fill="#818cf8" />
              <rect x="4" y="12" width="40" height="8" fill="#6366f1" />
              <rect x="4" y="20" width="40" height="8" fill="#4f46e5" />
              <rect x="8" y="28" width="32" height="4" fill="#4338ca" />
              <rect x="4" y="32" width="40" height="4" fill="#3730a3" />
              <rect x="8" y="36" width="32" height="4" fill="#4338ca" />
              <rect x="16" y="40" width="16" height="4" fill="#3730a3" />
              <rect x="0" y="22" width="4" height="2" fill="#a5b4fc" opacity="0.6" />
              <rect x="44" y="22" width="4" height="2" fill="#a5b4fc" opacity="0.6" />
              <rect x="0" y="24" width="8" height="2" fill="#818cf8" opacity="0.4" />
              <rect x="40" y="24" width="8" height="2" fill="#818cf8" opacity="0.4" />
              <rect x="12" y="12" width="8" height="4" fill="#a5b4fc" opacity="0.3" />
            </svg>

            {/* Small pixel moon - top left */}
            <svg className="absolute top-[100px] left-12 pointer-events-none pixelated" width="28" height="28" style={{ imageRendering: 'pixelated' }}>
              <rect x="8" y="0" width="12" height="4" fill="#e2e8f0" />
              <rect x="4" y="4" width="20" height="4" fill="#cbd5e1" />
              <rect x="4" y="8" width="20" height="4" fill="#e2e8f0" />
              <rect x="4" y="12" width="20" height="4" fill="#94a3b8" />
              <rect x="4" y="16" width="20" height="4" fill="#cbd5e1" />
              <rect x="8" y="20" width="12" height="4" fill="#94a3b8" />
              <rect x="8" y="8" width="4" height="4" fill="#94a3b8" opacity="0.5" />
              <rect x="16" y="14" width="3" height="3" fill="#94a3b8" opacity="0.4" />
            </svg>

            {/* Distant pixel galaxy */}
            <svg className="absolute top-[300px] right-[15%] pointer-events-none pixelated opacity-40" width="40" height="20" style={{ imageRendering: 'pixelated' }}>
              <rect x="16" y="8" width="8" height="4" fill="#c4b5fd" />
              <rect x="8" y="8" width="8" height="2" fill="#a78bfa" />
              <rect x="24" y="10" width="8" height="2" fill="#a78bfa" />
              <rect x="4" y="10" width="4" height="2" fill="#7c3aed" opacity="0.5" />
              <rect x="32" y="8" width="4" height="2" fill="#7c3aed" opacity="0.5" />
            </svg>

            {/* Extra decorations for wider area */}
            <svg className="absolute top-[600px] left-[8%] pointer-events-none pixelated opacity-30" width="32" height="32" style={{ imageRendering: 'pixelated' }}>
              <rect x="12" y="0" width="8" height="4" fill="#f0abfc" />
              <rect x="8" y="4" width="16" height="4" fill="#d946ef" />
              <rect x="4" y="8" width="24" height="8" fill="#c026d3" />
              <rect x="8" y="16" width="16" height="4" fill="#a21caf" />
              <rect x="12" y="20" width="8" height="4" fill="#86198f" />
            </svg>

            <svg className="absolute top-[1200px] right-[10%] pointer-events-none pixelated opacity-25" width="36" height="36" style={{ imageRendering: 'pixelated' }}>
              <rect x="14" y="2" width="8" height="4" fill="#67e8f9" />
              <rect x="6" y="6" width="24" height="4" fill="#22d3ee" />
              <rect x="2" y="10" width="32" height="8" fill="#06b6d4" />
              <rect x="6" y="18" width="24" height="4" fill="#0891b2" />
              <rect x="14" y="22" width="8" height="4" fill="#0e7490" />
              <rect x="0" y="16" width="4" height="2" fill="#67e8f9" opacity="0.5" />
              <rect x="32" y="16" width="4" height="2" fill="#67e8f9" opacity="0.5" />
            </svg>

            <svg className="absolute top-[2400px] left-[5%] pointer-events-none pixelated opacity-20" width="24" height="24" style={{ imageRendering: 'pixelated' }}>
              <rect x="8" y="0" width="8" height="4" fill="#fde68a" />
              <rect x="4" y="4" width="16" height="4" fill="#fbbf24" />
              <rect x="4" y="8" width="16" height="8" fill="#f59e0b" />
              <rect x="8" y="16" width="8" height="4" fill="#d97706" />
            </svg>

            <svg className="absolute top-[3600px] right-[8%] pointer-events-none pixelated opacity-30" width="28" height="28" style={{ imageRendering: 'pixelated' }}>
              <rect x="10" y="0" width="8" height="4" fill="#a5b4fc" />
              <rect x="6" y="4" width="16" height="4" fill="#818cf8" />
              <rect x="2" y="8" width="24" height="8" fill="#6366f1" />
              <rect x="6" y="16" width="16" height="4" fill="#4f46e5" />
              <rect x="10" y="20" width="8" height="4" fill="#4338ca" />
            </svg>
          </div>

          {/* Centered path content */}
          <div className="relative min-h-[5800px] mx-auto" style={{ width: 'min(720px, 100vw)', maxWidth: '720px' }}>
            <LearningPath lessons={pathLessons} onLessonClick={handlePathLessonClick} onSkipToTest={handleSkipToTest} />
          </div>
        </div>
      </div>
    </div>
  );
}
