"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getProductIssues,
  getIssueDetail,
  postSolution,
  toggleVote,
  pinSolution,
  acceptSolution,
  reportIssue,
  getFixesBeforeReturn,
  type ProductIssue,
  type IssueSolution,
  type QuickFix,
} from "@/lib/api/issues";
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Pin,
  Check,
  Plus,
  X,
  Loader2,
  Lightbulb,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

// ── Main component ────────────────────────────────────────────────────────────

export function CommunityIssues({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [issues, setIssues] = useState<ProductIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<ProductIssue | null>(null);
  const [expandLoading, setExpandLoading] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    getProductIssues(productId)
      .then(setIssues)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleExpand = async (issueId: string) => {
    if (expanded === issueId) {
      setExpanded(null);
      setExpandedData(null);
      return;
    }
    setExpanded(issueId);
    setExpandLoading(true);
    try {
      const data = await getIssueDetail(issueId);
      setExpandedData(data);
    } finally {
      setExpandLoading(false);
    }
  };

  const handleReply = async (issueId: string) => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      const solution = await postSolution(issueId, replyText);
      setExpandedData((prev) =>
        prev
          ? { ...prev, solutions: [...(prev.solutions ?? []), solution] }
          : prev,
      );
      setIssues((prev) =>
        prev.map((i) =>
          i.id === issueId ? { ...i, solutionCount: i.solutionCount + 1 } : i,
        ),
      );
      setReplyText("");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleVote = async (solutionId: string) => {
    const updated = await toggleVote(solutionId);
    setExpandedData((prev) =>
      prev
        ? {
            ...prev,
            solutions: prev.solutions?.map((s) =>
              s.id === solutionId ? updated : s,
            ),
          }
        : prev,
    );
  };

  const handlePin = async (solutionId: string) => {
    const updated = await pinSolution(solutionId);
    setExpandedData((prev) =>
      prev
        ? {
            ...prev,
            solutions: prev.solutions?.map((s) =>
              s.id === solutionId ? updated : s,
            ),
          }
        : prev,
    );
  };

  const handleAccept = async (solutionId: string, issueId: string) => {
    await acceptSolution(solutionId);
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: "solved" } : i)),
    );
    setExpandedData((prev) =>
      prev
        ? {
            ...prev,
            status: "solved",
            solutions: prev.solutions?.map((s) =>
              s.id === solutionId ? { ...s, isAccepted: true } : s,
            ),
          }
        : prev,
    );
  };

  const onIssueReported = (issue: ProductIssue) => {
    setIssues((prev) => [issue, ...prev]);
    setShowReportForm(false);
  };

  if (loading) return null;

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <MessageCircle size={14} className="text-accent" />
          Community Problems & Solutions
          <span className="text-accent">({issues.length})</span>
        </h2>
        {user && (
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center gap-1.5 h-7 px-3 text-[10px] font-black uppercase tracking-wider border border-accent/30 text-accent hover:bg-accent hover:text-white transition-colors"
          >
            <Plus size={11} /> Report Issue
          </button>
        )}
      </div>

      {/* Empty state */}
      {issues.length === 0 ? (
        <div className="py-10 text-center bg-[#0f0f0f] border border-[#1e1e1e] text-[#555] text-sm">
          No issues reported yet. Be the first to ask a question or report a
          problem.
        </div>
      ) : (
        <div className="divide-y divide-[#141414] border border-[#1e1e1e]">
          {issues.map((issue) => (
            <div key={issue.id} className="bg-[#0f0f0f]">
              {/* Issue row */}
              <button
                onClick={() => handleExpand(issue.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#111] transition-colors text-left"
              >
                <div className="flex items-start gap-3">
                  <StatusBadge status={issue.status} />
                  <div>
                    <p className="font-bold text-white text-sm">
                      {issue.title}
                    </p>
                    <p className="text-[10px] text-[#555] mt-0.5">
                      by <span className="text-[#888]">{issue.user.name}</span>
                      {" · "}
                      {issue.solutionCount}{" "}
                      {issue.solutionCount === 1 ? "solution" : "solutions"}
                    </p>
                  </div>
                </div>
                {expanded === issue.id ? (
                  <ChevronUp size={14} className="text-[#555] shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-[#555] shrink-0" />
                )}
              </button>

              {/* Expanded detail */}
              {expanded === issue.id && (
                <div className="border-t border-[#161616] bg-[#0a0a0a]">
                  {/* Issue description */}
                  <div className="px-5 py-4 border-b border-[#141414]">
                    <p className="text-sm text-[#aaa]">{issue.description}</p>
                  </div>

                  {expandLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 size={18} className="animate-spin text-[#555]" />
                    </div>
                  ) : (
                    <>
                      {/* Solutions list */}
                      {(expandedData?.solutions ?? []).length === 0 && (
                        <div className="px-5 py-6 text-center text-[#555] text-sm">
                          No solutions yet — be the first to help!
                        </div>
                      )}
                      {(expandedData?.solutions ?? []).map((s) => (
                        <SolutionCard
                          key={s.id}
                          solution={s}
                          issue={expandedData!}
                          currentUser={user}
                          onVote={() => handleVote(s.id)}
                          onPin={() => handlePin(s.id)}
                          onAccept={() => handleAccept(s.id, issue.id)}
                        />
                      ))}

                      {/* Reply box */}
                      {user && issue.status !== "closed" && (
                        <div className="px-5 py-4 border-t border-[#141414]">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={2}
                            placeholder="Post a solution or share your experience…"
                            className="w-full px-3 py-2.5 bg-[#0f0f0f] border border-[#222] text-sm text-white placeholder:text-[#333] focus:outline-none focus:border-accent resize-none transition-colors"
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handleReply(issue.id)}
                              disabled={replyLoading || !replyText.trim()}
                              className="flex items-center gap-1.5 h-7 px-4 bg-accent hover:bg-accent-hover text-white text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-40"
                            >
                              {replyLoading ? (
                                <Loader2 size={11} className="animate-spin" />
                              ) : (
                                "Post Solution"
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report issue modal */}
      {showReportForm && (
        <ReportIssueModal
          productId={productId}
          onClose={() => setShowReportForm(false)}
          onSuccess={onIssueReported}
        />
      )}
    </div>
  );
}

// ── Solution card ─────────────────────────────────────────────────────────────

function SolutionCard({
  solution: s,
  issue,
  currentUser,
  onVote,
  onPin,
  onAccept,
}: {
  solution: IssueSolution;
  issue: ProductIssue;
  currentUser: any;
  onVote: () => void;
  onPin: () => void;
  onAccept: () => void;
}) {
  const isIssueAuthor = currentUser?.id === issue.user.id;
  const isSellerOrAdmin =
    currentUser?.role === "seller" || currentUser?.role === "admin";

  return (
    <div
      className={twMerge(
        "px-5 py-4 border-t border-[#141414]",
        s.isPinned && "bg-accent/5 border-l-2 border-l-accent",
        s.isAccepted && "bg-green-400/5 border-l-2 border-l-green-400",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {(s.isPinned || s.isAccepted) && (
            <div className="flex items-center gap-3 mb-2">
              {s.isPinned && (
                <span className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1">
                  <Pin size={10} /> Pinned by Seller
                </span>
              )}
              {s.isAccepted && (
                <span className="text-[10px] font-black uppercase tracking-wider text-green-400 flex items-center gap-1">
                  <Check size={10} /> Accepted Solution
                </span>
              )}
            </div>
          )}
          <p className="text-sm text-[#ccc]">{s.content}</p>
          <p className="text-[10px] text-[#555] mt-2">
            by <span className="text-[#888]">{s.user.name}</span>
          </p>
        </div>

        {/* Vote */}
        <button
          onClick={onVote}
          className="flex flex-col items-center gap-0.5 group shrink-0"
        >
          <ThumbsUp
            size={14}
            className="text-[#444] group-hover:text-accent transition-colors"
          />
          <span className="text-[10px] text-[#555]">{s.voteCount}</span>
        </button>
      </div>

      {currentUser && (
        <div className="flex items-center gap-4 mt-3">
          {isSellerOrAdmin && (
            <button
              onClick={onPin}
              className="text-[10px] font-bold text-[#555] hover:text-accent transition-colors"
            >
              {s.isPinned ? "Unpin" : "Pin as Fix"}
            </button>
          )}
          {isIssueAuthor && !s.isAccepted && issue.status !== "solved" && (
            <button
              onClick={onAccept}
              className="text-[10px] font-bold text-[#555] hover:text-green-400 transition-colors"
            >
              Mark as Solved
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "open"
      ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
      : status === "solved"
        ? "text-green-400 bg-green-400/10 border-green-400/30"
        : "text-[#555] bg-[#1a1a1a] border-[#333]";

  return (
    <span
      className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border shrink-0 mt-0.5 ${styles}`}
    >
      {status}
    </span>
  );
}

// ── Report Issue Modal (Fix Before Return) ────────────────────────────────────

type Step = "fixes" | "form";

function ReportIssueModal({
  productId,
  onClose,
  onSuccess,
}: {
  productId: string;
  onClose: () => void;
  onSuccess: (issue: ProductIssue) => void;
}) {
  const [step, setStep] = useState<Step>("fixes");
  const [fixes, setFixes] = useState<QuickFix[]>([]);
  const [fixesLoading, setFL] = useState(true);
  const [checkedFix, setChecked] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [submitting, setSubmit] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getFixesBeforeReturn(productId)
      .then(setFixes)
      .catch(() => {})
      .finally(() => setFL(false));
  }, [productId]);

  // No pinned fixes yet → skip straight to form
  useEffect(() => {
    if (!fixesLoading && fixes.length === 0) setStep("form");
  }, [fixesLoading, fixes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmit(true);
    try {
      const issue = await reportIssue({ productId, title, description });
      onSuccess(issue);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f0f] border border-[#222] w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
            {step === "fixes" ? "Try These Fixes First" : "Report an Issue"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step 1 — fixes */}
        {step === "fixes" && (
          <div className="px-6 py-5">
            <div className="flex items-start gap-3 mb-5 p-3 bg-accent/5 border border-accent/20">
              <Lightbulb size={16} className="text-accent mt-0.5 shrink-0" />
              <p className="text-sm text-[#aaa]">
                Other buyers solved similar issues with these fixes. Try them
                before reporting — it's usually faster than waiting for a
                response.
              </p>
            </div>

            {fixesLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 size={18} className="animate-spin text-[#555]" />
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                {fixes.map((fix) => (
                  <button
                    key={fix.id}
                    onClick={() =>
                      setChecked(fix.id === checkedFix ? null : fix.id)
                    }
                    className={`w-full text-left px-4 py-3 border transition-colors ${
                      checkedFix === fix.id
                        ? "border-green-400/40 bg-green-400/5"
                        : "border-[#222] hover:border-[#333] bg-[#0a0a0a]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle
                        size={15}
                        className={`mt-0.5 shrink-0 transition-colors ${
                          checkedFix === fix.id
                            ? "text-green-400"
                            : "text-[#333]"
                        }`}
                      />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-[#555] mb-1">
                          Related: {fix.issueTitle}
                        </p>
                        <p className="text-sm text-[#ccc]">{fix.content}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-10 border border-[#333] text-[#777] hover:text-white text-[11px] font-black uppercase tracking-wider transition-colors"
              >
                Problem Solved ✓
              </button>
              <button
                onClick={() => setStep("form")}
                className="flex-1 h-10 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white text-[11px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                None Worked <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — form */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
                Issue Title *
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 bg-[#0a0a0a] border border-[#222] text-sm text-white placeholder:text-[#333] focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g., Drill vibrates excessively at high speed"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#666] mb-1.5">
                Describe the Problem *
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#222] text-sm text-white placeholder:text-[#333] focus:outline-none focus:border-accent resize-none transition-colors"
                placeholder="Describe what happened, when it started, what you already tried…"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 border border-[#333] text-[#777] hover:text-white text-[11px] font-black uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 h-10 bg-accent hover:bg-accent-hover text-white text-[11px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  "Submit Issue"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
