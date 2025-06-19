import React from 'react';
import { motion } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';

const RefundPolicy = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-900">
        <div className="max-w-4xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-dark-800 rounded-xl p-8 border border-dark-700"
          >
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              Refund Policy
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-gray-300">
                
                <div className="bg-dark-700 rounded-lg p-4 mb-6">
                  <p className="text-gray-300 font-medium">
                    Effective Date: June 18, 2025
                  </p>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  At Riyoshi, we strive to ensure a smooth and satisfactory experience for all users booking salon services through our platform. This Refund Policy outlines the terms under which refunds may be issued.
                </p>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">1. Eligibility for Refunds</h2>
                  <p className="text-gray-300 leading-relaxed mb-3">
                    Refunds may be granted under the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>The salon cancels the appointment.</li>
                    <li>The service was not provided as described.</li>
                    <li>You cancel a booking within the allowed cancellation period.</li>
                    <li>There was a billing or duplicate transaction error.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">2. Cancellation Policy</h2>
                  <div className="space-y-3">
                    <p className="text-gray-300 leading-relaxed">
                      Users can cancel a booking at least 3 hours before the scheduled appointment time to be eligible for a full refund.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Cancellations made within 3 hours of the appointment may not be eligible for a refund, subject to the salon's discretion.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">3. No-Shows</h2>
                  <p className="text-gray-300 leading-relaxed">
                    If you fail to show up for a scheduled appointment without prior cancellation, you will not be eligible for a refund.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">4. Refund Process</h2>
                  <div className="space-y-3">
                    <p className="text-gray-300 leading-relaxed">
                      Refund requests must be submitted through the Riyoshi app or emailed to riyoshi.salon@gmail.com.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Our team will verify the request and respond within 3-5 business days.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      If approved, the refund will be processed via the original method of payment and may take 5-10 business days to reflect, depending on your bank or payment provider.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">5. Disputes and Salon Responsibility</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Riyoshi acts as a booking platform. Any disputes related to service quality will be addressed with the salon directly. However, Riyoshi may mediate in good faith where appropriate.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">6. Non-Refundable Items</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Promotional offers or discounted bookings are non-refundable unless the salon cancels.</li>
                    <li>Service add-ons or extras once availed cannot be refunded.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to Policy</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may revise this Refund Policy from time to time. The updated policy will be posted on our platform with the revised effective date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
                  <p className="text-gray-300 leading-relaxed mb-3">
                    For refund-related queries, contact us at:
                  </p>
                  <div className="bg-dark-700 rounded-lg p-4">
                    <p className="text-gray-300">
                      <strong>Riyoshi Technologies</strong><br />
                      <strong>Email:</strong> riyoshi.salon@gmail.com<br />
                      <strong>Address:</strong> Door No 48/7 Ward No 22, Saraswathi Nilaya, Opp Anupama Nursing Home, Gandhinagar, PO: Bellari Gandhinagar, DIST: Ballari, Karnataka - 583103
                    </p>
                  </div>
                </section>

                <div className="border-t border-dark-700 pt-6 mt-8">
                  <p className="text-sm text-gray-400 text-center">
                    Last Updated: June 18, 2025
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RefundPolicy; 