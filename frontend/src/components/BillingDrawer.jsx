import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X, Shield, Sparkles, Coins } from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";

const BillingDrawer = ({ open, onClose }) => {
  const { userData } = useSelector((state) => state.user);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleUpgrade = async (plan) => {
    try {
      setLoadingPlan(plan);
      const data = await createOrder(plan);

      if (data?.sessionUrl) {
        window.location.assign(data.sessionUrl);
      }
    } catch (error) {
      console.error("Upgrade order error:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const userCredits = userData?.credits ?? 50;
  const userTotalCredits = userData?.totalCredits || 50;
  const creditPercent = Math.min(100, Math.max(5, (userCredits / userTotalCredits) * 100));

  const plans = [
    {
      id: "free",
      name: "Free Tier",
      price: "$0",
      cadence: "forever",
      credits: 50,
      description: "For exploring AI agents & basic general chat",
      features: [
        "50 Welcome Credits",
        "General Chat & Coding Agents",
        "Tavily Live Web Search",
        "Community Support",
      ],
      isCurrent: !userData?.plan || userData?.plan === "free",
    },
    {
      id: "starter",
      name: "Starter Plan",
      price: "$9.99",
      cadence: "500 credits",
      credits: 500,
      description: "For developers generating full-stack projects daily",
      features: [
        "500 Compute Credits",
        "Collaborative Multi-Agent Loops",
        "Monaco Live Sandbox Execution",
        "PDF & PowerPoint Generators",
        "Sub-Second Llama 3.3 Inference",
      ],
      popular: true,
      isCurrent: userData?.plan === "starter",
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "$19.99",
      cadence: "1,500 credits",
      credits: 1500,
      description: "Maximum compute throughput for power engineers",
      features: [
        "1,500 Compute Credits",
        "Everything in Starter",
        "Vector Document RAG Collections",
        "High-Resolution Vision Analysis",
        "Priority Execution Queue",
      ],
      isCurrent: userData?.plan === "pro",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-[420px] bg-[#0c0e15] border-l border-white/[0.08] shadow-2xl flex flex-col select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#090b10]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#141722] border border-lime-400/30 flex items-center justify-center text-lime-400">
                  <Coins size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Compute Credits & Plans</h3>
                  <p className="text-[11px] text-slate-400">Manage subscription and billing</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Current Usage Gauge */}
              <div className="p-4 rounded-xl bg-[#121520] border border-white/[0.07] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Available Balance</span>
                  <span className="font-mono text-lime-400 font-bold">
                    {userCredits} <span className="text-slate-500 font-normal">/ {userTotalCredits} cr</span>
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-lime-400 rounded-full transition-all duration-300"
                    style={{ width: `${creditPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Current Tier: <strong className="text-slate-300 capitalize">{userData?.plan || "Free"}</strong></span>
                  <span className="font-mono text-slate-400">{Math.round(creditPercent)}% Remaining</span>
                </div>
              </div>

              {/* Plans List */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-1">
                  Available Plans
                </div>

                {plans.map((p) => (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition relative ${
                      p.popular
                        ? "bg-[#141826] border-lime-400/40 shadow-lg shadow-lime-400/5"
                        : "bg-[#10121a] border-white/[0.07]"
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-lime-400 text-[#08090D] font-mono text-[9px] font-bold uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}

                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white">{p.price}</span>
                        <span className="text-[10px] text-slate-500 font-mono">/ {p.cadence}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-3">{p.description}</p>

                    <div className="space-y-1.5 border-t border-white/[0.05] pt-3 mb-4">
                      {p.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                          <Check size={12} className="text-lime-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {p.isCurrent ? (
                      <div className="w-full py-2 rounded-xl text-center text-xs font-semibold text-slate-400 bg-white/[0.03] border border-white/[0.06]">
                        Current Active Plan
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={loadingPlan === p.id}
                        onClick={() => handleUpgrade(p.id)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                          p.popular
                            ? "bg-lime-400 hover:bg-lime-300 text-[#08090D] shadow-md shadow-lime-400/10"
                            : "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]"
                        }`}
                      >
                        {loadingPlan === p.id ? (
                          <span>Connecting to Stripe...</span>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            <span>Select {p.name}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Security reassurance */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-2.5 text-[11px] text-slate-500">
                <Shield size={16} className="text-emerald-400 shrink-0" />
                <span>Transactions secured by Stripe. Credits sync immediately upon checkout.</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BillingDrawer;
