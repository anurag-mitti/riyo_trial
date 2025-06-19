import React from 'react';
import { motion } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';

const TermsAndConditions = () => {
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
              Terms and Conditions
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-gray-300">
                
                <p className="text-gray-300 leading-relaxed">
                  Welcome to Riyoshi! These Terms and Conditions ("Terms") govern your access to and use of the Riyoshi website, mobile application, and related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
                </p>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">1. Definitions</h2>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>"User", "you", or "your":</strong> Any individual or entity accessing or using the Service.</p>
                    <p><strong>"We", "us", or "our":</strong> Riyoshi Technologies (or the legal entity operating the Service).</p>
                    <p><strong>"Content":</strong> All information, text, graphics, user profiles, images, and other materials posted or uploaded to the Service.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">2. Eligibility</h2>
                  <p className="text-gray-300 leading-relaxed">
                    By using the Service, you represent and warrant that you are authorized to access and use the Service in accordance with these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
                  <div className="space-y-3">
                    <p className="text-gray-300 leading-relaxed">
                      <strong>Registration:</strong> To access certain features, you must create an account by providing accurate, current, and complete information.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      <strong>Security:</strong> You are responsible for safeguarding your password and other login credentials. You agree to notify us immediately of any unauthorized use.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">4. Use of the Service</h2>
                  <div className="space-y-3">
                    <p className="text-gray-300 leading-relaxed">
                      <strong>Booking and Payments:</strong> Riyoshi allows you to browse, book, and pay for salon services. All prices, fees, and payment terms are as displayed at the time of booking.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      <strong>User Conduct:</strong> You agree not to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li>Violate any applicable laws or regulations.</li>
                      <li>Impersonate any person or entity.</li>
                      <li>Interfere with or disrupt the Service.</li>
                      <li>Upload content that is infringing, defamatory, or otherwise unlawful.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                  <p className="text-gray-300 leading-relaxed">
                    All trademarks, logos, and service marks displayed on the Service ("Marks") are the property of their respective owners. Except as expressly provided, no license is granted to use any Marks.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">6. Third-Party Links</h2>
                  <p className="text-gray-300 leading-relaxed">
                    The Service may contain links to third-party websites or services. We do not endorse and are not responsible for their content or privacy practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">7. Privacy</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimers</h2>
                  <div className="space-y-3">
                    <p className="text-gray-300 leading-relaxed">
                      <strong>AS IS:</strong> The Service is provided "as is" and "as available." We disclaim all warranties, express or implied.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      <strong>No Guarantee:</strong> We do not guarantee the availability, reliability, or accuracy of the Service.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                  <p className="text-gray-300 leading-relaxed">
                    To the maximum extent permitted by law, in no event shall we be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">10. Indemnification</h2>
                  <p className="text-gray-300 leading-relaxed">
                    You agree to indemnify and hold harmless Riyoshi and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from your use of the Service or violation of these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">11. Termination</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may suspend or terminate your access to the Service at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
                  <p className="text-gray-300 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of Ranchi, Jharkhand, India, without regard to its conflict of law principles.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">13. Changes to Terms</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may revise these Terms at any time by posting the updated version on the Service. Changes take effect on the date posted.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Us</h2>
                  <p className="text-gray-300 leading-relaxed">
                    If you have any questions or concerns about these Terms, please contact us at:
                  </p>
                  <div className="bg-dark-700 rounded-lg p-4 mt-3">
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

export default TermsAndConditions; 