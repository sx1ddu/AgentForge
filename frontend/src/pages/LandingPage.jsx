import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Code2,
  Search,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { useTheme } from "../context/ThemeContext";

const FAQS = [
  {
    q: "How does the multi-agent workflow operate?",
    a: "When you select Team mode or submit a complex request, AgentForge activates a 4-stage LangGraph execution graph: Planner (decomposes the objective), Researcher (gathers technical documentation when required), Collaborative Coder (synthesizes implementation files), and Reviewer (performs static analysis and quality review).",
  },
  {
    q: "How are credits consumed?",
    a: "Credits are deducted per completed task: Chat costs 1 credit, Search costs 5, Coding, PDF generation, Presentation, and Image generation each cost 10, and the multi-agent Team orchestrator costs 15 credits. Free accounts receive 100 credits upon sign-up.",
  },
  {
    q: "Can I inspect and download generated files?",
    a: "Yes. Every multi-file task opens in the read-only Artifact Inspector. You can switch between source files, copy snippets, download individual files, or test interactive HTML/CSS/JS components inside a sandboxed live preview.",
  },
  {
    q: "What file formats can I attach?",
    a: "You can attach a single file per request, including PDF documents, image files (.png, .jpg, .webp), and text or source code files (.txt, .json, .py, .js). When uploaded in Auto mode, PDFs and images automatically route to specialized RAG and visual inspection handlers.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const userData = useSelector((state) => state.user?.userData);
  const [openFaq, setOpenFaq] = useState(null);

  const handleStart = () => {
    if (userData) {
      navigate("/app");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--forge-canvas)] text-[var(--forge-text)] font-sans selection:bg-[var(--forge-accent)] selection:text-[var(--forge-accent-text)]">
      {/* 72px Editorial Navigation Bar */}
      <header className="h-[72px] border-b border-[var(--forge-border)] bg-[var(--forge-canvas)]/90 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--forge-accent)] text-[var(--forge-accent-text)] font-black text-xs flex items-center justify-center tracking-tight shadow-sm">
            AF
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-[var(--forge-text)]">
              AGENTFORGE
            </div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--forge-text-muted)]">
              THE WORKSPACE
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-xs text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] transition-colors cursor-pointer hidden sm:inline"
          >
            {theme === "dark" ? "Light theme" : "Dark theme"}
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleStart}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {userData ? "Go to Workspace" : "Start with Google"}
          </Button>
        </div>
      </header>

      {/* Hero Section: 48 / 52 Split */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (48%) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="lime" size="sm">
                AI WORK, DIRECTED
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.08] text-[var(--forge-text)]">
              Give complex work a team.
            </h1>

            <p className="text-sm sm:text-base text-[var(--forge-text-secondary)] leading-relaxed max-w-lg">
              Research, code and create with specialist AI agents in one inspectable workspace. Set the direction. Keep control of the output.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStart}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {userData ? "Open Workspace" : "Start with Google"}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById("workflow-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore the workflow
              </Button>
            </div>

            <div className="text-[10px] font-mono text-[var(--forge-text-muted)] pt-4 tracking-wider uppercase">
              RESEARCH &nbsp; / &nbsp; ENGINEERING &nbsp; / &nbsp; DOCUMENTS &nbsp; / &nbsp; VISUALS
            </div>
          </div>

          {/* Right Column (52%): Signature Work Rail Preview Card */}
          <div className="lg:col-span-6">
            <div className="bg-[var(--forge-surface)] border border-[var(--forge-border-strong)] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--forge-border)] text-[10px] font-mono text-[var(--forge-text-muted)]">
                <span>ILLUSTRATIVE WORKFLOW</span>
                <span className="text-[var(--forge-accent)]">AF / 04 STAGES</span>
              </div>

              {/* 4-Stage Work Rail */}
              <div className="space-y-4">
                {/* 01 Planner */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--forge-accent)] text-[var(--forge-accent-text)] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    01
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[var(--forge-text)]">
                      Planner Agent
                    </div>
                    <div className="text-[11px] text-[var(--forge-text-muted)]">
                      Breaks the brief into an architectural plan and subtasks
                    </div>
                  </div>
                </div>

                {/* 02 Researcher */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--forge-blue)]/20 border border-[var(--forge-blue)]/40 text-[var(--forge-blue)] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    02
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[var(--forge-text)]">
                      Researcher Agent <span className="text-[10px] text-[var(--forge-text-muted)] font-mono">(conditional)</span>
                    </div>
                    <div className="text-[11px] text-[var(--forge-text-muted)]">
                      Gathers technical context and audits dependencies
                    </div>
                  </div>
                </div>

                {/* 03 Coder */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--forge-purple)]/20 border border-[var(--forge-purple)]/40 text-[var(--forge-purple)] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    03
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[var(--forge-text)]">
                      Collaborative Coder
                    </div>
                    <div className="text-[11px] text-[var(--forge-text-muted)]">
                      Synthesizes full-stack code and inspectable source files
                    </div>
                  </div>
                </div>

                {/* 04 Reviewer */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--forge-amber)]/20 border border-[var(--forge-amber)]/40 text-[var(--forge-amber)] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    04
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[var(--forge-text)]">
                      Reviewer Agent
                    </div>
                    <div className="text-[11px] text-[var(--forge-text-muted)]">
                      Syntax validation, security checks and sign-off
                    </div>
                  </div>
                </div>
              </div>

              {/* Output Pill */}
              <div className="mt-5 p-3 rounded-xl bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--forge-accent)]" />
                  <span className="font-semibold text-[var(--forge-text)]">
                    Usable Output
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--forge-text-muted)]">
                  RESPONSE + INSPECTABLE ARTIFACTS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capability Index Strip (4 Core Pillars) */}
      <section className="border-y border-[var(--forge-border)] bg-[var(--forge-surface)]/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--forge-text)] uppercase tracking-wide">
              <Search className="w-4 h-4 text-[var(--forge-blue)]" />
              Research
            </div>
            <p className="text-xs text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed">
              Find current information and synthesize trade-offs with web search integration.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--forge-text)] uppercase tracking-wide">
              <Code2 className="w-4 h-4 text-[var(--forge-purple)]" />
              Engineering
            </div>
            <p className="text-xs text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed">
              Generate reliable, lint-clean code and multi-file project structures in Monaco.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--forge-text)] uppercase tracking-wide">
              <FileText className="w-4 h-4 text-[var(--forge-amber)]" />
              Documents
            </div>
            <p className="text-xs text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed">
              Produce formatted PDF technical summaries and structured PowerPoint decks.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--forge-text)] uppercase tracking-wide">
              <ImageIcon className="w-4 h-4 text-[var(--forge-accent)]" />
              Visuals
            </div>
            <p className="text-xs text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed">
              Synthesize visual illustrations and analyze uploaded image assets with vision models.
            </p>
          </div>
        </div>
      </section>

      {/* How the Work Moves Section */}
      <section id="workflow-section" className="max-w-6xl mx-auto px-6 sm:px-12 py-20">
        <div className="max-w-2xl mb-12">
          <Badge variant="lime" size="xs">
            HOW THE WORK MOVES
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--forge-text)] mt-2">
            One brief. Specialist execution. A usable result.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--forge-text-secondary)] mt-2 leading-relaxed">
            Choose Auto for routing or direct a specific mode. For complex engineering work, Team invokes a structured LangGraph workflow with full review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-xl p-5 space-y-3">
            <div className="text-[10px] font-mono text-[var(--forge-accent)] uppercase">
              STEP 01
            </div>
            <h3 className="text-sm font-semibold text-[var(--forge-text)]">
              Direct the Task
            </h3>
            <p className="text-xs text-[var(--forge-text-secondary)] leading-relaxed">
              Describe what needs to be built. Attach reference PDFs, images, or data schemas to provide grounded context.
            </p>
          </div>

          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-xl p-5 space-y-3">
            <div className="text-[10px] font-mono text-[var(--forge-blue)] uppercase">
              STEP 02
            </div>
            <h3 className="text-sm font-semibold text-[var(--forge-text)]">
              Orchestrated Execution
            </h3>
            <p className="text-xs text-[var(--forge-text-secondary)] leading-relaxed">
              Autonomous agents collaborate: planning the architecture, synthesizing source code, and executing review audits.
            </p>
          </div>

          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-xl p-5 space-y-3">
            <div className="text-[10px] font-mono text-[var(--forge-purple)] uppercase">
              STEP 03
            </div>
            <h3 className="text-sm font-semibold text-[var(--forge-text)]">
              Inspect & Export
            </h3>
            <p className="text-xs text-[var(--forge-text-secondary)] leading-relaxed">
              Examine generated files in Monaco, run HTML sandbox previews, copy snippets, and download deliverables.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Reconciled with Backend PLANS) */}
      <section className="border-t border-[var(--forge-border)] bg-[var(--forge-surface)]/40 py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <Badge variant="lime" size="xs">
              TRANSPARENT PRICING
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--forge-text)]">
              Keep your work moving.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--forge-text-secondary)]">
              Choose the credit volume suitable for your engineering workload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--forge-text)]">
                  Free
                </h3>
                <div className="text-3xl font-bold tracking-tight text-[var(--forge-text)] mt-3">
                  $0
                </div>
                <div className="text-[11px] text-[var(--forge-text-muted)] font-mono mt-1">
                  100 credits · 30 days
                </div>
                <ul className="text-xs text-[var(--forge-text-secondary)] space-y-2.5 mt-6 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                    Core specialist agent modes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                    Artifact Monaco inspector
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                    Web search & RAG extraction
                  </li>
                </ul>
              </div>
              <Button
                variant="secondary"
                size="md"
                onClick={handleStart}
                className="w-full"
              >
                {userData ? "Current plan" : "Get started"}
              </Button>
            </div>

            {/* Starter */}
            <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--forge-text)]">
                  Starter
                </h3>
                <div className="text-3xl font-bold tracking-tight text-[var(--forge-text)] mt-3">
                  $9.99
                </div>
                <div className="text-[11px] text-[var(--forge-text-muted)] font-mono mt-1">
                  500 credits · 30 days
                </div>
                <ul className="text-xs text-[var(--forge-text-secondary)] space-y-2.5 mt-6 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                    500 task credits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                    Multi-agent Team workflows
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                    Document & deck generation
                  </li>
                </ul>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleStart}
                className="w-full"
              >
                Choose Starter
              </Button>
            </div>

            {/* Pro */}
            <div className="bg-[var(--forge-surface-elevated)] border-2 border-[var(--forge-accent)] rounded-2xl p-6 flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-3 right-5">
                <Badge variant="lime" size="xs">
                  RECOMMENDED
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--forge-text)]">
                  Pro
                </h3>
                <div className="text-3xl font-bold tracking-tight text-[var(--forge-text)] mt-3">
                  $19.99
                </div>
                <div className="text-[11px] text-[var(--forge-text-muted)] font-mono mt-1">
                  1,500 credits · 30 days
                </div>
                <ul className="text-xs text-[var(--forge-text-secondary)] space-y-2.5 mt-6 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                    1,500 task credits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                    Heavy multi-agent synthesis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)]" />
                    High-volume development runs
                  </li>
                </ul>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleStart}
                className="w-full"
              >
                Choose Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-10 space-y-1">
          <Badge variant="muted" size="xs">
            QUESTIONS & ANSWERS
          </Badge>
          <h2 className="text-2xl font-bold text-[var(--forge-text)]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[var(--forge-border)] rounded-xl bg-[var(--forge-surface)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-[var(--forge-surface-elevated)] transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[var(--forge-text)]">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[var(--forge-text-muted)] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--forge-text-muted)] flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[var(--forge-text-secondary)] leading-relaxed border-t border-[var(--forge-border)]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--forge-border)] bg-[var(--forge-canvas)] px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--forge-text-muted)]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[var(--forge-text)]">AGENTFORGE</span>
          <span className="font-mono text-[10px]">THE AI COMMAND CENTER</span>
        </div>
        <div className="text-[11px]">
          © {new Date().getFullYear()} AgentForge. Production-grade multi-agent architecture.
        </div>
      </footer>
    </div>
  );
}
