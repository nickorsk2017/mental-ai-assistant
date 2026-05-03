import React from 'react';

const FloatingQuestionFigure = React.memo(function FloatingQuestionFigure() {
  return (
    <div className="relative hidden min-h-[420px] items-center justify-center overflow-hidden p-8 lg:flex">
      <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-calm-second/10 blur-md animate-gentle-pulse" />
      <div className="absolute bottom-10 right-8 h-24 w-24 rounded-[28px] bg-calm-second/10 blur-md animate-gentle-drift" />
      <div className="absolute left-1/2 top-10 h-16 w-16 -translate-x-1/2 rounded-full bg-white/70 animate-gentle-float-delayed" />
      <div className="absolute right-10 top-1/3 h-0 w-0 border-x-[18px] border-b-[30px] border-x-transparent border-b-calm-second/20 animate-gentle-drift" />

      <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.96),_rgba(124,156,245,0.16)_62%,_rgba(124,156,245,0.08))] animate-gentle-float">
        <div className="absolute h-52 w-52 rounded-full bg-calm-second/6" />
        <div className="absolute h-40 w-40 rounded-full bg-calm-second/8" />
        <div className="text-[9rem] font-semibold leading-none text-calm-text/90">?</div>
      </div>
    </div>
  );
});

export default FloatingQuestionFigure;
