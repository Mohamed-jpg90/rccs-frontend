"use client";

import { useEffect, useRef, useState } from "react";
import { FaSearch, FaTimes, FaUserCircle, FaCheck } from "react-icons/fa";
import { apiClient } from "@/lib/api";
import useDebounce from "@/hooks/useDebounce";

const PAGE_LIMIT = 15;

function UserRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
      <div className="h-8 w-8 rounded-full bg-[var(--bg-surface)] shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-1/2 bg-[var(--bg-surface)] rounded-full" />
        <div className="h-2.5 w-2/3 bg-[var(--bg-surface)] rounded-full" />
      </div>
    </div>
  );
}

export default function LinkedUserPicker({ value, selectedUser, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(search, 400);
  const listRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch page 1 whenever the dropdown opens or the search term changes
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    setLoading(true);
    apiClient
      .get("/users", { params: { search: debouncedSearch, page: 1, limit: PAGE_LIMIT } })
      .then((res) => {
        if (cancelled) return;
        setUsers(res.data.users || []);
        setTotal(res.data.total || 0);
        setPage(1);
      })
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [open, debouncedSearch]);

  const hasMore = users.length < total;

  const loadMore = async () => {
    if (loadingMore || loading || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await apiClient.get("/users", {
        params: { search: debouncedSearch, page: nextPage, limit: PAGE_LIMIT },
      });
      setUsers((prev) => [...prev, ...(res.data.users || [])]);
      setPage(nextPage);
    } catch (err) {
      console.error("Error fetching more users:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Lazy load next page when scrolled near the bottom of the list
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 80) {
      loadMore();
    }
  };

  const handleSelect = (user) => {
    onChange(user._id, user);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("", null);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] cursor-pointer focus-within:ring-2 focus-within:ring-[var(--primary)] transition-all"
      >
        <FaSearch className="text-[var(--text-muted)] text-xs shrink-0" />

        {value && selectedUser && !open ? (
          <div className="flex items-center justify-between flex-1 min-w-0">
            <span className="text-sm text-[var(--text-primary)] truncate">
              {selectedUser.fullName}{" "}
              <span className="text-[var(--text-muted)]">({selectedUser.email})</span>
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-[var(--text-muted)] hover:text-red-500 shrink-0 ml-2"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Search by name or email..."
            className="flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        )}
      </div>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] shadow-[var(--shadow-lg-value)] overflow-hidden">
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-64 overflow-y-auto"
          >
            {/* "No linked account" option */}
            <button
              type="button"
              onClick={() => handleSelect({ _id: "", fullName: "No linked account", email: "" })}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-surface)] transition-colors text-left"
            >
              <div className="h-8 w-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <FaTimes className="text-[var(--text-muted)] text-xs" />
              </div>
              <span className="text-sm text-[var(--text-secondary)]">No linked account</span>
            </button>

            {loading && (
              <>
                <UserRowSkeleton />
                <UserRowSkeleton />
                <UserRowSkeleton />
              </>
            )}

            {!loading && users.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
                No users found.
              </p>
            )}

            {!loading &&
              users.map((user) => {
                const isSelected = user._id === value;
                return (
                  <button
                    type="button"
                    key={user._id}
                    onClick={() => handleSelect(user)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-surface)] transition-colors text-left"
                  >
                    <div className="h-8 w-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-[var(--text-muted)] text-lg" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {user.email} · {user.role}
                      </p>
                    </div>
                    {isSelected && <FaCheck className="text-[var(--primary)] text-xs shrink-0" />}
                  </button>
                );
              })}

            {loadingMore && <UserRowSkeleton />}
          </div>
        </div>
      )}
    </div>
  );
}