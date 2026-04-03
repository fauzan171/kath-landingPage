/**
 * CIBC Power by KATH - Admin Payment Verification Page
 *
 * Admin dashboard for verifying/rejecting payment proofs
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Eye, CheckCircle, XCircle, Clock,
  Search, Filter, Loader2, AlertCircle, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { gsap } from 'gsap';
import { paymentService, competitionService } from '@/services/cibc.service';
import type { Team, TeamMember } from '@/services/cibc.service';
import type { PaymentStatus } from '@/types';
import { supabase } from '@/lib/supabase';

interface PaymentTeam extends Team {
  members: TeamMember[];
}

const AdminPayments: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending');
  const [selectedPayment, setSelectedPayment] = useState<PaymentTeam | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPayments();
  }, [statusFilter]);

  useEffect(() => {
    if (payments.length > 0) {
      gsap.fromTo(
        '.payment-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }
      );
    }
  }, [payments]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const competition = await competitionService.getActive();
      if (!competition) {
        toast.error('Competition not found');
        return;
      }

      const paymentsData = await paymentService.getAllPayments(
        competition.id,
        statusFilter === 'all' ? undefined : statusFilter
      );
      setPayments(paymentsData);

      const statsData = await paymentService.getPaymentStats(competition.id);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (teamId: string) => {
    setProcessing(true);
    try {
      const adminId = await getCurrentAdminId();
      await paymentService.verifyPayment(teamId, adminId);
      toast.success('Payment verified successfully');
      fetchPayments();
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPayment || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessing(true);
    try {
      const adminId = await getCurrentAdminId();
      await paymentService.rejectPayment(selectedPayment.id, rejectReason, adminId);
      toast.success('Payment rejected');
      fetchPayments();
      setShowRejectModal(false);
      setSelectedPayment(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    } finally {
      setProcessing(false);
    }
  };

  const getCurrentAdminId = async (): Promise<string | null> => {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    }
    return null;
  };

  const filteredPayments = payments.filter(team => {
    const teamName = team.name.toLowerCase();
    const institution = (team.institution || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return teamName.includes(query) || institution.includes(query);
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Unpaid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-body">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
              </button>
              <div>
                <h1 className="font-display text-xl font-bold text-[#0F0F0F]">Payment Verification</h1>
                <p className="text-sm text-gray-500">Verify team registration payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-lg text-[#0F0F0F]">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="font-bold text-lg text-amber-600">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Verified</p>
                <p className="font-bold text-lg text-green-600">{stats.verified}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="font-bold text-lg text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search team name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#FFB22C] focus:ring-2 focus:ring-[#FFB22C]/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'pending' | 'verified' | 'rejected' | 'all')}
                className="px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#FFB22C] outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <Loader2 className="w-8 h-8 text-[#FFB22C] animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No payments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="payment-card bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#FFB22C]/10 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-[#FFB22C]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#0F0F0F]">{payment.name}</h3>
                          <p className="text-sm text-gray-500">{payment.institution || 'No institution'}</p>
                        </div>
                        {getStatusBadge(payment.payment_status || 'pending')}
                      </div>

                      {/* Team Details */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Category</p>
                          <p className="font-medium text-[#0F0F0F] capitalize">{payment.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Team Code</p>
                          <p className="font-medium text-[#0F0F0F]">{payment.team_code || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Uploaded At</p>
                          <p className="font-medium text-[#0F0F0F]">
                            {payment.payment_uploaded_at
                              ? new Date(payment.payment_uploaded_at).toLocaleDateString('id-ID')
                              : '-'}
                          </p>
                        </div>
                      </div>

                      {/* Members */}
                      {payment.members && payment.members.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500 mb-2">Team Members:</p>
                          <div className="flex flex-wrap gap-2">
                            {payment.members.map((member) => (
                              <span key={member.id} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {member.user?.name || 'Unknown'} ({member.role})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {payment.payment_status === 'rejected' && payment.payment_rejection_reason && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                          <p className="text-sm text-red-700">
                            <strong>Reason:</strong> {payment.payment_rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <a
                        href={payment.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="View Payment Proof"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </a>
                      {payment.payment_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerify(payment.id)}
                            disabled={processing}
                            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors disabled:opacity-50"
                            title="Verify Payment"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowRejectModal(true);
                            }}
                            disabled={processing}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors disabled:opacity-50"
                            title="Reject Payment"
                          >
                            <XCircle className="w-5 h-5 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#0F0F0F]">Reject Payment</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              You are rejecting payment from team <strong>{selectedPayment.name}</strong>. Please provide a reason.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#FFB22C] focus:ring-2 focus:ring-[#FFB22C]/20 outline-none resize-none"
              rows={4}
            />

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedPayment(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? 'Processing...' : 'Reject Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;