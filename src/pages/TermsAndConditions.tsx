/**
 * Terms & Conditions Page
 * Competition rules, IP clauses, disqualification criteria, plagiarism policy
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, AlertTriangle, FileText, Shield, BookOpen } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link to="/cibc" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Competition
          </Link>
          <div className="flex items-center gap-4">
            <Scale className="w-12 h-12 text-amber-400" />
            <div>
              <h1 className="text-3xl font-bold">Terms & Conditions</h1>
              <p className="text-slate-300 mt-1">CIBC 2026 Business Model Canvas Competition</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-amber-800">
            <strong>Last Updated:</strong> April 2026 | By registering for CIBC 2026, you agree to these terms and conditions.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1: General */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">1. General Terms</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The <strong>Creative International Business Competition (CIBC) 2026</strong> is organized by the CIBC Committee.
                These terms and conditions govern participation in the competition.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Participation is open to students, startups, and corporate teams as defined in the eligibility criteria.</li>
                <li>Teams must consist of 2-3 members for the student category, and 2-6 members for startup/corporate categories.</li>
                <li>All team members must register individually and be linked to a team.</li>
                <li>The competition committee reserves the right to modify deadlines, rules, and prizes at any time with prior notice.</li>
                <li>All decisions made by the judges are final and binding.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Eligibility */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">2. Eligibility Criteria</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Student Category</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Currently enrolled in an accredited university or college</li>
                  <li>Must present a valid student ID</li>
                  <li>Teams of 2-3 members from the same or different institutions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Startup Category</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Startup must be registered (or in the process of registration)</li>
                  <li>Business age: 0-3 years from establishment</li>
                  <li>Teams of 2-6 members</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Corporate Category</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Must represent a registered corporation</li>
                  <li>Teams of 2-6 members from the same organization</li>
                  <li>Proposed BMC should be for a new initiative, product, or business unit</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Submission */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">3. Submission Requirements</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Format:</strong> BMC Canvas (9 blocks) submitted via the official platform. Additional supporting documents (PDF, PPTX, DOCX) may be attached.</li>
                <li><strong>File Size:</strong> Maximum 10MB per file, maximum 5 files per submission.</li>
                <li><strong>Language:</strong> Submissions must be in English or Bahasa Indonesia.</li>
                <li><strong>Originality:</strong> All submissions must be original work. See Section 6 (Plagiarism Policy).</li>
                <li><strong>Deadline:</strong> Submissions must be received before the stated deadline. Late submissions will not be accepted.</li>
                <li><strong>Multiple Submissions:</strong> Each team may submit only ONE (1) BMC. Revisions are allowed before the deadline.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Judging */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">4. Judging Criteria</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Submissions will be evaluated by a panel of expert judges based on the following criteria:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-2 font-semibold text-gray-700">Criterion</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-700">Weight</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-4 py-2 font-medium">Customer Segments</td><td className="px-4 py-2">15%</td><td className="px-4 py-2">Target market definition, persona clarity, market size</td></tr>
                    <tr><td className="px-4 py-2 font-medium">Value Proposition</td><td className="px-4 py-2">20%</td><td className="px-4 py-2">Uniqueness, differentiation, problem-solution fit</td></tr>
                    <tr><td className="px-4 py-2 font-medium">Channels</td><td className="px-4 py-2">10%</td><td className="px-4 py-2">Go-to-market strategy, distribution, acquisition</td></tr>
                    <tr><td className="px-4 py-2 font-medium">Customer Relationships</td><td className="px-4 py-2">5%</td><td className="px-4 py-2">Engagement, retention, community building</td></tr>
                    <tr><td className="px-4 py-2 font-medium">Revenue Streams</td><td className="px-4 py-2">15%</td><td className="px-4 py-2">Monetization model, pricing, projections</td></tr>
                    <tr><td className="px-4 py-2 font-medium">Key Resources</td><td className="px-4 py-2">10%</td><td className="px-4 py-2">Resource allocation, asset management</td></tr>
                    <tr><td className="px-4 py-2 font-medium">Key Activities</td><td className="px-4 py-2">10%</td><td className="px-4 py-2">Core activities, feasibility, execution plan</td></tr>
                    <tr><td className="px-4 py-2 font-medium">Key Partnerships</td><td className="px-4 py-2">5%</td><td className="px-4 py-2">Partnership strategy, alliances</td></tr>
                    <tr><td className="px-4 py-2 font-medium">Cost Structure</td><td className="px-4 py-2">10%</td><td className="px-4 py-2">Unit economics, break-even, optimization</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 italic">
                * Judging is conducted through blind review. Judges will not see team names or institutions during scoring.
              </p>
            </div>
          </section>

          {/* Section 5: IP */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">5. Intellectual Property</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Ownership:</strong> All intellectual property rights in submitted BMCs remain with the original creators (team members).</li>
                <li><strong>License to Organizers:</strong> By participating, teams grant the CIBC Committee a non-exclusive, royalty-free license to use, reproduce, and display submissions for promotional and educational purposes.</li>
                <li><strong>Confidentiality:</strong> The Committee will make reasonable efforts to maintain the confidentiality of submitted materials. However, participants are advised not to include trade secrets or highly sensitive information.</li>
                <li><strong>Public Display:</strong> Winning submissions may be showcased publicly. Teams will be notified before any public display.</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Plagiarism */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">6. Plagiarism Policy</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <ul className="list-disc pl-6 space-y-2">
                <li>All submissions must be <strong>original work</strong> created specifically for CIBC 2026.</li>
                <li>Using BMCs, business plans, or proposals previously submitted to other competitions must be disclosed during registration.</li>
                <li>Plagiarism detection tools may be used to verify originality.</li>
                <li><strong>Consequences of plagiarism:</strong> Immediate disqualification of the entire team, forfeiture of any prizes, and potential ban from future CIBC editions.</li>
                <li>Teams may reference publicly available data, research, and frameworks with proper citation.</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Disqualification */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">7. Disqualification Criteria</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>A team may be disqualified for the following reasons:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submitting plagiarized or non-original work</li>
                <li>Providing false information during registration</li>
                <li>Attempting to influence or communicate with judges about submissions</li>
                <li>Submitting after the deadline without prior approval</li>
                <li>Team members participating in multiple teams simultaneously</li>
                <li>Violating any of the terms outlined in this document</li>
                <li>Engaging in any form of harassment or unethical behavior toward other participants, judges, or organizers</li>
              </ul>
            </div>
          </section>

          {/* Section 8: Prizes */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">8. Prizes & Awards</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <ul className="list-disc pl-6 space-y-2">
                <li>Prizes are non-transferable and cannot be exchanged for cash unless stated otherwise.</li>
                <li>Tax obligations on prizes are the responsibility of the winners.</li>
                <li>Winners must claim prizes within 30 days of announcement.</li>
                <li>The Committee reserves the right to modify prize amounts and structures.</li>
              </ul>
            </div>
          </section>

          {/* Section 9: Liability */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">9. Limitation of Liability</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <ul className="list-disc pl-6 space-y-2">
                <li>The Committee is not responsible for technical issues, including but not limited to internet connectivity, server downtime, or platform errors.</li>
                <li>The Committee is not liable for any loss of data or submissions due to technical failures on the participant's end.</li>
                <li>Participants are advised to keep backup copies of all submissions.</li>
              </ul>
            </div>
          </section>

          {/* Section 10: Contact */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">10. Contact & Questions</h2>
            </div>
            <div className="text-gray-600 leading-relaxed">
              <p>
                For questions about these Terms & Conditions, please contact the CIBC Committee:
              </p>
              <ul className="mt-3 space-y-1">
                <li>Email: <a href="mailto:cibc@competition.org" className="text-amber-600 hover:underline">cibc@competition.org</a></li>
                <li>Website: <Link to="/cibc" className="text-amber-600 hover:underline">CIBC 2026</Link></li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 pb-8">
          <p>CIBC 2026 Business Model Canvas Competition. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
