import React from 'react';
import { motion } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';
import { Mail, Linkedin, Github } from 'lucide-react';
import manasPhoto from '../images/manas.jpg';
import vishuPhoto from '../images/vishu.jpg';
import mittiPhoto from '../images/mitti.jpg';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Manas Ranjan",
      role: "Founder",
      image: manasPhoto,
      bio: "Manas is a passionate entrepreneur and founder of Riyoshi. With a vision to revolutionize the salon booking experience, he leads the company's strategic direction and business development initiatives.",
      email: "manas@riyoshi.com",
      linkedin: "https://www.linkedin.com/in/manas-ranjan-9b74b4320/",
      github: null
    },
    {
      name: "Vishweshwar Akula",
      role: "Founder",
      image: vishuPhoto,
      bio: "Vishweshwar is a co-founder of Riyoshi with expertise in technology and product development. He oversees the technical architecture and ensures our platform delivers exceptional user experiences.",
      email: "vishweshwar@riyoshi.com",
      linkedin: "https://www.linkedin.com/in/vishweshwar-akula-563a42316/",
      github: "https://github.com/VishweshwarAkula"
    },
    {
      name: "Anurag Mitti",
      role: "Founder",
      image: mittiPhoto,
      bio: "Anurag is a co-founder of Riyoshi, bringing his expertise in operations and customer success. He focuses on building strong partnerships with salons and ensuring customer satisfaction.",
      email: "anurag@riyoshi.com",
      linkedin: "https://www.linkedin.com/in/anurag-mitti/",
      github: "https://github.com/anurag-mitti"
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-900">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-white mb-6">
                About Riyoshi
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We're revolutionizing the salon booking experience by connecting customers with the best salons and stylists through our innovative platform. Our mission is to make beauty services accessible, convenient, and enjoyable for everyone.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-dark-800 rounded-xl p-8 border border-dark-700"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  To transform the salon industry by providing a seamless, technology-driven platform that empowers customers to discover and book the best beauty services while helping salons grow their business.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-dark-800 rounded-xl p-8 border border-dark-700"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">Our Vision</h2>
                <p className="text-gray-300 leading-relaxed">
                  To become the leading platform for beauty and wellness services, creating a community where customers and service providers thrive together through innovation and exceptional experiences.
                </p>
              </motion.div>
            </div>

            {/* Team Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Meet Our Team
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-dark-800 rounded-xl p-6 border border-dark-700 text-center group hover:border-primary-500 transition-all duration-300"
                  >
                    <div className="mb-6">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-dark-700 group-hover:border-primary-500 transition-all duration-300"
                      />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-primary-400 font-medium">
                        {member.role}
                      </p>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      {member.bio}
                    </p>

                    <div className="flex justify-center space-x-4">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin size={18} />
                      </a>
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                          title="GitHub"
                        >
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-dark-800 rounded-xl p-8 border border-dark-700 text-center"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-300 mb-6">
                Have questions or want to learn more about Riyoshi? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="text-gray-300">
                  <strong>Email:</strong> riyoshi.salon@gmail.com
                </div>
                <div className="text-gray-300">
                  <strong>Address:</strong> Door No 48/7 Ward No 22, Saraswathi Nilaya, Opp Anupama Nursing Home, Gandhinagar, PO: Bellari Gandhinagar, DIST: Ballari, Karnataka - 583103 

                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs; 