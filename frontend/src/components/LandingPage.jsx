import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Globe,
  FileText,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Terminal,
  Users,
  Presentation,
  Eye,
  Check,
  Shield,
  Layers,
  ChevronDown,
} from "lucide-react";

export default function LandingPage({ onOpenLogin }) {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const orchestrationSteps = [
    {
      agent: "Planner Agent",
      role: "Architectural Decomposition",
      status: "Plan Finalized",
      badge: "Step 01",
      color: "border-lime-400 text-lime-400",
      content: `1. Analyzed prompt: "Build reactive WebSocket crypto ticker dashboard"
2. Identified component hierarchy:
   - Header with status pip & 24h volume
   - PriceStreamer with real-time websocket listener
   - ChartWidget with historical trend lines
3. Defined state schema and dependencies.`,
    },
    {
      agent: "Researcher Agent",
      role: "Context & Dependency Auditing",
      status: "Strategy Approved",
      badge: "Step 02",
      color: "border-sky-400 text-sky-400",
      content: `1. Evaluated chart rendering performance for high-frequency ticks.
2. Selected lightweight canvas-based SVG renderer.
3. Formatted fallback REST polling if WebSocket disconnects.
4. Handled memory cleanup on component unmount.`,
    },
    {
      agent: "Collaborative Coder",
      role: "Full-Stack Code Synthesis",
      status: "3 Files Generated",
      badge: "Step 03",
      color: "border-indigo-400 text-indigo-400",
      content: `// App.jsx — Reactive Crypto Tracker
import React, { useState, useEffect } from 'react';
export default function CryptoTracker() {
  const [price, setPrice] = useState(68420.50);
  const [trend, setTrend] = useState('+4.2%');
  return (
    <div className="p-6 bg-slate-950 text-white rounded-2xl">
      <h2 className="text-xl font-bold">BTC / USD Real-Time Feed</h2>
      <div className="text-3xl font-mono text-lime-400">\${price}</div>
    </div>
  );
}`,
    },
    {
      agent: "Reviewer Agent",
      role: "Static Analysis & Security Audit",
      status: "Verified & Signed Off",
      badge: "Step 04",
      color: "border-emerald-400 text-emerald-400",
      content: `[AUDIT REPORT]
✓ Syntax validation: Zero parser errors.
✓ Memory leaks: useEffect cleanup listeners verified.
✓ Security check: Zero unescaped innerHTML injections.
✓ Decision: Approved for immediate in-browser Monaco sandbox execution.`,
    },
  ];

  const faqs = [
    {
      q: "How does the LangGraph collaborative multi-agent loop work?",
      a: "Unlike single-prompt chatbots, AgentForge executes a StateGraph state machine. When you submit a complex task, the Planner decomposes it, the Researcher audits technical constraints, the Coder generates multi-file source artifacts, and the Reviewer analyzes the code. If defects are found, it cycles back for revision before presenting the final verified artifact.",
    },
    {
      q: "Which LLM models power AgentForge?",
      a: "AgentForge runs on a high-availability multi-provider architecture. Primary ultra-fast inference is powered by Groq (Llama-3.3-70b-versatile). For multi-modal vision and prompt expansion, Google Gemini 2.0 Flash is used, with automated failover routing to OpenRouter.",
    },
    {
      q: "How do compute credits work?",
      a: "Every new account receives 50 free welcome credits upon signing in with Google. Standard chat requests cost 1 credit; multi-agent team workflows and full-stack coding runs cost between 3 to 10 credits based on reasoning depth and tools used. Credits are deducted atomically via MongoDB condition checking, preventing negative balances.",
    },
    {
      q: "Can I inspect, edit, and preview generated code live?",
      a: "Yes. All code outputs are rendered directly into the embedded Monaco code editor with multi-file tabs. You can edit the code in real-time, toggle a live sandboxed iframe preview, copy code with one click, or export the entire project as a ZIP bundle.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col selection:bg-lime-400/20 selection:text-lime-300 font-sans">
      {/* Background architectural grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#08090D]/85 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#141721] border border-lime-400/30 flex items-center justify-center text-lime-400 font-bold text-xs tracking-wider shadow-sm shadow-lime-400/10">
              AF
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">AgentForge</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-lime-400">
                v2.0
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#orchestration" className="hover:text-white transition">Orchestration</a>
            <a href="#agents" className="hover:text-white transition">Agent Ecosystem</a>
            <a href="#architecture" className="hover:text-white transition">Architecture</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#08090D] bg-lime-400 hover:bg-lime-300 transition shadow-md shadow-lime-400/15 cursor-pointer flex items-center gap-1.5"
            >
              Get Started Free
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="relative z-10 flex-1">
        {/* HERO SECTION */}
        <section className="pt-20 pb-16 md:pt-28 md:pb-24 px-6 text-center max-w-5xl mx-auto">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121520] border border-lime-400/25 text-lime-400 text-xs font-mono mb-8 shadow-sm">
            <Sparkles size={13} />
            <span>LANGGRAPH MULTI-AGENT STATE ENGINE</span>
            <ChevronRight size={12} className="text-slate-500" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            Orchestrate Autonomous <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-400 to-sky-300">
              AI Agent Teams.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            AgentForge coordinates specialized AI agents that collaboratively plan, research, code, review, and synthesize documents with real-time streaming and in-browser Monaco live preview.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-bold text-[#08090D] bg-lime-400 hover:bg-lime-300 shadow-xl shadow-lime-400/15 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              Start Building with 50 Free Credits
              <ArrowRight size={15} />
            </button>
            <a
              href="#orchestration"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-[#121520] hover:bg-[#181c2a] border border-white/[0.08] transition cursor-pointer flex items-center justify-center gap-2"
            >
              Explore Live Loop
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-lime-400" />
              <span>50 Free Welcome Credits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-lime-400" />
              <span>Sub-Second Groq Llama 3.3</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-lime-400" />
              <span>Monaco Live Code Sandbox</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE MULTI-AGENT ORCHESTRATION DEMO */}
        <section id="orchestration" className="max-w-6xl mx-auto px-6 mb-28">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-lime-400 mb-2">
              Autonomous Team Loop
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Watch Specialized Agents Hand Off Context
            </h3>
            <p className="text-slate-400 text-xs mt-2">
              Click each agent phase below to inspect its real-time thought chain, execution output, and validation gate:
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e15] overflow-hidden shadow-2xl">
            {/* Top Step Selector Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/[0.08] bg-[#10131c]">
              {orchestrationSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 text-left transition cursor-pointer border-b-2 ${
                    activeStep === idx
                      ? "border-lime-400 bg-[#161a26]"
                      : "border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{step.badge}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${step.color} bg-white/[0.02]`}>
                      {step.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">{step.agent}</div>
                  <div className="text-[11px] text-slate-400 truncate">{step.role}</div>
                </button>
              ))}
            </div>

            {/* Inspection Window */}
            <div className="p-6 md:p-8 bg-[#090b10] flex flex-col md:flex-row gap-6 items-start justify-between min-h-[300px]">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Active Inspection: {orchestrationSteps[activeStep].agent}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#121520] border border-white/[0.06] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {orchestrationSteps[activeStep].content}
                </div>
              </div>

              <div className="w-full md:w-72 p-4 rounded-xl bg-[#121520] border border-white/[0.06] space-y-3 shrink-0">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal size={14} className="text-lime-400" />
                  <span>State Metadata</span>
                </div>
                <div className="space-y-2 text-[11px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Workflow:</span>
                    <span className="text-slate-200">LangGraph v1.x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Iteration:</span>
                    <span className="text-slate-200">1 of 3 max</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handoff:</span>
                    <span className="text-lime-400">Next Node Valid</span>
                  </div>
                </div>
                <button
                  onClick={onOpenLogin}
                  className="w-full mt-3 py-2 rounded-lg bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/30 text-lime-400 text-xs font-semibold transition cursor-pointer"
                >
                  Run Custom Workflow →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SPECIALIZED AGENTS ECOSYSTEM (6 DOMAINS) */}
        <section id="agents" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-lime-400 mb-2">
              Capabilities
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              A Family of Domain-Expert AI Agents
            </h3>
            <p className="text-slate-400 text-xs mt-2">
              Each agent is equipped with targeted system instructions, credit governors, and output validators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Collaborative Team Loop",
                badge: "LangGraph StateGraph",
                desc: "An autonomous cycle where Planner, Researcher, Coder, and Reviewer iterate until requirements are satisfied.",
                icon: Users,
                color: "text-lime-400",
              },
              {
                title: "Full-Stack Coding Agent",
                badge: "Monaco Sandbox",
                desc: "Outputs complete multi-file React, HTML/CSS, and JS projects with instant live iframe browser execution.",
                icon: Code2,
                color: "text-sky-400",
              },
              {
                title: "Real-Time Web Search",
                badge: "Tavily Engine",
                desc: "Fetches up-to-the-minute web results, news, docs, and images for grounded, hallucination-free answers.",
                icon: Globe,
                color: "text-emerald-400",
              },
              {
                title: "PDF Document Synthesis",
                badge: "PDFKit Core",
                desc: "Generates formatted, publication-ready PDF documents complete with headers, tables, and auto-download links.",
                icon: FileText,
                color: "text-amber-400",
              },
              {
                title: "Presentation Deck Agent",
                badge: "PowerPoint PPTX",
                desc: "Transforms ideas into ready-to-present PowerPoint slide decks with titles, bullets, and corporate styling.",
                icon: Presentation,
                color: "text-rose-400",
              },
              {
                title: "Vision & PDF RAG",
                badge: "Qdrant Vector DB",
                desc: "Upload images for visual breakdown or documents for vector similarity search and grounded question-answering.",
                icon: Eye,
                color: "text-purple-400",
              },
            ].map((agent, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.06] hover:border-lime-400/30 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#141722] border border-white/[0.08] flex items-center justify-center">
                      <agent.icon size={18} className={agent.color} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-400">
                      {agent.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{agent.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ARCHITECTURE & SECURITY HIGHLIGHTS */}
        <section id="architecture" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-lime-400 mb-2">
              Engineering Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Enterprise-Grade Microservice Perimeter
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.06] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                <Shield size={18} />
              </div>
              <h4 className="text-sm font-bold text-white">Zero-Trust Internal Key</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All internal billing and credit endpoints require cryptographic internal service key verification. Public access is rejected at the API Gateway.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.06] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
                <Layers size={18} />
              </div>
              <h4 className="text-sm font-bold text-white">Atomic Balance Ledger</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Credit deductions execute atomically using conditional MongoDB operations, eliminating concurrent overspending and guaranteeing negative balance immunity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.06] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                <Cpu size={18} />
              </div>
              <h4 className="text-sm font-bold text-white">Resilient Cloud Fallbacks</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                In-memory vector search and in-memory S3 file buffers allow local development and air-gapped staging to operate seamlessly without cloud dependencies.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-lime-400 mb-2">
              Pricing Plans
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Transparent, Compute-Based Plans
            </h3>
            <p className="text-xs text-slate-400">Zero hidden costs. Upgrade only when you scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-7 rounded-2xl bg-[#0e1017] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Free Tier</h4>
                <p className="text-xs text-slate-400 mb-5">Ideal for experimenting with AI agents.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-500 font-mono">/ forever</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> 50 Free Welcome Credits</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> General Chat & Coding Agent</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> Web Search Context</div>
                </div>
              </div>
              <button
                onClick={onOpenLogin}
                className="mt-8 w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
              >
                Get Started
              </button>
            </div>

            {/* Starter */}
            <div className="p-7 rounded-2xl bg-[#121622] border-2 border-lime-400/40 shadow-xl shadow-lime-400/5 flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-lime-400 text-[10px] font-bold text-[#08090D] uppercase font-mono">
                Most Popular
              </span>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Starter Plan</h4>
                <p className="text-xs text-slate-400 mb-5">For developers building applications daily.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-white">$9.99</span>
                  <span className="text-xs text-slate-400 font-mono">/ 500 Credits</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> 500 Compute Credits</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> Collaborative Multi-Agent Teams</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> Monaco Sandbox Live Execution</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> PDF & PPT Synthesis Engines</div>
                </div>
              </div>
              <button
                onClick={onOpenLogin}
                className="mt-8 w-full py-2.5 rounded-xl text-xs font-bold text-[#08090D] bg-lime-400 hover:bg-lime-300 transition cursor-pointer shadow-md shadow-lime-400/10"
              >
                Choose Starter
              </button>
            </div>

            {/* Pro */}
            <div className="p-7 rounded-2xl bg-[#0e1017] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Pro Plan</h4>
                <p className="text-xs text-slate-400 mb-5">Maximum throughput for power builders.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-white">$19.99</span>
                  <span className="text-xs text-slate-400 font-mono">/ 1,500 Credits</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> 1,500 Compute Credits</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> Everything in Starter</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> Vector Document Collections</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-lime-400" /> Priority Processing Queue</div>
                </div>
              </div>
              <button
                onClick={onOpenLogin}
                className="mt-8 w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
              >
                Choose Pro
              </button>
            </div>
          </div>
        </section>

        {/* TECHNICAL FAQ SECTION */}
        <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-white/[0.06]">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-lime-400 mb-2">
              Knowledge Base
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] bg-[#0e1017] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-semibold text-white hover:bg-white/[0.02] transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${openFaq === i ? "rotate-180 text-lime-400" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM FINAL CALL TO ACTION */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <div className="p-10 md:p-14 rounded-3xl bg-[#0e1017] border border-lime-400/20 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Start Building with Autonomous Agents Today.
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
                Sign in with Google to claim your 50 welcome credits and start orchestrating your agent team.
              </p>
              <div className="pt-4">
                <button
                  onClick={onOpenLogin}
                  className="px-8 py-3.5 rounded-xl text-xs font-bold text-[#08090D] bg-lime-400 hover:bg-lime-300 shadow-xl shadow-lime-400/15 transition cursor-pointer inline-flex items-center gap-2"
                >
                  Claim 50 Free Credits
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#06070a] py-10 px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-lime-400 flex items-center justify-center text-[10px] font-bold text-black">
              AF
            </div>
            <span className="font-semibold text-slate-300">AgentForge</span>
            <span>• Autonomous Multi-Agent AI Platform</span>
          </div>
          <div>© {new Date().getFullYear()} AgentForge. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
