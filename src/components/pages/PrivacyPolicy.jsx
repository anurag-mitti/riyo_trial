import React from 'react';
import { motion } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';

const PrivacyPolicy = () => {
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
              Privacy Policy
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-gray-300">
                
                <div className="bg-dark-700 rounded-lg p-4 mb-6">
                  <p className="text-gray-300 font-medium">
                    Effective Date: June 18, 2025
                  </p>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  This Privacy Policy explains how Riyoshi Technologies ("we", "us", or "our") collects, uses, shares, and protects personal information of users ("you" or "your") of the Riyoshi website, mobile app, and associated services (collectively, the "Service").
                </p>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">a. Personal Information:</h3>
                      <p className="text-gray-300 leading-relaxed mb-3">
                        We may collect the following personal information:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Profile photo (optional)</li>
                        <li>Location data (with your permission)</li>
                        <li>Payment information (processed securely via third-party providers)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">b. Usage Data:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                        <li>IP address</li>
                        <li>Device type</li>
                        <li>Browser type</li>
                        <li>Pages visited and time spent</li>
                        <li>Booking history</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-300 leading-relaxed mb-3">
                    We use your information to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Provide and improve our services</li>
                    <li>Process bookings and payments</li>
                    <li>Send notifications and updates</li>
                    <li>Respond to inquiries or customer support requests</li>
                    <li>Prevent fraud and abuse</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">3. Sharing of Information</h2>
                  <p className="text-gray-300 leading-relaxed mb-3">
                    We do not sell your personal data. We may share your information with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Service providers (e.g., payment processors, hosting partners)</li>
                    <li>Government or legal authorities when required by law</li>
                    <li>Salons or service providers only for the purpose of fulfilling your bookings</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We implement appropriate security measures to protect your data, including encryption, secure servers, and limited access protocols. However, no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
                  <p className="text-gray-300 leading-relaxed mb-3">
                    Depending on your jurisdiction, you may have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Access or request a copy of your personal data</li>
                    <li>Request correction or deletion of your information</li>
                    <li>Withdraw consent where applicable</li>
                    <li>Lodge a complaint with a data protection authority</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We use cookies and similar tracking technologies to improve your user experience and analyze website traffic. You can modify your browser settings to disable cookies.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">7. Third-Party Links</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our Service may contain links to third-party sites. We are not responsible for the privacy practices of such sites.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Our Service is not intended for individuals under the age of 13. We do not knowingly collect personal information from children.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may update this Privacy Policy from time to time. The latest version will always be posted on our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
                  <p className="text-gray-300 leading-relaxed mb-3">
                    If you have any questions or requests regarding this Privacy Policy, please contact us:
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

export default PrivacyPolicy; 