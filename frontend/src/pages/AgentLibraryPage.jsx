import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import {
  Sparkles,
  Layers,
  Code2,
  Search,
  FileText,
  Presentation,
  Image as ImageIcon,
  FileSearch,
  Eye,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const AGENTS = [
  {
    id: "auto",
    name: "Auto Router",
    category: "General",
    purpose: "Analyzes request intent and attachments to route to the optimal specialist.",
    bestFor: "General prompts, mixed briefs, or when unsure which agent to select.",
    output: "Dynamic (response, images, or multi-file code artifacts)",
    rate: "Dynamic",
    badgeVariant: "lime",
    icon: Sparkles,
    isSelectable: true,
  },
  {
    id: "team",
    name: "Team Orchestrator",
    category: "Engineering",
    purpose: "Coordinates multi-agent LangGraph execution: Planner → Researcher → Coder → Reviewer.",
    bestFor: "Full-stack features, complex architectures, refactoring, and multi-file projects.",
    output: "Architectural plan + verified code artifacts in Monaco",
    rate: "15 credits",
    badgeVariant: "lime",
    icon: Layers,
    isSelectable: true,
  },
  {
    id: "coding",
    name: "Collaborative Coder",
    category: "Engineering",
    purpose: "Direct code generation, script authoring, and bug fixing.",
    bestFor: "Single-component builds, API route implementation, algorithm puzzles.",
    output: "Clean, syntax-highlighted source code artifacts",
    rate: "10 credits",
    badgeVariant: "purple",
    icon: Code2,
    isSelectable: true,
  },
  {
    id: "search",
    name: "Web Researcher",
    category: "Research",
    purpose: "Performs live web queries with Tavily to retrieve current documentation and citations.",
    bestFor: "Benchmarking newer libraries, verifying breaking API changes, technical comparisons.",
    output: "Summarized research report with sources",
    rate: "5 credits",
    badgeVariant: "blue",
    icon: Search,
    isSelectable: true,
  },
  {
    id: "pdf",
    name: "PDF Generator",
    category: "Documents",
    purpose: "Generates structured PDF documents and technical whitepapers.",
    bestFor: "Formal client proposals, engineering specifications, executive summaries.",
    output: "Compiled PDF download link",
    rate: "10 credits",
    badgeVariant: "amber",
    icon: FileText,
    isSelectable: true,
  },
  {
    id: "ppt",
    name: "Presentation Deck",
    category: "Documents",
    purpose: "Generates slide presentations with formatted slide decks.",
    bestFor: "Product roadmap presentations, architecture pitches, meeting decks.",
    output: "Downloadable PowerPoint file",
    rate: "10 credits",
    badgeVariant: "amber",
    icon: Presentation,
    isSelectable: true,
  },
  {
    id: "vision",
    name: "Image Generator",
    category: "Visuals",
    purpose: "Generates creative illustrations and concept diagrams using image models.",
    bestFor: "UI mockup placeholders, product concept art, marketing visuals.",
    output: "High-resolution generated images with lightbox zoom",
    rate: "10 credits",
    badgeVariant: "lime",
    icon: ImageIcon,
    isSelectable: true,
  },
  {
    id: "pdf_rag",
    name: "PDF Document RAG",
    category: "Research",
    purpose: "Extracts and indexes text from an uploaded PDF to answer targeted technical questions.",
    bestFor: "Reading long API specs, legal contracts, or whitepapers.",
    output: "Grounded citations and contextual answers",
    rate: "10 credits",
    badgeVariant: "blue",
    icon: FileSearch,
    isSelectable: false,
    autoRouteNote: "Auto-routed when uploading a PDF in Auto mode",
  },
  {
    id: "image_analyzer",
    name: "Image Analyzer",
    category: "Visuals",
    purpose: "Inspects uploaded images, UI screenshots, and diagrams for layout and code conversion.",
    bestFor: "Converting screenshots to code, diagram analysis, OCR.",
    output: "Technical visual audit and code breakdown",
    rate: "5 credits",
    badgeVariant: "lime",
    icon: Eye,
    isSelectable: false,
    autoRouteNote: "Auto-routed when uploading an image in Auto mode",
  },
  {
    id: "chat",
    name: "Chat Assistant",
    category: "General",
    purpose: "Conversational explanation, ideation, and general engineering discussion.",
    bestFor: "Quick questions, syntax queries, concept explanations.",
    output: "Direct conversational text",
    rate: "1 credit",
    badgeVariant: "muted",
    icon: MessageSquare,
    isSelectable: true,
  },
];

const CATEGORIES = ["All", "General", "Engineering", "Research", "Documents", "Visuals"];

export default function AgentLibraryPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredAgents = AGENTS.filter(
    (a) => activeCategory === "All" || a.category === activeCategory
  );

  const handleUseMode = (agentId) => {
    navigate("/app", { state: { initialMode: agentId } });
  };

  return (
    <AppShell title="Agent Library">
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--forge-accent)] mb-1">
              CAPABILITIES / AGENT LIBRARY
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--forge-text)]">
              Choose the right specialist.
            </h1>
            <p className="text-xs sm:text-sm text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed max-w-2xl">
              A comprehensive catalog of autonomous agent nodes available across AgentForge. Some capabilities are triggered automatically when you attach files.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--forge-border)] no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[var(--forge-surface-elevated)] border border-[var(--forge-border-strong)] text-[var(--forge-accent)]"
                    : "text-[var(--forge-text-secondary)] hover:text-[var(--forge-text)] hover:bg-[var(--forge-surface)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Agent Rows List */}
          <div className="border border-[var(--forge-border)] rounded-2xl bg-[var(--forge-surface)] divide-y divide-[var(--forge-border)] overflow-hidden shadow-xs">
            {filteredAgents.map((agent) => {
              const Icon = agent.icon;

              return (
                <div
                  key={agent.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--forge-surface-elevated)]/50 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[var(--forge-surface-elevated)] border border-[var(--forge-border)] flex items-center justify-center text-[var(--forge-accent)] flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-semibold text-[var(--forge-text)]">
                          {agent.name}
                        </span>
                        <Badge variant={agent.badgeVariant} size="xs">
                          {agent.category}
                        </Badge>
                        <span className="text-[10px] font-mono text-[var(--forge-accent)] border border-[var(--forge-accent)]/30 px-1.5 py-0.5 rounded">
                          {agent.rate}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--forge-text-secondary)] leading-relaxed">
                        {agent.purpose}
                      </p>

                      <div className="text-[11px] text-[var(--forge-text-muted)] flex flex-wrap gap-x-3 gap-y-1 pt-1 font-mono">
                        <span>Best for: {agent.bestFor}</span>
                        <span>·</span>
                        <span>Output: {agent.output}</span>
                      </div>

                      {agent.autoRouteNote && (
                        <div className="text-[10px] text-[var(--forge-blue)] font-mono pt-0.5">
                          ℹ {agent.autoRouteNote}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0 pt-2 sm:pt-0">
                    {agent.isSelectable ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUseMode(agent.id)}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Use mode
                      </Button>
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--forge-text-muted)] border border-[var(--forge-border)] px-2 py-1 rounded">
                        AUTO ROUTED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanatory note */}
          <div className="text-xs text-[var(--forge-text-muted)] leading-relaxed pt-2">
            Credit rates correspond strictly to backend authorization rules. Actual deduction and routing occur atomically server-side upon task execution.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
