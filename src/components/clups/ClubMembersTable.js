"use client";

import { useState } from "react";
import { MdDeleteForever, MdPersonRemove, MdBarChart, MdClose } from "react-icons/md";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import ReasonModal from "@/components/shared/ReasonModal";

const ROLE_STYLES = {
  Admin: "bg-[var(--primary)]/10 text-[var(--primary)]",
  Member: "bg-[var(--bg-hover)] text-[var(--text-secondary)]",
};

/**
 * ClubMembersTable — lists the users belonging to a club (admin view).
 * Expects each member record to look like { _id, fullName, email, phoneNumber, totalPoints }.
 */
export default function ClubMembersTable({ clubId, title, members = [], onChanged }) {
  // { member, action: "club" | "system" } | null
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const [pointsTarget, setPointsTarget] = useState(null); // member | null
  const [pointsData, setPointsData] = useState(null);
  const [pointsLoading, setPointsLoading] = useState(false);

  const openConfirm = (member, action) => setConfirmTarget({ member, action });
  const closeConfirm = () => {
    if (processingId) return;
    setConfirmTarget(null);
  };

  const handleConfirm = async (reason, scope) => {
    if (!confirmTarget) return;
    const { member } = confirmTarget;
    setProcessingId(member._id);
    try {
      // Admin-only: creates the removal request and auto-approves it in one call
      await apiClient.post(`/users/${member._id}/removal-request/direct`, { reason, scope });
      toast.success(scope === "system" ? "Account deleted" : "Removed from club");
      setConfirmTarget(null);
      onChanged?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const openPoints = async (member) => {
    setPointsTarget(member);
    setPointsLoading(true);
    setPointsData(null);
    try {
      const res = await apiClient.get(`/users/${member._id}/points`);
      setPointsData(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load points");
      setPointsTarget(null);
    } finally {
      setPointsLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {members.length} {title}{members.length === 1 ? "" : "s"}
        </span>
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-sm text-muted-foreground">
          <p className="font-medium text-[var(--text-primary)]">No {title} yet</p>
          <p>{title} will appear here once people join this club.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 pr-4 font-medium">phoneNumber</th>
                <th className="py-2 pr-4 font-medium">totalPoints</th>
                <th className="py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]">
                  <td className="py-3 pr-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--text-primary)]">{m.fullName ?? "Unknown"}</span>
                      {m.email && <span className="text-xs text-muted-foreground">{m.email}</span>}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        ROLE_STYLES[m.phoneNumber] ?? ROLE_STYLES.Member
                      }`}
                    >
                      {m.phoneNumber ?? "no phoneNumber "}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => openPoints(m)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                    >
                      <MdBarChart /> {m.totalPoints ? m.totalPoints : "—"}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openConfirm(m, "club")}
                        disabled={processingId === m._id}
                        className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:underline disabled:opacity-50"
                      >
                        <MdPersonRemove /> Remove from club
                      </button>
                      <button
                        onClick={() => openConfirm(m, "system")}
                        disabled={processingId === m._id}
                        className="flex items-center gap-1.5 text-xs font-medium text-[var(--danger)] hover:underline disabled:opacity-50"
                      >
                        <MdDeleteForever /> Delete account
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ReasonModal
        isOpen={!!confirmTarget}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        isSubmitting={!!processingId}
        title={confirmTarget?.action === "system" ? "Delete account?" : "Remove from club?"}
        description={
          confirmTarget
            ? confirmTarget.action === "system"
              ? `This permanently deletes ${confirmTarget.member.fullName}'s account. This cannot be undone.`
              : `${confirmTarget.member.fullName} will be removed from this club. Their account stays active.`
            : undefined
        }
        confirmLabel="Confirm"
        fixedScope={confirmTarget?.action}
      />

      {pointsTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">{pointsTarget.fullName}'s Points</h3>
              <button onClick={() => setPointsTarget(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <MdClose />
              </button>
            </div>
            {pointsLoading ? (
              <div className="py-6 text-center text-sm text-[var(--text-muted)]">Loading...</div>
            ) : (
              // ⚠️ unconfirmed shape — adjust field names to match your real /users/:id/points response
              <pre className="text-xs bg-[var(--bg-primary)] rounded-lg p-3 overflow-x-auto">{JSON.stringify(pointsData, null, 2)}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}