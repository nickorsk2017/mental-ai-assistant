import React from 'react';

import FloatingQuestionFigure from './FloatingQuestionFigure';
import LandingTopSupportCard from './LandingTopSupportCard';
import LandingWhySereneCard from './LandingWhySereneCard';

const LandingSupportSection = React.memo(function LandingSupportSection() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <FloatingQuestionFigure />
        <LandingTopSupportCard />
      </div>
      <LandingWhySereneCard />
    </div>
  );
});

export default LandingSupportSection;
