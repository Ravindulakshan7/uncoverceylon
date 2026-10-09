'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Users, Search, RefreshCw, Mail, Shield, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserData {
  id: string | number;
  name: string;
  email: string;
  image: string | null;
  provider: string;
  role: string;
  created_at: string;
  _count?: {
    reviews: number;
  };
}

interface AdminUsersTabProps {
  adminPassword: string;
}

export default function AdminUsersTab({ adminPassword }: AdminUsersTabProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvider, setFilterProvider] = useState<'all' | 'google' | 'email'>('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?admin_password=${encodeURIComponent(adminPassword)}`);
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      } else {
        toast.error(data.error || 'Failed to fetch users');
      }
    } catch {
      toast.error('Network error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filterProvider !== 'all' && u.provider !== filterProvider) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [users, filterProvider, searchQuery]);

  const stats = useMemo(() => {
    const total = users.length;
    const googleCount = users.filter((u) => u.provider === 'google').length;
    const emailCount = users.filter((u) => u.provider === 'email').length;
    const totalReviews = users.reduce((acc, u) => acc + (u._count?.reviews || 0), 0);
    return { total, googleCount, emailCount, totalReviews };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Top Banner - Dark Theme */}
      <div className="bg-[#111c2e] rounded-3xl p-6 border border-[#1e324d] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-[#00aa6c]/20 text-[#3ddc9a] border border-[#00aa6c]/30">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Registered Travelers & Accounts ({users.length})
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Authenticated users via Google OAuth or Email who can write reviews, save wishlists, and explore Ceylon.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="p-2.5 px-4 rounded-xl border border-[#1e324d] bg-[#162338] hover:bg-[#1e304a] text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs sm:text-sm font-bold"
          title="Refresh User List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#111c2e] rounded-2xl p-4 border border-[#1e324d] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Accounts</span>
          <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
        </div>
        <div className="bg-[#111c2e] rounded-2xl p-4 border border-[#1e324d] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Google Sign-Ins</span>
          <div className="text-2xl font-black text-blue-400 mt-1">{stats.googleCount}</div>
        </div>
        <div className="bg-[#111c2e] rounded-2xl p-4 border border-[#1e324d] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Sign-Ups</span>
          <div className="text-2xl font-black text-[#3ddc9a] mt-1">{stats.emailCount}</div>
        </div>
        <div className="bg-[#111c2e] rounded-2xl p-4 border border-[#1e324d] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reviews Authored</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats.totalReviews}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111c2e] rounded-2xl p-4 border border-[#1e324d] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0a111a] border border-[#1e324d] text-xs sm:text-sm focus:outline-none focus:border-[#00aa6c] text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#0a111a] p-1 rounded-xl border border-[#1e324d] text-xs">
          <button
            onClick={() => setFilterProvider('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterProvider === 'all' ? 'bg-[#00aa6c] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({users.length})
          </button>
          <button
            onClick={() => setFilterProvider('google')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterProvider === 'google' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Google ({stats.googleCount})
          </button>
          <button
            onClick={() => setFilterProvider('email')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterProvider === 'email' ? 'bg-[#00aa6c] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Email ({stats.emailCount})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111c2e] rounded-2xl border border-[#1e324d] shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#00aa6c] mb-3" />
            <p className="text-sm font-semibold text-slate-400">Loading user accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No users found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? 'Try matching a different name or email.' : 'No customer accounts registered yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a111a] border-b border-[#1e324d] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Reviews</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e324d]/60 text-xs sm:text-sm text-slate-300">
                {filteredUsers.map((u) => {
                  const initial = (u.name || u.email || 'U')[0].toUpperCase();
                  const dateStr = new Date(u.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={String(u.id)} className="hover:bg-[#162338]/60 transition-colors">
                      {/* Avatar & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#1e324d] shrink-0">
                              <Image src={u.image} alt={u.name || 'User'} fill className="object-cover" unoptimized />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00aa6c] to-emerald-400 text-white font-black flex items-center justify-center shrink-0 shadow-xs text-xs">
                              {initial}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white leading-tight">{u.name || 'Anonymous Traveler'}</div>
                            <div className="text-[11px] text-slate-400 sm:hidden">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-slate-300 font-mono text-xs">
                        {u.email}
                      </td>

                      {/* Provider Badge */}
                      <td className="py-3 px-4">
                        {u.provider === 'google' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-300 border border-blue-800">
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            Google
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00aa6c]/15 text-[#3ddc9a] border border-[#00aa6c]/30">
                            <Mail className="w-3 h-3 text-[#3ddc9a]" />
                            Email
                          </span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800">
                            <Shield className="w-3 h-3 text-amber-400" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#162338] text-slate-300">
                            Traveler
                          </span>
                        )}
                      </td>

                      {/* Review count */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-white">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          {u._count?.reviews || 0}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
