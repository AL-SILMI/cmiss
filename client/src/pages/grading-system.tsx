import React from 'react';
import GradingSystem from '../components/GradingSystem';

const GradingSystemPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">University Grading System</h1>
      <GradingSystem showCalculator={true} />
    </div>
  );
};

export default GradingSystemPage;