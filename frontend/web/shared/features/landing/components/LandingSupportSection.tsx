import React from 'react';

const journeySteps = [
  'Write naturally in chat about the day, your mood, and what feels important.',
  'Serene turns the message into a clear journal entry with mood context and tags.',
  'Review patterns over time and return to small signals that matter.',
] as const;

const supportPillars = [
  'Built for bipolar disorder and other emotional health challenges.',
  'Gentle support without clinical diagnoses or judgment.',
  'A strong base for daily reflection and future mood insights.',
] as const;

const LandingSupportSection = React.memo(function LandingSupportSection() {
  return (
    <section className="rounded-[32px] border border-calm-border bg-[linear-gradient(135deg,rgba(124,156,245,0.1),rgba(255,255,255,0.92))] p-7 shadow-soft sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-calm-primary">How it works</p>
          <div className="mt-6 space-y-5">
            {journeySteps.map((journeyStep, journeyStepIndex) => (
              <div key={journeyStep} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-calm-primary text-sm font-semibold text-calm-primary-text">
                  0{journeyStepIndex + 1}
                </div>
                <p className="text-base leading-7 text-calm-text">{journeyStep}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-calm-primary">Why Serene</p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight">
            A gentle UX for a deeply personal space.
          </h2>
          <div className="mt-6 space-y-3">
            {supportPillars.map((supportPillar) => (
              <div
                key={supportPillar}
                className="rounded-[22px] border border-calm-border bg-calm-surface/85 px-5 py-4 text-base leading-7 text-calm-text shadow-subtle"
              >
                {supportPillar}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="max-w-sm text-sm leading-6 text-calm-muted">
              Start with authentication, then continue into a private journal and daily AI-supported reflection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default LandingSupportSection;
