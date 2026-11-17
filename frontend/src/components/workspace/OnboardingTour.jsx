import { useState } from "react";
import { Layers, Paperclip, Code2, ArrowRight, X } from "lucide-react";
import Button from "../ui/Button";

const STEPS = [
  {
    stepNum: "01",
    eyebrow: "FIRST SESSION / 01 OF 03",
    title: "Choose how work starts",
    description:
      "Select Auto to route requests dynamically, Team to run a 4-stage engineering graph (Planner → Researcher → Coder → Reviewer), or direct specialist agents for coding, search, documents, and visuals.",
    icon: Layers,
  },
  {
    stepNum: "02",
    eyebrow: "FIRST SESSION / 02 OF 03",
    title: "Add context with attachments",
    description:
      "Write your brief and attach a single file when needed. Uploading a PDF or image in Auto mode will automatically route to RAG extraction and visual inspection agents.",
    icon: Paperclip,
  },
  {
    stepNum: "03",
    eyebrow: "FIRST SESSION / 03 OF 03",
    title: "Inspect your output artifacts",
    description:
      "Multi-agent runs produce answers and verified multi-file source artifacts. Use the Artifact Inspector to view syntax-highlighted code, copy files, download assets, or run interactive HTML previews.",
    icon: Code2,
  },
];

export default function OnboardingTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem("agentforge_onboarding_dismissed");
  });

  const handleDismiss = () => {
    localStorage.setItem("agentforge_onboarding_dismissed", "true");
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  if (!isVisible) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[var(--forge-surface)] border border-[var(--forge-border-strong)] rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] p-1 rounded-md hover:bg-[var(--forge-surface-elevated)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicator Bars */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep
                  ? "bg-[var(--forge-accent)]"
                  : "bg-[var(--forge-border)]"
              }`}
            />
          ))}
        </div>

        {/* Eyebrow */}
        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--forge-accent)] mb-1">
          {step.eyebrow}
        </div>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 my-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] flex items-center justify-center text-[var(--forge-accent)] flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[var(--forge-text)] tracking-tight">
            {step.title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--forge-text-secondary)] leading-relaxed mt-2 mb-6">
          {step.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--forge-border)]">
          <button
            onClick={handleDismiss}
            className="text-xs text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] transition-colors cursor-pointer"
          >
            Skip walkthrough
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleNext}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {currentStep === STEPS.length - 1 ? "Start working" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
