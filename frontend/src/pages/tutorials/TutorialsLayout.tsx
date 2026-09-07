import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Sliders,
  GitMerge,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Play,
  RotateCcw,
  GraduationCap
} from 'lucide-react';

export interface TutorialModule {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TUTORIAL_MODULES: TutorialModule[] = [
  {
    id: 'basics',
    path: '/tutorials/basics',
    title: '1. WBE & Bottleneck Basics',
    subtitle: 'Scale, Amdahl\'s Law & Shifting Constraints',
    duration: '5 min',
    icon: BookOpen
  },
  {
    id: 'options',
    path: '/tutorials/options',
    title: '2. Options & Controls Guide',
    subtitle: '25+ Parameters across 5 Scientific Domains',
    duration: '8 min',
    icon: Sliders
  },
  {
    id: 'pipeline',
    path: '/tutorials/pipeline',
    title: '3. 6-Stage Pipeline & 8-D Engine',
    subtitle: 'Preservation to Validation & Physical Demand',
    duration: '10 min',
    icon: GitMerge
  },
  {
    id: 'api-walkthrough',
    path: '/tutorials/api-walkthrough',
    title: '4. Live API Walkthrough',
    subtitle: 'NVIDIA Nemotron 3 Super & Grounding Contract',
    duration: '7 min',
    icon: Sparkles
  }
];

const STORAGE_KEY = 'zwbe_tutorial_progress';

export const TutorialsLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current module index
  const currentIndex = TUTORIAL_MODULES.findIndex(m => location.pathname.startsWith(m.path));
  const currentModule = currentIndex >= 0 ? TUTORIAL_MODULES[currentIndex] : TUTORIAL_MODULES[0];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // storage unavailable
    }
  }, [completed]);

  const toggleComplete = (id: string) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleResetProgress = () => {
    setCompleted([]);
  };

  const prevModule = currentIndex > 0 ? TUTORIAL_MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 && currentIndex < TUTORIAL_MODULES.length - 1 ? TUTORIAL_MODULES[currentIndex + 1] : null;

  const percentComplete = Math.round((completed.length / TUTORIAL_MODULES.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-bold mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Academy & Tutorial Modules</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Understanding Whole Brain Emulation Bottlenecks
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Interactive masterclasses on biophysics, high-throughput imaging, petaflop simulation, and verified AI synthesis.
          </p>
        </div>

        {/* Progress Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:px-4 sm:py-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Progress:</span>
              <span className="font-mono text-blue-600">{completed.length}/{TUTORIAL_MODULES.length} Done ({percentComplete}%)</span>
            </div>
            <div className="w-40 sm:w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => currentModule && toggleComplete(currentModule.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                currentModule && completed.includes(currentModule.id)
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {currentModule && completed.includes(currentModule.id) ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mark Done</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1 transition-colors shadow-xs"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Subpage Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
              Curriculum Modules
            </h2>
            <nav className="space-y-1.5">
              {TUTORIAL_MODULES.map((module) => {
                const Icon = module.icon;
                const isCurrent = location.pathname.startsWith(module.path);
                const isDone = completed.includes(module.id);

                return (
                  <NavLink
                    key={module.id}
                    to={module.path}
                    className={`group block p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-blue-50/80 border-blue-200 shadow-xs'
                        : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-xs font-bold leading-tight ${
                            isCurrent ? 'text-blue-900' : 'text-slate-800'
                          }`}
                        >
                          {module.title}
                        </span>
                      </div>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-8">
                      {module.subtitle}
                    </p>
                    <div className="pl-8 mt-1 text-[10px] font-mono text-slate-400">
                      Duration: {module.duration}
                    </div>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <button
                onClick={handleResetProgress}
                className="flex items-center space-x-1 hover:text-slate-800 text-slate-400 transition-colors"
                title="Reset completion tracking"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset progress</span>
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('zwbe:start-tour'));
                  navigate('/');
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Launch App Tour
              </button>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-4 text-xs space-y-2">
            <h3 className="font-bold text-indigo-950 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Interactive Learning</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Every tutorial page contains active calculation sandboxes, real sliders, and live tooltips.
              Try adjusting values directly on this page to observe instant mathematical reactions!
            </p>
          </div>
        </aside>

        {/* Content Outlet */}
        <section className="lg:col-span-9 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <Outlet />

            {/* Bottom Lesson Navigation */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevModule ? (
                <button
                  onClick={() => navigate(prevModule.path)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous: {prevModule.title}</span>
                </button>
              ) : (
                <div />
              )}

              {nextModule ? (
                <button
                  onClick={() => {
                    if (currentModule && !completed.includes(currentModule.id)) {
                      toggleComplete(currentModule.id);
                    }
                    navigate(nextModule.path);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-xs"
                >
                  <span>Next: {nextModule.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-xs"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>All Done! Open Full Simulator</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
