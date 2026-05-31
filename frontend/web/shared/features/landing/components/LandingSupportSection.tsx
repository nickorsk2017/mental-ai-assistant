import React from 'react';

import FloatingQuestionFigure from './FloatingQuestionFigure';
import LandingTopSupportCard from './LandingTopSupportCard';
import LandingWhyAssistantCard from './LandingWhyAssistantCard';

const LandingSupportSection = React.memo(function LandingSupportSection() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <FloatingQuestionFigure />
        <LandingTopSupportCard />
      </div>
      <LandingWhyAssistantCard />
    </div>
  );
});

export default LandingSupportSection;
