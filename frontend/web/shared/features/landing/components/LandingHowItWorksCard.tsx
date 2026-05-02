import React from 'react';

const journeySteps = [
  'Write naturally in chat about the day, your mood, and what feels important.',
  'Serene turns the message into a clear journal entry with mood context and tags.',
  'Review patterns over time and return to small signals that matter.',
] as const;

const LandingHowItWorksCard = React.memo(function LandingHowItWorksCard() {
  return (
    <section className="rounded-[28px] bg-white p-6">
      <p className="text-3xl font-semibold uppercase tracking-[0.2em] text-calm-text sm:text-3xl">
        How it works
      </p>
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
    </section>
  );
});

export default LandingHowItWorksCard;
