import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaRobot,
  FaTimes,
  FaSearch,
  FaRocket,
  FaShieldAlt,
  FaCreditCard,
  FaHandshake,
  FaLock,
} from 'react-icons/fa';

/* ============================
   FAQ Page + Text-Pill Launcher
   ============================ */
const ChatbotPage = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);
  const [query, setQuery] = useState('');
  const [dockOpen, setDockOpen] = useState(false);

  // typewriter text for launcher
  const headline =
    language === 'bn'
      ? 'হাই, আমি ভরসা-পে AI সহায়ক'
      : "Hi, I'm bhorsha-pay AI Assistant";
  const [typed, setTyped] = useState('');
  useEffect(() => {
    setTyped('');
    let i = 0;
    const id = setInterval(() => {
      setTyped(headline.slice(0, i + 1));
      i++;
      if (i >= headline.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [headline]);

  const faqs = [
    {
      question: language === 'bn' ? 'ভরসা-পে কী?' : 'What is Bhorsha-Pay?',
      answer:
        language === 'bn'
          ? 'ভরসা-পে একটি বিকেন্দ্রীভূত ক্রাউডফান্ডিং প্ল্যাটফর্ম যা ব্লকচেইন প্রযুক্তি ব্যবহার করে। এটি ব্যবহারকারীদের নিরাপদ এবং স্বচ্ছভাবে তহবিল সংগ্রহ করতে সাহায্য করে।'
          : 'Bhorsha-Pay is a decentralized crowdfunding platform powered by blockchain for secure, transparent fundraising.',
      icon: <FaRocket className="text-2xl" />,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      question: language === 'bn' ? 'কিভাবে স্বচ্ছতা নিশ্চিত করা হয়?' : 'How does the platform ensure transparency?',
      answer:
        language === 'bn'
          ? 'সমস্ত লেনদেন ব্লকচেইনে রেকর্ড করা হয়, যা অপরিবর্তনীয় এবং জনসাধারণের দ্বারা যাচাইযোগ্য রেকর্ড প্রদান করে। স্মার্ট কন্ট্রাক্ট নিশ্চিত করে যে তহবিল উদ্দেশ্য অনুযায়ী ব্যবহৃত হয়।'
          : 'All transactions are recorded on the blockchain, providing immutable and publicly verifiable records. Smart contracts ensure funds are used as intended.',
      icon: <FaShieldAlt className="text-2xl" />,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      question: language === 'bn' ? 'কোন পেমেন্ট পদ্ধতি গ্রহণ করা হয়?' : 'What payment methods are accepted?',
      answer:
        language === 'bn'
          ? 'আমরা ক্রিপ্টোকারেন্সি (ইথারিয়াম) এবং ঐতিহ্যগত পেমেন্ট পদ্ধতি গ্রহণ করি যার মধ্যে বাংলাদেশের স্থানীয় ব্যবহারকারীদের জন্য বিকাশ অন্তর্ভুক্ত।'
          : 'We accept cryptocurrency (ETH) and traditional payment methods including Bkash for local users in Bangladesh.',
      icon: <FaCreditCard className="text-2xl" />,
      color: 'from-purple-600 to-pink-600'
    },
    {
      question: language === 'bn' ? 'কিভাবে একটি ক্যাম্পেইন তৈরি করব?' : 'How can I create a campaign?',
      answer:
        language === 'bn'
          ? 'শুধু "ক্যাম্পেইন তৈরি করুন" বোতামে ক্লিক করুন, আপনার প্রকল্পের বিবরণ পূরণ করুন, তহবিল লক্ষ্য নির্ধারণ করুন এবং যাচাইকরণের জন্য জমা দিন। আমাদের দল বৈধ ক্যাম্পেইন পর্যালোচনা এবং অনুমোদন করবে।'
          : 'Simply click on "Create a campaign" button, fill in your project details, set funding goals, and submit for verification. Our team will review and approve legitimate campaigns.',
      icon: <FaHandshake className="text-2xl" />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      question: language === 'bn' ? 'আমার দান নিরাপদ কিনা?' : 'Is my donation secure?',
      answer:
        language === 'bn'
          ? 'হ্যাঁ, সমস্ত অনুদান ব্লকচেইন প্রযুক্তি এবং স্মার্ট কন্ট্রাক্টের মাধ্যমে সুরক্ষিত। ক্যাম্পেইন লক্ষ্য পূরণ না হওয়া পর্যন্ত তহবিল এস্ক্রোতে রাখা হয় বা না হলে ফেরত দেওয়া হয়।'
          : 'Yes, all donations are secured through blockchain technology and smart contracts. Funds are held in escrow until campaign goals are met or refunded if not.',
      icon: <FaLock className="text-2xl" />,
      color: 'from-red-500 to-pink-500'
    },
  ];

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0e1117] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <FaRobot className={`text-2xl ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'Frequently Asked Questions'}
            </h1>
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            {language === 'bn'
              ? 'ভরসা-পে সম্পর্কে আপনার প্রশ্নের উত্তর খুঁজুন'
              : 'Find answers to your questions about Bhorsha-Pay'}
          </p>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-2`}>
            {language === 'bn'
              ? 'ব্লকচেইন-ভিত্তিক ক্রাউডফান্ডিং প্ল্যাটফর্ম'
              : 'Blockchain-based crowdfunding platform'}
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-8">
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm border ${isDarkMode ? 'bg-[#11141b] border-white/10' : 'bg-white border-gray-200'}`}>
            <FaSearch className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'bn' ? 'প্রশ্ন লিখুন বা কীওয়ার্ড সার্চ করুন…' : 'Search questions or keywords…'}
              className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-24">
          {filteredFaqs.map((faq, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border overflow-hidden transition-shadow ${
                isDarkMode
                  ? 'bg-[#11141b] border-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                  : 'bg-white border-gray-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between focus:outline-none"
                aria-expanded={openIndex === index}
                aria-controls={`faq-panel-${index}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${faq.color} text-white flex items-center justify-center shadow-md`}>
                    {faq.icon}
                  </div>
                  <h3 className="text-lg font-semibold leading-snug">{faq.question}</h3>
                </div>
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} px-5 pb-5`}
                  >
                    <p className="leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          ))}
        </div>
      </div>

      {/* ===== Floating Text-Pill Launcher ===== */}
      <button
        onClick={() => setDockOpen(true)}
        className="fixed bottom-6 right-6 z-[62] group"
        aria-label="Open chat"
      >
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative flex items-center"
        >
          <div className="absolute -inset-2 rounded-3xl bg-emerald-500/30 blur-xl opacity-60 group-hover:opacity-80 transition" />
          <div className="relative flex items-center gap-3 rounded-3xl pl-2 pr-3 py-2 shadow-xl border border-emerald-600/20 bg-white/90 dark:bg-[#12171f]/90 backdrop-blur-md">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md flex items-center justify-center">
              <FaRobot className="text-xl" />
            </div>
            <div className="px-2">
              <div className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
                {language === 'bn' ? 'চ্যাট করুন' : 'Chat'}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                <span>{typed}</span>
                <span className="ml-[1px] inline-block w-2 h-4 bg-emerald-500 animate-pulse align-middle" />
              </div>
            </div>
          </div>
        </motion.div>
      </button>

      {/* ===== Docked Chatbot with iframe ===== */}
      <AnimatePresence>
        {dockOpen && (
          <>
            {/* optional subtle scrim so the dock feels elevated */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black"
              onClick={() => setDockOpen(false)}
            />

            <motion.div
              key="chatdock"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="fixed z-[9999] bottom-6 right-6 w-[380px] sm:w-[420px] max-w-[94vw] h-[560px] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#0f1116] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dock header */}
              <div className="relative h-12 bg-gradient-to-r from-emerald-600 to-teal-600">
                <div className="absolute inset-0 px-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                      <FaRobot />
                    </div>
                    <div className="leading-tight">
                      <div className="font-semibold text-sm">
                        {language === 'bn'
                          ? 'ভরসা-পে AI সহায়ক'
                          : 'bhorsha-pay AI Assistant'}
                      </div>
                      <div className="text-[11px] text-white/85">
                        {language === 'bn' ? 'তাৎক্ষণিক সহায়তা' : 'Instant help'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDockOpen(false)}
                    aria-label="Close chat"
                    className="text-white/90 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* The real chatbot, embedded */}
        <iframe
                title="bhorsha-pay chatbot"
          src="https://www.chatbase.co/chatbot-iframe/hpXRnHUypnv4SHnBylh1I"
                className="w-full flex-1 border-0 bg-white dark:bg-[#0f1116]"
                // Keep these permissive enough for your app; tighten in prod as needed
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotPage;
