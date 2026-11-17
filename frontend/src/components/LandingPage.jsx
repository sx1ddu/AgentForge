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
} from "lucide-react";

const LandingPage = ({ onOpenLogin }) => {
  const [activeTab, setActiveTab] = useState("team");

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#090a0f]/80 border-b border-white/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <span className="text-sm font-black tracking-wider text-white">AF</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AgentForge
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                  v2.0
                </span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#agents" className="hover:text-white transition">Agent Ecosystem</a>
            <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl text-[13.5px] font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onOpenLogin}
              className="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 border border-indigo-400/20 transition cursor-pointer flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {/* HERO SECTION */}
        <section className="pt-20 pb-16 md:pt-28 md:pb-24 px-6 text-center max-w-5xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-indigo-300 text-xs font-medium mb-8 backdrop-blur-sm shadow-inner">
            <Sparkles size={13} className="text-indigo-400 animate-pulse" />
            <span>Autonomous Multi-Agent AI Platform</span>
            <ChevronRight size={13} className="text-slate-500" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
            Orchestrate Autonomous <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200">
              AI Agent Teams.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            AgentForge coordinates specialized AI agents that collaboratively plan, research, code, review, and synthesize documents with real-time streaming and in-browser live previews.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/25 border border-indigo-400/30 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              Start Building Free
              <ArrowRight size={16} />
            </button>
            <a
              href="#preview"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] transition cursor-pointer flex items-center justify-center gap-2"
            >
              Explore Live Demo
            </a>
          </div>

          {/* Value Props Pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>50 Free Credits on Signup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>LangGraph Orchestration</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WORKSPACE PREVIEW */}
        <section id="preview" className="max-w-6xl mx-auto px-6 mb-28">
          <div className="rounded-2xl border border-white/[0.1] bg-[#0f1118]/90 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/[0.05]">
            {/* Window Top Bar */}
            <div className="h-11 px-4 bg-[#0a0c12] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-4 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-slate-400">
                agentforge.cloud/workspace/collaborative-team
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium text-emerald-400">4 Agents Connected</span>
              </div>
            </div>

            {/* Mock Workspace Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Left Agent Tabs */}
              <div className="lg:col-span-3 border-r border-white/[0.06] bg-[#0c0e15] p-4 flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-2 mb-1">
                  Active Agent Mode
                </span>
                {[
                  { id: "team", name: "Collaborative Team", icon: Users, desc: "Planner → Coder → Reviewer" },
                  { id: "code", name: "Full-Stack Coding", icon: Code2, desc: "Multi-file sandbox generation" },
                  { id: "search", name: "Web Research", icon: Globe, desc: "Tavily grounded search" },
                  { id: "doc", name: "Document Synthesis", icon: FileText, desc: "PDF & PPT slide decks" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl text-left transition cursor-pointer ${
                      activeTab === item.id
                        ? "bg-indigo-600/15 border border-indigo-500/30 text-white"
                        : "hover:bg-white/[0.03] text-slate-400"
                    }`}
                  >
                    <item.icon size={18} className={activeTab === item.id ? "text-indigo-400 mt-0.5" : "text-slate-500 mt-0.5"} />
                    <div>
                      <div className="text-xs font-semibold">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Center Simulation Area */}
              <div className="lg:col-span-9 p-6 flex flex-col justify-between bg-[#0a0c12]">
                <div className="space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-md bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-white shadow-md">
                      Build a real-time reactive Crypto Dashboard with Bitcoin price ticker and charts in React.
                    </div>
                  </div>

                  {/* Collaborative Execution Flow */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
                      <Cpu size={14} className="animate-spin text-indigo-400" />
                      <span>Planner Agent: Architectural decomposition completed (3 components, WebSocket feed)</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#121520] border border-white/[0.06] text-xs space-y-3 font-mono">
                      <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/[0.06]">
                        <span className="flex items-center gap-2">
                          <Terminal size={14} className="text-emerald-400" />
                          <span>App.jsx • Multi-File Project Generated</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Reviewer Approved
                        </span>
                      </div>
                      <div className="text-slate-300">
                        <span className="text-indigo-400 font-semibold">import</span> React, &#123; useState, useEffect &#125; <span className="text-indigo-400 font-semibold">from</span> 'react';<br />
                        <span className="text-indigo-400 font-semibold">export default function</span> <span className="text-amber-300">CryptoTracker</span>() &#123;<br />
                        &nbsp;&nbsp;<span className="text-slate-500">// Real-time streaming WebSocket price feed with live charts</span><br />
                        &nbsp;&nbsp;<span className="text-indigo-400 font-semibold">const</span> [price, setPrice] = useState(68420);<br />
                        &nbsp;&nbsp;<span className="text-indigo-400 font-semibold">return</span> &lt;<span className="text-indigo-300">Dashboard</span> ticker="BTC" livePrice=&#123;price&#125; /&gt;;<br />
                        &#125;
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Live execution with token streaming and in-browser preview ready.
                  </div>
                  <button
                    onClick={onOpenLogin}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    Open in Workspace
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SPECIALIZED AGENTS ECOSYSTEM */}
        <section id="agents" className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
              Specialized Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              A Family of Domain-Expert AI Agents
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Each agent is purpose-built with dedicated system prompts, toolsets, and validation logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Collaborative Team Loop",
                badge: "LangGraph",
                desc: "An autonomous cycle where Planner, Researcher, Coder, and Reviewer iterate until your project is flawless.",
                icon: Users,
                color: "from-indigo-500/20 to-violet-500/10",
                iconColor: "text-indigo-400",
              },
              {
                title: "Full-Stack Coding Agent",
                badge: "Monaco Sandbox",
                desc: "Outputs complete multi-file React, HTML/CSS, and JS projects with instant live iframe browser execution.",
                icon: Code2,
                color: "from-blue-500/20 to-cyan-500/10",
                iconColor: "text-blue-400",
              },
              {
                title: "Real-Time Web Search",
                badge: "Tavily Engine",
                desc: "Fetches up-to-the-minute web results, news, docs, and images for grounded, hallucination-free answers.",
                icon: Globe,
                color: "from-emerald-500/20 to-teal-500/10",
                iconColor: "text-emerald-400",
              },
              {
                title: "PDF Document Synthesis",
                badge: "PDFKit Core",
                desc: "Generates formatted, publication-ready PDF documents complete with headers, tables, and auto-download links.",
                icon: FileText,
                color: "from-amber-500/20 to-orange-500/10",
                iconColor: "text-amber-400",
              },
              {
                title: "Presentation Deck Agent",
                badge: "PowerPoint PPTX",
                desc: "Transforms ideas into ready-to-present PowerPoint slide decks with titles, bullets, and corporate styling.",
                icon: Presentation,
                color: "from-rose-500/20 to-pink-500/10",
                iconColor: "text-rose-400",
              },
              {
                title: "Vision & PDF RAG",
                badge: "Qdrant Vector DB",
                desc: "Upload images for visual breakdown or documents for vector similarity search and grounded question-answering.",
                icon: Eye,
                color: "from-purple-500/20 to-violet-500/10",
                iconColor: "text-purple-400",
              },
            ].map((agent, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0f1118] border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center border border-white/[0.08]`}>
                      <agent.icon size={20} className={agent.iconColor} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-slate-400">
                      {agent.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition">
                    {agent.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {agent.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
              Workflow
            </h2>
            <h3 className="text-3xl font-extrabold text-white">How AgentForge Operates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#0f1118] border border-white/[0.06] relative">
              <span className="text-3xl font-extrabold text-indigo-500/20">01</span>
              <h4 className="text-lg font-bold text-white mt-2 mb-2">Prompt or Select Agent</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose an individual agent or select Team Mode to launch the collaborative LangGraph loop.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f1118] border border-white/[0.06] relative">
              <span className="text-3xl font-extrabold text-indigo-500/20">02</span>
              <h4 className="text-lg font-bold text-white mt-2 mb-2">Autonomous Execution</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Agents review, plan, write code, search the web, and verify each step with atomic credit governance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f1118] border border-white/[0.06] relative">
              <span className="text-3xl font-extrabold text-indigo-500/20">03</span>
              <h4 className="text-lg font-bold text-white mt-2 mb-2">Live Preview & Export</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect files in the built-in Monaco editor, test in live sandbox preview, or export directly to disk.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3">
              Transparent Pricing
            </h2>
            <h3 className="text-3xl font-extrabold text-white mb-2">Simple, Credit-Based Plans</h3>
            <p className="text-xs text-slate-400">Pay only for the compute and LLM tokens you use.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-7 rounded-2xl bg-[#0f1118] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Free Tier</h4>
                <p className="text-xs text-slate-400 mb-5">Perfect for exploring agents and basic chat.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 50 Free Welcome Credits</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> General Chat Agent</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Standard Coding Agent</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Web Search Agent</div>
                </div>
              </div>
              <button
                onClick={onOpenLogin}
                className="mt-8 w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition cursor-pointer"
              >
                Get Started
              </button>
            </div>

            {/* Starter */}
            <div className="p-7 rounded-2xl bg-[#121422] border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/10 flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-[10px] font-bold text-white uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Starter Plan</h4>
                <p className="text-xs text-slate-400 mb-5">For developers building projects daily.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">$9.99</span>
                  <span className="text-xs text-slate-400">/ 500 Credits</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 500 Compute Credits</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Collaborative Multi-Agent Teams</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Monaco Editor & Live Sandbox</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> PDF & PPT Generation</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Fast Llama 3.3 Inference</div>
                </div>
              </div>
              <button
                onClick={onOpenLogin}
                className="mt-8 w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition cursor-pointer shadow-md shadow-indigo-500/20"
              >
                Choose Starter
              </button>
            </div>

            {/* Pro */}
            <div className="p-7 rounded-2xl bg-[#0f1118] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Pro Plan</h4>
                <p className="text-xs text-slate-400 mb-5">Maximum compute for power users & teams.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">$19.99</span>
                  <span className="text-xs text-slate-400">/ 1,500 Credits</span>
                </div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 1,500 Compute Credits</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Everything in Starter</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> PDF RAG Vector Collections</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> High-Resolution Vision Analysis</div>
                  <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Priority Processing Queue</div>
                </div>
              </div>
              <button
                onClick={onOpenLogin}
                className="mt-8 w-full py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition cursor-pointer"
              >
                Choose Pro
              </button>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-b from-indigo-950/40 to-[#0e1017] border border-indigo-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Ready to build with autonomous agents?
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
                Join developers orchestrating multi-agent systems. Sign in with Google to claim your 50 welcome credits.
              </p>
              <button
                onClick={onOpenLogin}
                className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/20 transition cursor-pointer inline-flex items-center gap-2"
              >
                Claim 50 Free Credits
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#07080c] py-10 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
              AF
            </div>
            <span className="font-semibold text-slate-400">AgentForge</span>
            <span>• Autonomous Multi-Agent AI Platform</span>
          </div>
          <div>© {new Date().getFullYear()} AgentForge. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
