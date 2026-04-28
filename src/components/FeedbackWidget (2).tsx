import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, CheckCircle, ChevronDown, Send, Mail, AlertCircle, Image as ImageIcon, History, Clock } from 'lucide-react';

/**
 * Feedback Widget Component
 * 
 * Features:
 * - Conditional Bug Report screenshot upload (.jpg/.png, < 2MB)
 * - Persistent Feedback History based on matched Email
 * - Timestamp tracking for all submissions
 * - Enhanced smooth transitions and professional styling
 */

type FeedbackType = 'General Feedback' | 'Bug Report' | 'Feature Request';

interface FeedbackFormData {
  type: FeedbackType;
  message: string;
  email: string;
  screenshot?: string | null; // Base64 string for persistence
}

interface SavedFeedback extends FeedbackFormData {
  id: string;
  timestamp: string;
}

export default function FeedbackWidget() {
  // --- State Management ---
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedFeedback[]>([]);
  
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'General Feedback',
    message: '',
    email: '',
    screenshot: null,
  });

  const widgetRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Load History from LocalStorage ---
  useEffect(() => {
    const saved = localStorage.getItem('feedback_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // --- Keyboard Handling ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // --- Validation Logic ---
  const trimmedMessage = formData.message.trim();
  const isMessageValid = trimmedMessage.length >= 10 && trimmedMessage.length <= 3000;
  const isInvalidInput = formData.message.length > 0 && (!isMessageValid || trimmedMessage.length === 0);

  const isEmailValid = () => {
    if (!formData.email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  };

  const matchedHistory = history.filter(h => 
    formData.email && h.email.toLowerCase() === formData.email.toLowerCase()
  );

  const canSubmit = isMessageValid && isEmailValid() && !isSubmitting && !screenshotError;

  // --- Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setScreenshotError(null);

    if (!file) {
      setFormData(prev => ({ ...prev, screenshot: null }));
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setScreenshotError('Please upload .jpg or .png format only.');
      return;
    }

    // Validate size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setScreenshotError('File size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, screenshot: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    
    // Create new feedback entry
    const newEntry: SavedFeedback = {
      ...formData,
      message: trimmedMessage,
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString(),
    };

    // Simulate API call
    console.log('Final Feedback Payload:', newEntry);
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Update history
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('feedback_history', JSON.stringify(updatedHistory));

    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form
    setFormData({
      type: 'General Feedback',
      message: '',
      email: '',
      screenshot: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
    }, 4000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={widgetRef}
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            className="pointer-events-auto mb-4 w-[calc(100vw-3rem)] sm:w-[420px] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)] ring-1 ring-black/5 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/40 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight">Feedback Center</h3>
                  <p className="text-[11px] font-bold text-emerald-600/60 uppercase tracking-[0.2em] mt-0.5">V1.2 Beta</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2.5 text-gray-300 hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-90">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <AnimatePresence mode="wait">
                {!showSuccess ? (
                  <motion.form
                    key="feedback-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Feedback Type */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Category</label>
                      <div className="relative group">
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50/50 px-6 py-3.5 pr-12 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer font-semibold shadow-sm"
                        >
                          <option value="General Feedback">General Feedback</option>
                          <option value="Bug Report">Bug Report</option>
                          <option value="Feature Request">Feature Request</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1 flex justify-between">
                        Gmail ID (Optional)
                        {!isEmailValid() && formData.email && (
                          <span className="text-rose-500 flex items-center gap-1 font-black text-[9px]">
                            <AlertCircle className="w-3 h-3" /> INVALID
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
                          className={`w-full rounded-2xl border px-6 py-3.5 pl-12 text-sm placeholder:text-gray-300 outline-none transition-all font-semibold shadow-sm ${
                            !isEmailValid() && formData.email 
                              ? 'border-rose-200 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10' 
                              : 'border-gray-200 bg-gray-50/50 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500/10'
                          }`}
                        />
                        <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${!isEmailValid() && formData.email ? 'text-rose-400' : 'text-gray-400 group-focus-within:text-emerald-500'}`} />
                      </div>
                    </div>

                    {/* Conditional History Display */}
                    <AnimatePresence>
                      {matchedHistory.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-y border-emerald-100 bg-emerald-50/30 -mx-8 px-8 py-4 "
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <History className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Previous Feedback</span>
                          </div>
                          <div className="space-y-3">
                            {matchedHistory.slice(0, 2).map((item) => (
                              <div key={item.id} className="rounded-xl bg-white/80 p-3 shadow-sm border border-emerald-50 text-[11px]">
                                <div className="flex justify-between items-start mb-1 text-emerald-800 font-bold">
                                  <span>{item.type}</span>
                                  <span className="text-[9px] font-medium text-emerald-600/50 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" /> {item.timestamp}
                                  </span>
                                </div>
                                <p className="text-gray-500 line-clamp-2 leading-relaxed">{item.message}</p>
                              </div>
                            ))}
                            {matchedHistory.length > 2 && (
                              <p className="text-[9px] text-center text-emerald-600/40 font-bold uppercase tracking-wider">+{matchedHistory.length - 2} more entries</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Message Area */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1 flex justify-between items-center">
                        Message
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${isMessageValid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {trimmedMessage.length} / 3000
                        </span>
                      </label>
                      <textarea
                        name="message"
                        required
                        placeholder="Tell us exactly what's on your mind..."
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full resize-none rounded-2xl border px-6 py-4 text-sm placeholder:text-gray-300 outline-none transition-all font-semibold leading-relaxed shadow-sm ${
                          isInvalidInput ? 'border-rose-200 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/10' : 'border-gray-200 bg-gray-50/50 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500/10'
                        }`}
                      />
                      <AnimatePresence>
                        {isInvalidInput && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-bold text-rose-500 ml-1 flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3" />
                            Please enter a valid feedback (min 10 characters)
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Conditional Screenshot Upload for Bug Reports */}
                    <AnimatePresence>
                      {formData.type === 'Bug Report' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Issue Screenshot (.jpg/.png)</label>
                          <div className="relative group cursor-pointer">
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/png, image/jpeg"
                              onChange={handleFileChange}
                              className="hidden"
                              id="screenshot-upload"
                            />
                            <label
                              htmlFor="screenshot-upload"
                              className={`flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-4 transition-all hover:bg-gray-50 ${
                                screenshotError ? 'border-rose-200 bg-rose-50/30' : formData.screenshot ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 group-hover:border-emerald-200'
                              }`}
                            >
                              {formData.screenshot ? (
                                <div className="flex items-center gap-3 w-full">
                                  <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-emerald-100">
                                    <img src={formData.screenshot} alt="preview" className="h-full w-full object-cover" />
                                  </div>
                                  <span className="text-[11px] font-bold text-emerald-700 truncate">Screenshot attached</span>
                                  <button onClick={(e) => { e.preventDefault(); setFormData(p => ({ ...p, screenshot: null })); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="ml-auto p-1.5 rounded-full hover:bg-rose-100 text-rose-500 transition-colors">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <ImageIcon className={`w-6 h-6 mb-1 ${screenshotError ? 'text-rose-400' : 'text-gray-300'}`} />
                                  <span className={`text-[11px] font-bold ${screenshotError ? 'text-rose-500' : 'text-gray-400'}`}>
                                    {screenshotError || 'Upload Issue Visual (Max 2MB)'}
                                  </span>
                                </div>
                              )}
                            </label>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={!canSubmit}
                      className={`relative overflow-hidden group flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-black text-white transition-all transform active:scale-[0.97] ${
                        canSubmit ? 'bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/30' : 'bg-gray-100 cursor-not-allowed text-gray-300'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          Submit Report
                        </>
                      )}
                      {canSubmit && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="feedback-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-[inset_0_4px_15px_rgba(0,0,0,0.05)]"
                    >
                      <CheckCircle className="w-12 h-12" />
                    </motion.div>
                    <h4 className="mb-4 text-3xl font-black text-gray-900 tracking-tight leading-tight">Contribution Received!</h4>
                    <p className="text-[15px] font-semibold text-gray-400 leading-relaxed max-w-[280px]">
                      Your input was stamped at <span className="text-emerald-600">{new Date().toLocaleTimeString()}</span>. Thanks for helping us evolve.
                    </p>
                    <div className="mt-10 flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }} className="w-2 h-2 rounded-full bg-emerald-200" />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto flex items-center justify-center gap-3 rounded-full bg-emerald-600 px-8 py-4.5 text-sm font-black text-white shadow-[0_15px_40px_rgba(5,150,105,0.4)] ring-4 ring-white/90 backdrop-blur-md"
      >
        <motion.div animate={isOpen ? { rotate: 90 } : { rotate: 0 }}>
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-6 h-6" />}
        </motion.div>
        {!isOpen && <span className="tracking-tight">Give Feedback</span>}
      </motion.button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
