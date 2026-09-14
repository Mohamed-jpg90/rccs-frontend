"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaUserMinus } from "react-icons/fa";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api";
import { getFileUrl } from "@/lib/files";
import { isAdmin } from "@/lib/auth";
import ReasonModal from "@/components/shared/ReasonModal";

const LIMIT = 10;

export default function MembersTable({ clubId }) {
  const router = useRouter();
  const [allMembers, setAllMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);

  const [removalTarget, setRemovalTarget] = useState(null); // { _id, fullName } | null

  // نجيب كل الأعضاء مرة واحدة بدون page/search — الفلترة والتقسيم هيبقوا في الفرونت
  const fetchMembers = useCallback(() => {
    setLoading(true);
    apiClient
      .get(`/clubs/${clubId}/overview`, { params: { page: 1, limit: 9999 } })
      .then((res) => {
        setAllMembers(res.data.members || []);
      })
      .catch((err) => console.error("Error fetching members:", err))
      .finally(() => setLoading(false));
  }, [clubId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // فلترة بالاسم أو الإيميل من الفرونت
  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allMembers;
    return allMembers.filter(
      (m) =>
        m.fullName?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q)
    );
  }, [allMembers, search]);

  // رجّع لأول صفحة كل ما البحث يتغيّر
  useEffect(() => {
    setPage(1);
  }, [search]);

  const total = filteredMembers.length;
  const totalPages = Math.ceil(total / LIMIT);

  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * LIMIT;
    return filteredMembers.slice(start, start + LIMIT);
  }, [filteredMembers, page]);

  const openMember = (member) => {
    router.push(`/team-leader/dashboard/members/${member._id}`);
  };

  const openRemovalModal = (e, member) => {
    e.stopPropagation();
    setRemovalTarget(member);
  };
  const closeRemovalModal = () => {
    if (requestingId) return;
    setRemovalTarget(null);
  };

  const requestRemoval = async (reason, scope) => {
    if (!removalTarget) return;
    const userId = removalTarget._id;

    setRequestingId(userId);
    try {
      await apiClient.post(`/users/${userId}/removal-request`, { reason, scope });
      toast.success("Removal request sent for admin approval");
      setRemovalTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send removal request");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Members</h2>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-sm focus:outline-none focus:border-[var(--border-focus)]"
          />
        </div>
      </div>

      <div className="rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-[var(--text-muted)]">Loading members...</div>
        ) : paginatedMembers.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text-muted)]">No members found.</div>
        ) : (
          <div className="divide-y divide-[var(--border-light)]">
            {paginatedMembers.map((member) => (
              <div
                key={member._id}
                onClick={() => openMember(member)}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
              >
                {member.profileImage ? (
                  <img src={getFileUrl(member.profileImage)} alt={member.fullName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[var(--primary-light)]" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{member.fullName}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{member.email}</p>
                </div>
                <span className="text-sm font-semibold text-[var(--primary)] hidden sm:block">{member.totalPoints ?? 0} pts</span>
                <button
                  onClick={(e) => openRemovalModal(e, member)}
                  disabled={requestingId === member._id}
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--danger)] hover:underline disabled:opacity-50"
                >
                  <FaUserMinus /> {requestingId === member._id ? "Sending..." : "Request Removal"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                page === i + 1 ? "bg-[var(--primary)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ReasonModal
        isOpen={!!removalTarget}
        onClose={closeRemovalModal}
        onConfirm={requestRemoval}
        isSubmitting={!!requestingId}
        title="Request Member Removal"
        description={
          removalTarget
            ? `Provide a reason for requesting the removal of ${removalTarget.fullName}. This will be sent for admin approval.`
            : undefined
        }
        confirmLabel="Send Request"
        showScopeSelector={isAdmin()}
      />
    </section>
  );
}