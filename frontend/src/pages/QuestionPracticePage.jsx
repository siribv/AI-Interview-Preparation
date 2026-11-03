import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Send, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const QuestionPracticePage = () => {
  const [searchParams] = useSearchParams();
  const roleSlug = searchParams.get('slug') || 'full-stack-developer';
  const difficulty = searchParams.get('difficulty') || 'beginner';

  const [question, setQuestion] = useState({
    id: 1,
    topic: 'Core Architecture & Asynchronous Programming',
    difficulty: difficulty,
    question_text:
      'Explain how the JavaScript Event Loop works, specifically distinguishing between the Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout).',
    question_type: 'technical',
  });

  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    // Simulate AI semantic evaluation
    setTimeout(() => {
      setEvaluation({
        score: 8.5,
        conceptual_accuracy_score: 9.0,
        clarity_score: 8.0,
        strengths: 'Clearly differentiated Microtask Queue vs Macrotask Queue. Mentioned Promises priority.',
        missing_concepts: 'Could clarify requestAnimationFrame timing and Event Loop tick behavior.',
        feedback: 'Strong technical explanation with accurate sequencing of execution phases.',
        improved_answer:
          'JavaScript runs on a single thread with a Call Stack for synchronous code. When async tasks complete, their callbacks enter either the Microtask Queue (Promises, queueMicrotask) or Macrotask Queue (setTimeout, setInterval). The Event Loop prioritizes draining the entire Microtask Queue before picking the next task from the Macrotask Queue.',
      });
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold capitalize mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {roleSlug.replace('-', ' ')} &bull; {difficulty}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Practice Question</h1>
        </div>
        <Link
          to="/roles"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          Change Role &rarr;
        </Link>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Topic: {question.topic}</span>
          <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {question.difficulty}
          </span>
        </div>
        <p className="text-base font-semibold text-slate-800 leading-relaxed">
          {question.question_text}
        </p>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Your Answer
          </label>
          <textarea
            rows={7}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your explanation or pseudocode here in detail..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm leading-relaxed"
            required
          />
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-400">
              {answer.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              type="submit"
              disabled={submitting || !answer.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'AI Evaluating...' : 'Submit for AI Evaluation'}
            </button>
          </div>
        </div>
      </form>

      {/* Evaluation Result View */}
      {evaluation && (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">AI Evaluation Feedback</h3>
                <p className="text-xs text-slate-500">Evaluated against expected technical concepts</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600">{evaluation.score}</span>
              <span className="text-xs font-bold text-slate-400"> / 10</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Strengths</span>
              <p className="text-xs text-slate-700">{evaluation.strengths}</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-1">
              <span className="text-xs font-bold text-amber-700 uppercase">Missing Concepts</span>
              <p className="text-xs text-amber-800">{evaluation.missing_concepts}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ideal / Improved Answer:
            </span>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
              {evaluation.improved_answer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPracticePage;
