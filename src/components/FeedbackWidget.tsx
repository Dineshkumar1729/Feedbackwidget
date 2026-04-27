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
  const isMessageValid = formData.message.length >= 10 && formData.message.length <= 3000;
  
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
    
    // Simulate API call
    console.log('Feedback submitted:', formData);
    
    // Mimic network delay
    await new Promise(resolve => setTimeout(resolve, 800));

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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto mb-4 w-[calc(100vw-3rem)] sm:w-96 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Send Feedback
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close widget"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {!showSuccess ? (
                  <motion.form
                    key="feedback-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Feedback Type Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 ml-1">
                        Feeling...
                      </label>
                      <div className="relative">
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer"
                        >
                          <option value="General Feedback">General Feedback</option>
                          <option value="Bug Report">Bug Report</option>
                          <option value="Feature Request">Feature Request</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email Input (Optional) */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 ml-1 flex justify-between">
                        Contact (Optional)
                        {!isEmailValid() && formData.email && (
                          <span className="text-red-500 lowercase normal-case flex items-center gap-1 font-normal">
                            <AlertCircle className="w-3 h-3" /> invalid email
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border bg-white px-4 py-2.5 pl-10 text-sm placeholder:text-gray-400 outline-none transition-all ${
                            !isEmailValid() && formData.email 
                              ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10' 
                              : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/10'
                          }`}
                        />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Feedback Textarea */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 ml-1 flex justify-between">
                        Message
                        <span className={`font-normal lowercase normal-case ${formData.message.length >= 10 ? 'text-gray-400' : 'text-amber-500'}`}>
                          {formData.message.length} / 3000
                        </span>
                      </label>
                      <textarea
                        name="message"
                        required
                        minLength={10}
                        maxLength={3000}
                        placeholder="Tell us what's on your mind..."
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans"
                      />
                      {formData.message.length > 0 && formData.message.length < 10 && (
                        <p className="mt-1 text-[10px] text-amber-600 ml-1">
                          Minimum 10 characters required
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all transform active:scale-[0.98] ${
                        canSubmit 
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20' 
                          : 'bg-gray-200 cursor-not-allowed text-gray-400'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Feedback
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="feedback-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <div className="mb-4 rounded-full bg-emerald-50 p-4 text-emerald-600">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                    <h4 className="mb-2 text-xl font-bold text-gray-900">Thank you!</h4>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
                      Your feedback has been received. We appreciate your input to help us improve.
                    </p>
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
        onClick={toggleWidget}
        className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-emerald-600/30 ring-4 ring-white transition-all transform hover:scale-105 active:scale-95"
      >
        <MessageSquare className="w-5 h-5 flex-shrink-0" />
        <span className="whitespace-nowrap tracking-tight">Feedback</span>
      </motion.button>
    </div>
  );
}
