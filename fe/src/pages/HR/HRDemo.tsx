import React, { useState, useRef, useEffect } from "react";
import { Button, Upload, Progress, Tag, Divider, type UploadProps } from "antd";
import {
  AudioOutlined,
  UploadOutlined,
  StopOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  DeleteOutlined,
  SoundOutlined,
} from "@ant-design/icons";

// ============================================================
// TYPES
// ============================================================
type Stage =
  | "idle"
  | "recording"
  | "recorded"
  | "uploading"
  | "transcribing"
  | "analyzing"
  | "done";

type Sentiment = "positive" | "negative";

interface Keyword {
  word: string;
  label: "positive" | "negative" | "neutral";
}

interface AnalysisResult {
  transcript: string;
  keywords: Keyword[];
  sentiment: Sentiment;
  confidence: number;
  summary: string;
}

// ============================================================
// MOCK DATA — replace with real API calls later
// ============================================================
const MOCK_POSITIVE: AnalysisResult = {
  transcript:
    "Tôi rất hài lòng với môi trường làm việc hiện tại. Đồng nghiệp rất thân thiện và hỗ trợ nhau nhiệt tình. Tôi cảm thấy được tôn trọng và có cơ hội phát triển rõ ràng trong công ty.",
  keywords: [
    { word: "hài lòng", label: "positive" },
    { word: "thân thiện", label: "positive" },
    { word: "hỗ trợ", label: "positive" },
    { word: "tôn trọng", label: "positive" },
    { word: "phát triển", label: "positive" },
    { word: "cơ hội", label: "positive" },
  ],
  sentiment: "positive",
  confidence: 94,
  summary:
    "Nhân viên thể hiện mức độ hài lòng cao với môi trường làm việc, đồng nghiệp và cơ hội nghề nghiệp. Rủi ro nghỉ việc thấp.",
};

const MOCK_NEGATIVE: AnalysisResult = {
  transcript:
    "Tôi thực sự rất mệt mỏi và áp lực với công việc hiện tại. Cảm thấy không được công nhận dù đã cố gắng hết sức. Khối lượng công việc quá lớn và không có sự hỗ trợ từ cấp trên.",
  keywords: [
    { word: "mệt mỏi", label: "negative" },
    { word: "áp lực", label: "negative" },
    { word: "không được công nhận", label: "negative" },
    { word: "quá lớn", label: "negative" },
    { word: "không có sự hỗ trợ", label: "negative" },
    { word: "cố gắng", label: "neutral" },
  ],
  sentiment: "negative",
  confidence: 89,
  summary:
    "Nhân viên biểu lộ sự mệt mỏi và thiếu động lực đáng lo ngại. Cần can thiệp sớm để giảm rủi ro nghỉ việc.",
};

// ============================================================
// SUB-COMPONENTS
// ============================================================
const WaveBar: React.FC<{ active: boolean; delay: string; height: string }> = ({
  active,
  delay,
  height,
}) => (
  <div
    className="w-1 rounded-full bg-[#1B2A4A] transition-all duration-150"
    style={{
      height: active ? height : "6px",
      opacity: active ? 0.9 : 0.2,
      animation: active ? `waveAnim 0.8s ${delay} ease-in-out infinite alternate` : "none",
    }}
  />
);

const WAVE_BARS = [
  { delay: "0ms",   h: "24px" },
  { delay: "80ms",  h: "40px" },
  { delay: "160ms", h: "56px" },
  { delay: "40ms",  h: "32px" },
  { delay: "120ms", h: "48px" },
  { delay: "200ms", h: "36px" },
  { delay: "60ms",  h: "44px" },
  { delay: "140ms", h: "28px" },
  { delay: "20ms",  h: "52px" },
  { delay: "100ms", h: "38px" },
];

// Highlight keywords in transcript
const HighlightedTranscript: React.FC<{
  transcript: string;
  keywords: Keyword[];
}> = ({ transcript, keywords }) => {
  const colorMap: Record<Keyword["label"], string> = {
    positive: "bg-green-100 text-green-800 border border-green-200",
    negative: "bg-orange-100 text-orange-800 border border-orange-200",
    neutral:  "bg-gray-100  text-gray-700  border border-gray-200",
  };

  // Split transcript into highlighted parts
  const sorted = [...keywords].sort((a, b) => b.word.length - a.word.length);
  const parts: Array<{ text: string; kw: Keyword | null }> = [
    { text: transcript, kw: null },
  ];

  sorted.forEach((kw) => {
    const updated: typeof parts = [];
    parts.forEach((part) => {
      if (part.kw !== null) { updated.push(part); return; }
      const idx = part.text.toLowerCase().indexOf(kw.word.toLowerCase());
      if (idx === -1) { updated.push(part); return; }
      const before  = part.text.slice(0, idx);
      const matched = part.text.slice(idx, idx + kw.word.length);
      const after   = part.text.slice(idx + kw.word.length);
      if (before) updated.push({ text: before, kw: null });
      updated.push({ text: matched, kw });
      if (after) updated.push({ text: after, kw: null });
    });
    parts.splice(0, parts.length, ...updated);
  });

  return (
    <p className="text-gray-700 leading-8 text-base">
      {parts.map((p, i) =>
        p.kw ? (
          <span
            key={i}
            className={`inline rounded px-1.5 py-0.5 mx-0.5 text-sm font-medium ${colorMap[p.kw.label]}`}
          >
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </p>
  );
};

// Typewriter effect
const useTypewriter = (text: string, speed = 28, active = false) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, active]);

  return { displayed, done };
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const HRDemo: React.FC = () => {
  const [stage, setStage]         = useState<Stage>("idle");
  const [file, setFile]           = useState<File | null>(null);
  const [result, setResult]       = useState<AnalysisResult | null>(null);
  const [progress, setProgress]   = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [recordSeconds, setRecordSeconds] = useState(0);

  const mediaRef    = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isProcessing = stage === "transcribing" || stage === "analyzing" || stage === "done";
  const { displayed: typewriterText } = useTypewriter(
    result?.transcript ?? "",
    24,
    isProcessing,
  );

  // ── Recording ──────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr     = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setFile(new File([blob], "recording.webm", { type: "audio/webm" }));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
      setRecordSeconds(0);
      setStage("recording");
      timerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch {
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setStage("recorded");
  };

  // ── Upload handler ──────────────────────────────────────────
  const uploadProps: UploadProps = {
    accept: "audio/*",
    showUploadList: false,
    beforeUpload: (f) => { setFile(f); setStage("recorded"); return false; },
  };

  // ── Simulate analysis pipeline ──────────────────────────────
  const runAnalysis = () => {
    setStage("uploading");
    setProgress(0);
    const mock = Math.random() > 0.5 ? MOCK_POSITIVE : MOCK_NEGATIVE;
    setResult(mock);
    let p = 0;

    setProgressLabel("Đang tải file lên máy chủ...");
    progressRef.current = setInterval(() => {
      p += 4;
      setProgress(Math.min(p, 30));
      if (p >= 30) {
        clearInterval(progressRef.current!);
        setStage("transcribing");
        setProgressLabel("Chuyển đổi giọng nói → văn bản (Whisper)...");
        progressRef.current = setInterval(() => {
          p += 2;
          setProgress(Math.min(p, 70));
          if (p >= 70) {
            clearInterval(progressRef.current!);
            setStage("analyzing");
            setProgressLabel("Phân tích cảm xúc (BERT Sentiment)...");
            progressRef.current = setInterval(() => {
              p += 3;
              setProgress(Math.min(p, 100));
              if (p >= 100) {
                clearInterval(progressRef.current!);
                setTimeout(() => setStage("done"), 400);
              }
            }, 80);
          }
        }, 60);
      }
    }, 60);
  };

  // ── Reset ───────────────────────────────────────────────────
  const reset = () => {
    if (timerRef.current)   clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setStage("idle");
    setFile(null);
    setResult(null);
    setProgress(0);
    setRecordSeconds(0);
  };

  const fmtSeconds = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Stepper ─────────────────────────────────────────────────
  const steps = ["Đầu vào", "Nhận dạng", "Phân tích", "Kết quả"];
  const stepIndex = (s: Stage) => {
    if (s === "idle" || s === "recorded")          return 0;
    if (s === "uploading" || s === "transcribing") return 1;
    if (s === "analyzing")                         return 2;
    return 3;
  };
  const currentStep = stepIndex(stage);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        @keyframes waveAnim {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseBg {
          0%, 100% { box-shadow: 0 0 0 0 rgba(27,42,74,0.35); }
          50%       { box-shadow: 0 0 0 14px rgba(27,42,74,0); }
        }
        .fade-up   { animation: fadeSlideUp 0.45s ease-out both; }
        .pulse-ring { animation: pulseBg 1.6s ease-in-out infinite; }
      `}</style>

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1B2A4A] flex items-center justify-center shrink-0">
            <SoundOutlined className="text-white text-base" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Phân Tích Giọng Nói Nhân Viên
            </h1>
            <p className="text-sm text-gray-500">
              Ghi âm hoặc tải file lên để phân tích cảm xúc và dự báo rủi ro nghỉ việc
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* ── Stepper ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((label, i) => {
              const done   = i < currentStep;
              const active = i === currentStep;
              return (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      done   ? "bg-[#1B2A4A] text-white" :
                      active ? "bg-[#1B2A4A] text-white ring-4 ring-[#1B2A4A]/20" :
                               "bg-gray-100 text-gray-400"
                    }`}>
                      {done ? <CheckCircleOutlined /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${active || done ? "text-[#1B2A4A]" : "text-gray-400"}`}>
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500 ${
                      i < currentStep ? "bg-[#1B2A4A]" : "bg-gray-200"
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Input Panel ── */}
        {(stage === "idle" || stage === "recording" || stage === "recorded") && (
          <div className="fade-up bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Chọn nguồn âm thanh
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Mic card */}
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 bg-gray-50">
                {stage === "recording" ? (
                  <>
                    <button
                      onClick={stopRecording}
                      className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-3xl text-white shadow-lg transition-all hover:scale-105"
                    >
                      <StopOutlined />
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-sm font-mono text-rose-600 font-semibold">
                        {fmtSeconds(recordSeconds)}
                      </span>
                    </div>
                    <div className="flex items-end gap-1 h-14">
                      {WAVE_BARS.map((b, i) => (
                        <WaveBar key={i} active={true} delay={b.delay} height={b.h} />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startRecording}
                      disabled={stage === "recorded"}
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white shadow-lg transition-all duration-200 ${
                        stage === "recorded"
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#1B2A4A] hover:bg-[#243B5E] hover:scale-105 pulse-ring"
                      }`}
                    >
                      <AudioOutlined />
                    </button>
                    <p className="text-sm text-gray-500 font-medium">Nhấn để ghi âm</p>
                  </>
                )}
              </div>

              {/* Upload card */}
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col items-center gap-3 bg-gray-50">
                <Upload {...uploadProps}>
                  <button
                    disabled={stage === "recording"}
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-md transition-all duration-200 ${
                      stage === "recording"
                        ? "bg-gray-200 text-gray-300 cursor-not-allowed"
                        : "bg-white border-2 border-dashed border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#EBF0F8] hover:scale-105"
                    }`}
                  >
                    <UploadOutlined />
                  </button>
                </Upload>
                <p className="text-sm text-gray-500 font-medium text-center">
                  {file && stage === "recorded" && file.name !== "recording.webm" ? (
                    <span className="text-[#1B2A4A] font-semibold">{file.name}</span>
                  ) : (
                    "Tải file âm thanh lên"
                  )}
                </p>
                <p className="text-xs text-gray-400 text-center">MP3, WAV, M4A, OGG · tối đa 50MB</p>
              </div>
            </div>

            {/* Ready bar */}
            {stage === "recorded" && file && (
              <div className="flex items-center justify-between bg-[#EBF0F8] rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <SoundOutlined className="text-[#1B2A4A] text-lg" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={reset}
                    className="rounded-lg text-gray-400 hover:text-rose-500!"
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={runAnalysis}
                    className="bg-[#1B2A4A]! border-none! rounded-xl! font-semibold! hover:bg-[#243B5E]!"
                  >
                    Phân tích ngay
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Processing Panel ── */}
        {(stage === "uploading" || stage === "transcribing" || stage === "analyzing") && (
          <div className="fade-up space-y-4">

            {/* Progress bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <LoadingOutlined className="text-[#1B2A4A] text-xl" style={{ animation: "spin 1s linear infinite" }} />
                <p className="text-sm font-semibold text-gray-700">{progressLabel}</p>
                <span className="ml-auto text-sm font-bold text-[#1B2A4A]">{progress}%</span>
              </div>
              <Progress
                percent={progress}
                strokeColor={{ "0%": "#1B2A4A", "100%": "#4A6FA5" }}
                strokeWidth={8}
                showInfo={false}
                className="[&_.ant-progress-bg]:transition-all [&_.ant-progress-inner]:bg-[#EBF0F8]"
              />
            </div>

            {/* Pipeline steps */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Tiến trình xử lý</p>
              <div className="space-y-4">
                {[
                  {
                    label:   "Upload file lên máy chủ",
                    sub:     "Mã hoá & truyền dữ liệu an toàn",
                    done:    progress > 30,
                    active:  stage === "uploading",
                  },
                  {
                    label:   "Whisper STT — Chuyển giọng nói → văn bản",
                    sub:     "OpenAI Whisper · nhận dạng tiếng Việt",
                    done:    progress > 70,
                    active:  stage === "transcribing",
                  },
                  {
                    label:   "BERT — Phân tích cảm xúc & gán nhãn",
                    sub:     "PhoBERT fine-tuned · sentiment classification",
                    done:    progress >= 100,
                    active:  stage === "analyzing",
                  },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 transition-all duration-300 ${
                      s.done   ? "bg-[#1B2A4A] text-white" :
                      s.active ? "border-2 border-[#1B2A4A] text-[#1B2A4A] bg-[#EBF0F8]" :
                                 "bg-gray-100 text-gray-400"
                    }`}>
                      {s.done   ? <CheckCircleOutlined /> :
                       s.active ? <LoadingOutlined style={{ animation: "spin 1s linear infinite" }} /> :
                                  i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${s.done || s.active ? "text-gray-900" : "text-gray-400"}`}>
                        {s.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                    </div>
                    {s.done && <CheckCircleOutlined className="text-green-500 mt-1" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Live typewriter preview */}
            {(stage === "transcribing" || stage === "analyzing") && result && (
              <div className="fade-up bg-white rounded-2xl border-2 border-[#1B2A4A]/20 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5 items-end h-5">
                    {[12, 18, 14, 20, 16].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-[#1B2A4A]"
                        style={{
                          height: `${h}px`,
                          animation: `waveAnim 0.6s ${i * 80}ms ease-in-out infinite alternate`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-[#1B2A4A]">
                    Đang chuyển đổi văn bản...
                  </p>
                </div>
                <p className="text-gray-700 text-sm leading-7 min-h-[2.5rem]">
                  {typewriterText}
                  <span className="inline-block w-0.5 h-4 bg-[#1B2A4A] ml-0.5 animate-pulse align-middle" />
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Result Panel ── */}
        {stage === "done" && result && (
          <div className="fade-up space-y-4">

            {/* Verdict card */}
            <div className={`rounded-2xl p-6 shadow-sm border-2 ${
              result.sentiment === "positive"
                ? "bg-green-50 border-green-200"
                : "bg-orange-50 border-orange-200"
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${
                    result.sentiment === "positive"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-orange-500 text-white shadow-lg"
                  }`}>
                    {result.sentiment === "positive"
                      ? <CheckCircleOutlined />
                      : <CloseCircleOutlined />}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                      Kết luận phân tích
                    </p>
                    <h2 className={`text-2xl font-bold ${
                      result.sentiment === "positive" ? "text-green-700" : "text-orange-700"
                    }`}>
                      {result.sentiment === "positive" ? "Tích cực ✓" : "Tiêu cực ✗"}
                    </h2>
                    <p className={`text-sm font-medium mt-0.5 ${
                      result.sentiment === "positive" ? "text-green-600" : "text-orange-600"
                    }`}>
                      {result.sentiment === "positive"
                        ? "Rủi ro nghỉ việc: Thấp"
                        : "Rủi ro nghỉ việc: Cao — Cần theo dõi"}
                    </p>
                  </div>
                </div>
                <div className="text-center bg-white/60 rounded-2xl px-6 py-3 border border-white/80">
                  <p className="text-xs text-gray-500 mb-1">Độ tin cậy</p>
                  <p className={`text-4xl font-bold ${
                    result.sentiment === "positive" ? "text-green-600" : "text-orange-600"
                  }`}>
                    {result.confidence}%
                  </p>
                </div>
              </div>
              <Divider className="my-4" style={{ borderColor: "rgba(0,0,0,0.08)" }} />
              <p className="text-sm text-gray-600 leading-relaxed">{result.summary}</p>
            </div>

            {/* Transcript with highlights */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Nội dung văn bản</p>
                  <p className="text-xs text-gray-400 mt-0.5">Từ khóa được tô màu theo nhãn</p>
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-green-200 border border-green-300 inline-block" />
                    Tích cực
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-orange-200 border border-orange-300 inline-block" />
                    Tiêu cực
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-gray-200 border border-gray-300 inline-block" />
                    Trung tính
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <HighlightedTranscript
                  transcript={result.transcript}
                  keywords={result.keywords}
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Từ khóa quan trọng ({result.keywords.length} từ)
              </p>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw, i) => (
                  <Tag
                    key={i}
                    color={
                      kw.label === "positive" ? "success" :
                      kw.label === "negative" ? "warning" : "default"
                    }
                    className="rounded-full px-3 py-1 text-sm font-medium border-0"
                  >
                    {kw.word}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div className="flex justify-center pt-2">
              <Button
                onClick={reset}
                size="large"
                className="rounded-full px-10 font-semibold border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#EBF0F8]!"
              >
                ← Phân tích đoạn âm thanh mới
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDemo;
