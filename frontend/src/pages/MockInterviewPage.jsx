import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Clock, Sparkles, AlertCircle } from 'lucide-react';

const MockInterviewPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalQuestions = 5;

  const mockQuestions = [
    {
      id: 1,
      type: 'technical',
      text: 'Can you describe the differences between Process and Thread, and how inter-process communication is handled?',
    },
    {
      id: 2,
      type: 'technical',
      text: 'What are ACID properties in relational databases and how does MySQL achieve durability?',
    },
    {
      id: 3,
      type: 'coding',
      text: 'How would you detect and break a cycle in a singly linked list? Describe Floyd’s Tortoise and Hare algorithm.',
    },
    {
      id: 4,
      type: 'technical',
      text: 'Explain how RESTful API design handles idempotency for PUT vs POST requests.',
    },
    {
      id: 5,
      type: 'hr',
      text: 'Tell me about a challenging technical bug you encountered in a project, and how you systematically resolved it.',
    },
  ];

  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleNext = () => {
    setAnswers({ ...answers, [currentStep]: currentAnswer });
    if (currentStep < totalQuestions) {
      setCurrentStep(currentStep + 1);
      setCurrentAnswer(answers[currentStep + 1] || '');
    } else {
      // Completed mock interview
      navigate('/evaluation/latest');
    }
  };

  const currentQ = mockQuestions[currentStep - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Simulation Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-lg">
            {currentStep}
          </div>
          <div>
            <h2 className="text-base font-bold">Simulated Technical Interview</h2>
            <p className="text-xs text-slate-400">Question {currentStep} of {totalQuestions}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
          <Clock className="w-4 h-4 text-brand-400" />
          <span>Round 1: Technical & Behavioral</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          {currentQ.type} Question
        </div>
        <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
          {currentQ.text}
        </h3>
      </div>

      {/* Answer Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Your Response (Speak or Type)
        </label>
        <textarea
          rows={8}
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Articulate your structured answer here..."
          className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm leading-relaxed"
        />

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400">
            {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <button
            onClick={handleNext}
            disabled={!currentAnswer.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
          >
            {currentStep === totalQuestions ? 'Finish & Generate AI Report' : 'Submit & Next Question'}
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;
