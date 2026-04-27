import FeedbackWidget from './components/FeedbackWidget';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Navbar Placeholder */}
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
          <div className="flex items-center gap-2 font-bold text-emerald-600">
            <div className="h-8 w-8 rounded-lg bg-emerald-600"></div>
            <span>FeedbackApp</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Streamlining your <span className="text-emerald-600 italic">input</span>.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We've built a professional feedback widget that handles everything from bug reports to feature requests. 
            Scroll down or check the bottom-right corner to see it in action.
          </p>
        </header>

        {/* Dummy Content Blocks to demonstrate scrolling and floating */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5">
              <div className="mb-4 h-12 w-12 rounded-xl bg-gray-100 transition-colors group-hover:bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                {i}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Feature {i}</h3>
              <p className="mt-2 text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>

        <section className="mt-32 rounded-3xl bg-emerald-900 px-8 py-20 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold">Ready to collect feedback?</h2>
          <p className="mx-auto mt-4 max-w-lg text-emerald-100/80">
            Our widget is designed to be unobtrusive yet accessible, ensuring your users can always reach you with minimal friction.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-900 transition-transform hover:scale-105 active:scale-95">
              Get Started
            </button>
            <button className="rounded-full border border-emerald-700 px-8 py-3 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-800">
              Learn More
            </button>
          </div>
        </section>
      </main>

      <footer className="mt-32 border-t border-gray-200 py-12 text-center text-sm text-gray-400">
        &copy; 2024 FeedbackApp. All rights reserved.
      </footer>

      {/* The Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
}
