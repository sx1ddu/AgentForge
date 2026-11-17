import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Crown, X } from "lucide-react";
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
        window.location.href = data.sessionUrl;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const userCredits = userData?.credits ?? 0;
  const userTotalCredits = userData?.totalCredits || 100;
  const creditPercent = Math.min(100, Math.max(0, (userCredits / userTotalCredits) * 100));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-[390px] bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <div className="text-white text-lg font-bold">Billing & Credits</div>
                <div className="text-slate-400 text-xs mt-0.5">Manage your subscription and tokens</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Balance Card */}
            <div className="p-5">
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Active Plan</p>
                    <h3 className="text-white text-xl font-bold capitalize mt-0.5">
                      {userData?.plan || "Free"}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Crown className="text-amber-400" size={20} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                    <span>Available Balance</span>
                    <span className="text-slate-200">
                      {userCredits} / {userTotalCredits} Credits
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                      style={{ width: `${creditPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="px-5 overflow-y-auto space-y-4 flex-1 pb-6 [scrollbar-width:none]">
              {/* Starter Plan */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4.5 hover:border-indigo-500/40 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold text-base">Starter Plan</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Great for individuals and small projects</p>
                  </div>
                  <span className="text-indigo-400 text-2xl font-black">$9.99</span>
                </div>

                <div className="mt-3.5 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span><strong>500 Credits</strong> (Refreshed monthly)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>Access to Chat, Coding, and Web Search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>PDF and PowerPoint generation</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpgrade("starter")}
                  disabled={loadingPlan === "starter"}
                  className="mt-4 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {loadingPlan === "starter" ? "Redirecting to Stripe..." : "Upgrade to Starter ($9.99)"}
                </button>
              </div>

              {/* Pro Plan */}
              <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/[0.03] p-4.5 relative">
                <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm uppercase tracking-wide">
                  Popular
                </span>

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold text-base">Pro Plan</h4>
                    <p className="text-xs text-slate-400 mt-0.5">For power engineers and multi-agent workflows</p>
                  </div>
                  <span className="text-indigo-400 text-2xl font-black">$19.99</span>
                </div>

                <div className="mt-3.5 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span><strong>1500 Credits</strong> per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>Full Multi-Agent Collaborative Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>High-Resolution Vision & Image Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>Priority model throughput</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpgrade("pro")}
                  disabled={loadingPlan === "pro"}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 hover:opacity-95 py-2.5 text-xs font-semibold text-white transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {loadingPlan === "pro" ? "Redirecting to Stripe..." : "Upgrade to Pro ($19.99)"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BillingDrawer;
