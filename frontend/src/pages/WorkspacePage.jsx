import { useState } from "react";
import AppShell from "../components/layout/AppShell";
import TaskComposer from "../components/workspace/TaskComposer";
import OnboardingTour from "../components/workspace/OnboardingTour";
import Badge from "../components/ui/Badge";
import { Code2, Search, FileText } from "lucide-react";

export default function WorkspacePage() {
  const [selectedInitialMode, setSelectedInitialMode] = useState("auto");
  const [composerKey, setComposerKey] = useState(0);

  const starterDirections = [
    {
      title: "Build a service",
      desc: "Design and generate a small REST API with automated tests.",
      mode: "coding",
      tag: "CODE · 10 CR",
      icon: Code2,
      prompt: "Design and implement a resilient webhook verification service in Node.js with signature validation, retry policies and tests.",
    },
    {
      title: "Research a technical topic",
      desc: "Compare architectural approaches and summarize trade-offs.",
      mode: "search",
      tag: "SEARCH · 5 CR",
      icon: Search,
      prompt: "Compare PostgreSQL pgvector vs dedicated vector databases (Qdrant, Pinecone) for high-scale agent memory architectures.",
    },
    {
      title: "Create a technical report",
      desc: "Generate a formatted PDF summary with executive takeaways.",
      mode: "pdf",
      tag: "PDF · 10 CR",
      icon: FileText,
      prompt: "Generate a technical report evaluating microservices vs modular monoliths for early-stage AI engineering startups.",
    },
  ];

  const handleSelectDirection = (item) => {
    setSelectedInitialMode(item.mode);
    setComposerKey((k) => k + 1);
  };

  return (
    <AppShell title="New task">
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Workspace Empty State Heading */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--forge-accent)] mb-1">
              WORKSPACE / NEW TASK
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--forge-text)]">
              What are we working on?
            </h1>
            <p className="text-xs sm:text-sm text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed">
              Start with a brief. Choose a specialist mode or let the AgentForge router select execution nodes dynamically.
            </p>
          </div>

          {/* Centered Task Composer */}
          <div className="pt-2">
            <TaskComposer
              key={composerKey}
              initialMode={selectedInitialMode}
              centered={true}
              placeholder="Describe the task you want built or analyzed... (Shift+Enter for new line)"
            />
          </div>

          {/* Direction Starters & Mode Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {/* Left: Starters */}
            <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--forge-border)]">
                <h3 className="text-xs font-semibold text-[var(--forge-text)]">
                  Start with a direction
                </h3>
                <span className="text-[10px] font-mono text-[var(--forge-text-muted)]">
                  EXAMPLES
                </span>
              </div>

              <div className="space-y-2">
                {starterDirections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      onClick={() => handleSelectDirection(item)}
                      className="group flex items-center justify-between p-2.5 rounded-lg border border-[var(--forge-border)] bg-[var(--forge-surface-elevated)] hover:border-[var(--forge-accent)] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-[var(--forge-surface)] border border-[var(--forge-border)] flex items-center justify-center text-[var(--forge-accent)] flex-shrink-0 group-hover:bg-[var(--forge-accent)] group-hover:text-[var(--forge-accent-text)] transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-medium text-[var(--forge-text)] group-hover:text-[var(--forge-accent)] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-[var(--forge-text-muted)] truncate">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" size="xs" className="flex-shrink-0">
                        {item.tag}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Supported Modes */}
            <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--forge-border)]">
                <h3 className="text-xs font-semibold text-[var(--forge-text)]">
                  Supported modes
                </h3>
                <span className="text-[10px] font-mono text-[var(--forge-text-muted)]">
                  CATALOG
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--forge-accent)]/20 border border-[var(--forge-accent)]/40 text-[var(--forge-accent)] flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    ✧
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--forge-text)]">
                      Auto router
                    </div>
                    <div className="text-[11px] text-[var(--forge-text-muted)]">
                      Dynamically chooses best agent based on brief and files
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--forge-blue)]/20 border border-[var(--forge-blue)]/40 text-[var(--forge-blue)] flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    ◎
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--forge-text)]">
                      Team workflow <span className="font-mono text-[10px] text-[var(--forge-accent)]">(15 cr)</span>
                    </div>
                    <div className="text-[11px] text-[var(--forge-text-muted)]">
                      4-stage LangGraph execution: Planner → Researcher → Coder → Reviewer
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--forge-purple)]/20 border border-[var(--forge-purple)]/40 text-[var(--forge-purple)] flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    ⌘
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--forge-text)]">
                      Specialist agents <span className="font-mono text-[10px] text-[var(--forge-text-muted)]">(1–10 cr)</span>
                    </div>
                    <div className="text-[11px] text-[var(--forge-text-muted)]">
                      Coding · Web Search · PDF Document · PPT Deck · Image Generation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First session Onboarding Tour */}
      <OnboardingTour />
    </AppShell>
  );
}
