import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AppShell from "../components/layout/AppShell";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import {
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";
import { getCurrentUser } from "../features/getCurrentUser";
import { setUserData } from "../redux/userSlice";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    credits: "100 credits",
    validity: "30 days",
    description: "Ideal for testing individual agent capabilities and small tasks.",
    features: [
      "100 task credits included",
      "Specialist agent modes",
      "Monaco Artifact Inspector",
      "Interactive HTML sandbox preview",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    credits: "500 credits",
    validity: "30 days",
    description: "Expanded capacity for regular engineering and research tasks.",
    features: [
      "500 task credits included",
      "Multi-agent Team workflows",
      "Web search with citations",
      "PDF & PPT deck authoring",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19.99",
    credits: "1,500 credits",
    validity: "30 days",
    featured: true,
    description: "High-volume credit allocation for heavy multi-agent synthesis.",
    features: [
      "1,500 task credits included",
      "Priority LangGraph routing",
      "Unlimited code artifact generation",
      "Heavy research & multi-file synthesis",
    ],
  },
];

const CREDIT_COSTS = [
  { action: "Chat assistant conversation", cost: "1 credit" },
  { action: "Live web search query (Tavily)", cost: "5 credits" },
  { action: "Image visual analysis (OCR / layout)", cost: "5 credits" },
  { action: "Collaborative code synthesis", cost: "10 credits" },
  { action: "PDF document generation", cost: "10 credits" },
  { action: "PowerPoint deck generation", cost: "10 credits" },
  { action: "Diffusion image generation", cost: "10 credits" },
  { action: "PDF document RAG retrieval", cost: "10 credits" },
  { action: "Multi-Agent Team Orchestrator (4 stages)", cost: "15 credits" },
];

export default function BillingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user?.userData);

  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // success | error | null
  const [statusMessage, setStatusMessage] = useState("");

  const sessionId = searchParams.get("session_id");

  // Handle Stripe return redirect verification
  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;
    const verify = async () => {
      try {
        setPaymentStatus("pending");
        setStatusMessage("Verifying payment with Stripe...");
        const result = await verifyPayment(sessionId);

        if (result?.paid || result?.success) {
          if (isMounted) {
            setPaymentStatus("success");
            setStatusMessage("Payment verified successfully! Your credits have been updated.");
            // Refresh user data from server
            const updatedUser = await getCurrentUser();
            if (updatedUser) dispatch(setUserData(updatedUser));
          }
        } else {
          if (isMounted) {
            setPaymentStatus("error");
            setStatusMessage("Payment was not completed or could not be verified.");
          }
        }
      } catch {
        if (isMounted) {
          setPaymentStatus("error");
          setStatusMessage("Error verifying payment session.");
        }
      } finally {
        // Clear query param so reload doesn't re-trigger
        searchParams.delete("session_id");
        setSearchParams(searchParams, { replace: true });
      }
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [sessionId, dispatch, searchParams, setSearchParams]);

  const handleCheckout = async (planId) => {
    if (planId === "free") return;

    try {
      setCheckoutLoading(planId);
      const res = await createOrder(planId);
      if (res?.url) {
        window.location.assign(res.url);
      } else {
        alert("Unable to initiate Stripe checkout. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const credits = userData?.credits ?? 0;
  const currentPlan = userData?.plan || "free";
  const planMax =
    currentPlan === "pro" ? 1500 : currentPlan === "starter" ? 500 : 100;
  const percentUsed = Math.min(Math.round((credits / planMax) * 100), 100);

  return (
    <AppShell title="Billing & Credits">
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--forge-accent)] mb-1">
              ACCOUNT / CREDITS & PLANS
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--forge-text)]">
              Keep your work moving.
            </h1>
            <p className="text-xs sm:text-sm text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed">
              Transparent usage balance and available credit packages. Credit deductions occur atomically on task execution.
            </p>
          </div>

          {/* Payment Status Notification Banner */}
          {paymentStatus && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                paymentStatus === "success"
                  ? "bg-[var(--forge-accent)]/15 border-[var(--forge-accent)]/40 text-[var(--forge-text)]"
                  : paymentStatus === "pending"
                  ? "bg-[var(--forge-surface-elevated)] border-[var(--forge-border)] text-[var(--forge-text)]"
                  : "bg-[var(--forge-red)]/15 border-[var(--forge-red)]/30 text-[var(--forge-red)]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {paymentStatus === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-[var(--forge-accent)]" />
                )}
                {paymentStatus === "error" && (
                  <AlertCircle className="w-4 h-4 text-[var(--forge-red)]" />
                )}
                <span className="font-medium">{statusMessage}</span>
              </div>
              <button
                onClick={() => setPaymentStatus(null)}
                className="text-xs text-[var(--forge-text-muted)] hover:text-[var(--forge-text)] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Current Balance Card */}
          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border-strong)] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div>
              <div className="text-[10px] font-mono text-[var(--forge-text-muted)] uppercase tracking-wider">
                CURRENT BALANCE
              </div>
              <div className="text-4xl font-bold tracking-tight text-[var(--forge-text)] mt-1">
                {credits}{" "}
                <span className="text-sm font-medium text-[var(--forge-text-muted)]">
                  credits
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-[var(--forge-text-secondary)]">
                <Badge variant="lime" size="xs">
                  {currentPlan.toUpperCase()} PLAN
                </Badge>
                <span>·</span>
                <span>30-day billing validity</span>
              </div>
            </div>

            <div className="w-full sm:w-48 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--forge-text-secondary)]">
                  Remaining
                </span>
                <span className="font-mono font-bold text-[var(--forge-accent)]">
                  {credits} / {planMax}
                </span>
              </div>
              <div className="w-full h-2 bg-[var(--forge-border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--forge-accent)] rounded-full transition-all duration-300"
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--forge-text)]">
                Available Plans
              </h2>
              <span className="text-xs text-[var(--forge-text-muted)] font-mono">
                PRICED IN USD
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => {
                const isCurrent = currentPlan.toLowerCase() === plan.id;
                const isFeatured = plan.featured;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                      isFeatured
                        ? "bg-[var(--forge-surface-elevated)] border-2 border-[var(--forge-accent)] shadow-lg relative"
                        : "bg-[var(--forge-surface)] border border-[var(--forge-border)] shadow-xs"
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute -top-3 right-5">
                        <Badge variant="lime" size="xs">
                          POPULAR
                        </Badge>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold text-[var(--forge-text)]">
                        {plan.name}
                      </h3>
                      <div className="text-3xl font-bold tracking-tight text-[var(--forge-text)] mt-3">
                        {plan.price}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--forge-text-muted)] mt-1">
                        {plan.credits} · {plan.validity}
                      </div>
                      <p className="text-xs text-[var(--forge-text-secondary)] mt-3 leading-relaxed">
                        {plan.description}
                      </p>

                      <ul className="text-xs text-[var(--forge-text-secondary)] space-y-2 mt-5 mb-6">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forge-accent)] flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant={isCurrent ? "secondary" : "primary"}
                      size="md"
                      disabled={isCurrent || checkoutLoading === plan.id}
                      loading={checkoutLoading === plan.id}
                      onClick={() => handleCheckout(plan.id)}
                      className="w-full"
                    >
                      {isCurrent
                        ? "Current Plan"
                        : `Upgrade to ${plan.name}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Credit Cost Reference Table */}
          <div className="bg-[var(--forge-surface)] border border-[var(--forge-border)] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--forge-border)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--forge-text)]">
                  What uses credits?
                </h3>
                <p className="text-xs text-[var(--forge-text-muted)] mt-0.5">
                  Exact debit rate per successful execution
                </p>
              </div>
              <Badge variant="outline" size="xs">
                SERVER ENFORCED
              </Badge>
            </div>

            <div className="divide-y divide-[var(--forge-border)]">
              {CREDIT_COSTS.map((item, i) => (
                <div
                  key={i}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <span className="text-[var(--forge-text-secondary)]">
                    {item.action}
                  </span>
                  <span className="font-mono font-semibold text-[var(--forge-accent)]">
                    {item.cost}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
