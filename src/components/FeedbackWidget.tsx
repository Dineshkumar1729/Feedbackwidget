import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, CheckCircle, ChevronDown, Send, Mail, AlertCircle } from 'lucide-react';

/**
 * Feedback Widget Component
 * 
 * A professional, floating feedback widget that allows users to send
 * bug reports, feature requests, or general feedback.
 * 
 * Features:
 * - Smooth slide-up/fade transitions using motion/react
 * - Form validation (min 10 chars, max 3000 chars, optional email format)
 * - Auto-collapse after successful submission (3 seconds)
 * - Keyboard accessibility (Escape key to close)
 * - Responsive mobile-friendly design
 */

type FeedbackType = 'General Feedback' | 'Bug Report' | 'Feature Request';

interface FeedbackFormData {
  type: FeedbackType;
  message: string;
  email: string;
}

export default function FeedbackWidget() {
  // --- State Management ---
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'General Feedback',
    message: '',
    email: '',
  });

  const widgetRef = useRef<HTMLDivElement>(null);

  // --- Keyboard Handling ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // --- Validation Logic ---
  const trimmedMessage = formData.message.trim();
  const isMessageValid = trimmedMessage.length >= 10 && trimmedMessage.length <= 3000;
  
  // Check if user has entered content but it's just whitespace or too short after trimming
  const isInvalidInput = formData.message.length > 0 && (!isMessageValid || trimmedMessage.length === 0);

  const isEmailValid = () => {
    if (!formData.email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  };

  const canSubmit = isMessageValid && isEmailValid() && !isSubmitting;

  // --- Handlers ---
  const toggleWidget = () => {
    if (showSuccess) return; // Prevent toggling while success message is showing
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    
    // Simulate API call with the trimmed message
    console.log('Feedback submitted:', { ...formData, message: trimmedMessage });
    
    // Mimic network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form
    setFormData({
      type: 'General Feedback',
      message: '',
      email: '',
    });

    // Auto-collapse after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={widgetRef}
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              filter: 'blur(0px)',
              transition: { type: 'spring', stiffness: 300, damping: 25 }
            }}
            exit={{ 
              opacity: 0, 
              y: 40, 
              scale: 0.9, 
              filter: 'blur(10px)',
              transition: { duration: 0.2 }
            }}
            className="pointer-events-auto mb-4 w-[calc(100vw-3rem)] sm:w-[400px] overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-7 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 tracking-tight">Share Your Thoughts</h3>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">We're listening</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-300 hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-90"
                aria-label="Close widget"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-7">
              <AnimatePresence mode="wait">
                {!showSuccess ? (
                  <motion.form
                    key="feedback-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Feedback Type Dropdown */}
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
                        I want to report a...
                      </label>
                      <div className="relative group">
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50/50 px-5 py-3 pr-10 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer font-medium"
                        >
                          <option value="General Feedback">General Feedback</option>
                          <option value="Bug Report">Bug Report</option>
                          <option value="Feature Request">Feature Request</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                    </motion.div>

                    {/* Email Input (Optional) - Updated Label */}
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1 flex justify-between">
                        Gmail ID (Optional)
                        {!isEmailValid() && formData.email && (
                          <span className="text-rose-500 flex items-center gap-1 font-semibold text-[10px]">
                            <AlertCircle className="w-3 h-3" /> invalid address
                          </span>
                        )}
                      </label>
                      <div className="relative group">
                        <input
                          type="email"
                          name="email"
                          placeholder="name@gmail.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full rounded-2xl border px-5 py-3 pl-11 text-sm placeholder:text-gray-300 outline-none transition-all font-medium ${
                            !isEmailValid() && formData.email 
                              ? 'border-rose-200 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10' 
                              : 'border-gray-200 bg-gray-50/50 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500/10'
                          }`}
                        />
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${!isEmailValid() && formData.email ? 'text-rose-400' : 'text-gray-400 group-focus-within:text-emerald-500'}`} />
                      </div>
                    </motion.div>

                    {/* Feedback Textarea - Updated with Strict Validation UI */}
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1 flex justify-between items-center">
                        Message
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isMessageValid ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                          {trimmedMessage.length} / 3000
                        </span>
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          required
                          placeholder="Your feedback helps us grow..."
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full resize-none rounded-2xl border px-5 py-4 text-sm placeholder:text-gray-300 outline-none transition-all font-sans leading-relaxed ${
                            isInvalidInput 
                            ? 'border-rose-200 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/10' 
                            : 'border-gray-200 bg-gray-50/50 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500/10'
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {isInvalidInput && (
                          <motion.p 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 text-[11px] font-semibold text-rose-500 ml-1 flex items-center gap-1.5 overflow-hidden"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            Please enter a valid feedback (minimum 10 characters)
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      type="submit"
                      disabled={!canSubmit}
                      className={`relative overflow-hidden group flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold text-white transition-all transform active:scale-[0.97] ${
                        canSubmit 
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_10px_20px_rgba(5,150,105,0.2)]' 
                          : 'bg-gray-100 cursor-not-allowed text-gray-300'
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <>
                            <Send className={`w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${!canSubmit && 'opacity-50'}`} />
                            Submit Feedback
                          </>
                        )}
                      </span>
                      {canSubmit && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="feedback-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { type: 'spring', stiffness: 200, damping: 20 }
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10, delay: 0.2 }}
                      className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)]"
                    >
                      <CheckCircle className="w-10 h-10" />
                    </motion.div>
                    <h4 className="mb-3 text-2xl font-black text-gray-900 tracking-tight">You're Awesome!</h4>
                    <p className="text-[15px] font-medium text-gray-400 leading-relaxed max-w-[280px]">
                      Thanks for helping us build better products. We've received your feedback!
                    </p>
                    <div className="mt-8 flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div 
                          key={i}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-emerald-200"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        layout
        initial={false}
        onClick={toggleWidget}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto flex items-center justify-center gap-3 rounded-full bg-emerald-600 px-7 py-4 text-sm font-bold text-white shadow-[0_15px_30px_rgba(5,150,105,0.4)] ring-4 ring-white/80 backdrop-blur-sm transition-shadow hover:shadow-[0_20px_40px_rgba(5,150,105,0.5)]"
      >
        <motion.div
          animate={isOpen ? { rotate: 90, scale: 0.8 } : { rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5 flex-shrink-0" />}
        </motion.div>
        {!isOpen && (
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="tracking-tight"
          >
            Feedback
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
