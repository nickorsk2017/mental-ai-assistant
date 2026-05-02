'use client';

import React from 'react';
import Link from 'next/link';

import Header from './components/Header';
import PinkElephantShowcase from './components/PinkElephantShowcase';

const featureCards = [
  {
    title: 'A quiet space without overload',
    description: 'A calm interface helps people focus on their feelings instead of fighting the product.',
  },
  {
    title: 'Privacy by default',
    description: 'After sign in, each user can access only their own entries, moods, and reflections.',
  },
] as const;

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

const LandingPage = React.memo(function LandingPage() {
  return (
    <main className="min-h-screen bg-calm-background">
      <section className="relative isolate px-6 pb-20 pt-4 sm:px-8 lg:px-12">
        <Header />

        <div className="absolute inset-x-0 top-0 -z-10 h-[560px]" />

        <div className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-[1.42fr_0.58fr] lg:items-center lg:gap-10">
          <div className="max-w-2xl">
            
            <h1 className="mt-6 max-w-xll text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Notice your emotional state earlier.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 ">
              People living with bipolar disorder and other mental health challenges are often left alone with
              overwhelm, anxiety, and abrupt mood shifts. Serene gives them a private space to write naturally,
              while an AI agent turns those messages into structured notes and gentle support.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-full border border-calm-primary bg-calm-primary px-6 py-4 text-base font-semibold text-calm-primary-text shadow-medium transition hover:-translate-y-0.5 hover:brightness-95"
              >
                Try for free
              </Link>
            </div>
          </div>

          <PinkElephantShowcase />
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="grid gap-6">
            {featureCards.map((featureCard) => (
              <article
                key={featureCard.title}
                className="rounded-[28px] border border-calm-border bg-calm-surface p-7 shadow-soft"
              >
                <h2 className="text-2xl font-semibold">{featureCard.title}</h2>
                <p className="mt-4 text-base leading-7 text-calm-muted">{featureCard.description}</p>
              </article>
            ))}
          </div>

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
                    <div key={supportPillar} className="rounded-[22px] border border-calm-border bg-calm-surface/85 px-5 py-4 text-base leading-7 text-calm-text shadow-subtle">
                      {supportPillar}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-sm leading-6 text-calm-muted">
                    Start with authentication, then continue into a private journal and daily AI-supported reflection.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
});

export default LandingPage;
