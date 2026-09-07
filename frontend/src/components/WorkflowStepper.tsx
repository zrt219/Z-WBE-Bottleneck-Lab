import React, { useState, useEffect } from 'react';
import { Sliders, GitMerge, AlertTriangle, Sparkles, Check, ChevronRight } from 'lucide-react';

interface WorkflowStepperProps {
  activePresetName: string;
  tissueVolumeMm3: number;
  dominantBottleneck: string;
  dominantScore: number;
  hasInterpretation: boolean;
  isLoadingInterpretation: boolean;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  activePresetName,
  tissueVolumeMm3,
  dominantBottleneck,
  dominantScore,
  hasInterpretation,
  isLoadingInterpretation
}) => {
  const [activeSection, setActiveSection] = useState<string>('section-scope');

  const steps = [
    {
      id: 'section-scope',
      number: 1,
      title: 'Scope & Parameters',
      shortTitle: 'Parameters',
      icon: Sliders,
      badge: `${activePresetName.split(' ')[0]} (${tissueVolumeMm3 < 1 ? tissueVolumeMm3.toFixed(3) : tissueVolumeMm3.toFixed(1)} mm³)`
    },
    {
      id: 'section-pipeline',
      number: 2,
      title: 'Biophysics Engine',
      shortTitle: 'Pipeline',
      icon: GitMerge,
      badge: '<1ms Deterministic'
    },
    {
      id: 'section-bottlenecks',
      number: 3,
      title: 'Bottleneck Engine',
      shortTitle: 'Bottlenecks',
      icon: AlertTriangle,
      badge: `${dominantBottleneck.replace('_', ' ')} (${dominantScore.toFixed(0)}%)`
    },
    {
      id: 'section-ai-interpretation',
      number: 4,
      title: 'Grounded Synthesis',
      shortTitle: 'AI Synthesis',
      icon: Sparkles,
      badge: isLoadingInterpretation ? 'Running API...' : hasInterpretation ? 'Grounded 200 OK' : 'Nemotron 3 Super'
    }
  ];

  // Scrollspy to detect active section in viewport
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = steps.length - 1; i >= 0; i--) {
        const element = document.getElementById(steps[i].id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(steps[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // offset for 64px sticky header with comfortable 16px margin
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const activeIndex = steps.findIndex(s => s.id === activeSection);

  return (
    <div className="bg-white border-y border-slate-200/80 shadow-xs mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        {/* Step Items Ribbon */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-max">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = step.id === activeSection;
            const isPast = activeIndex > idx;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => scrollToSection(step.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer group ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.02]'
                      : isPast
                      ? 'bg-blue-50/70 border-blue-200 text-blue-900 hover:bg-blue-100/70'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  aria-label={`Jump to stage ${step.number}: ${step.title}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isPast
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : step.number}
                  </div>

                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center space-x-1.5">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-blue-400' : isPast ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="font-bold leading-tight hidden sm:inline">{step.title}</span>
                      <span className="font-bold leading-tight sm:hidden">{step.shortTitle}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono leading-none mt-0.5 max-w-[130px] sm:max-w-[170px] truncate ${
                        isCurrent
                          ? 'text-blue-300'
                          : isPast
                          ? 'text-blue-600 font-semibold'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${idx < activeIndex ? 'text-blue-400' : 'text-slate-300'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Real-time Scientific Telemetry Pill */}
        <div className="hidden xl:flex items-center space-x-3 text-xs font-mono shrink-0 border-l border-slate-200/80 pl-4">
          <div className="flex items-center space-x-1 text-slate-500">
            <span className="text-[10px] uppercase font-bold text-slate-400">Status:</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Deterministic Physics Live
            </span>
          </div>
          <div className="flex items-center space-x-1 text-slate-500">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Stage:</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {steps[activeIndex]?.shortTitle ?? 'Parameters'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
