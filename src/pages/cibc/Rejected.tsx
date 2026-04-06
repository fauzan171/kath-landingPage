/**
 * Rejected Account Page
 *
 * Shown when a user's registration has been rejected by admin.
 * Displays rejection reason and contact info for support.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, Mail } from '../../icons';

const Rejected: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 font-body">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#0F0F0F] mb-3 font-display">
            Registration Not Approved
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            We're sorry, but your registration for CIBC Competition has not been approved.
            This could be due to incomplete information or not meeting the eligibility criteria.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h3 className="font-semibold text-[#0F0F0F] mb-3">Need Help?</h3>
          <p className="text-gray-500 text-sm mb-4">
            If you believe this is a mistake or want to reapply, please contact our team:
          </p>
          <a
            href="mailto:support@kathevent.com"
            className="inline-flex items-center gap-2 text-[#FFB22C] font-semibold text-sm hover:underline"
          >
            <Mail className="w-4 h-4" />
            support@kathevent.com
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/cibc"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FFB22C] text-[#0F0F0F] rounded-full font-bold text-sm hover:bg-[#FFB22C]/90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Competition Info
          </Link>
          <Link
            to="/cibc/login"
            className="text-gray-400 hover:text-[#0F0F0F] text-sm font-medium transition-colors"
          >
            Try logging in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Rejected;
