"use client";

import { useState } from "react";

export interface WizardStep {
  title: string;
  render: (
    data: Record<string, unknown>,
    update: (patch: Record<string, unknown>) => void
  ) => React.ReactNode;
}

interface Props {
  steps: WizardStep[];
  onComplete: (data: Record<string, unknown>) => void | Promise<void>;
  initialData?: Record<string, unknown>;
  initialStep?: number;
}

export default function OnboardingWizard({ steps, onComplete, initialData = {}, initialStep = 0 }: Props) {
  const [step, setStep] = useState(initialStep);
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const [finishing, setFinishing] = useState(false);

  const update = (patch: Record<string, unknown>) =>
    setData((d) => ({ ...d, ...patch }));

  const isLast = step === steps.length - 1;

  const handleFinish = async () => {
    setFinishing(true);
    try {
      await onComplete(data);
    } finally {
      setFinishing(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step
                  ? "bg-green-500 text-white"
                  : i === step
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-6 ${i < step ? "bg-green-400" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
        <span className="ml-3 text-sm font-semibold text-gray-800">{steps[step].title}</span>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">{steps[step].title}</h2>
        {steps[step].render(data, update)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => (isLast ? handleFinish() : setStep((s) => s + 1))}
          disabled={finishing}
          className="px-5 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 min-w-[120px] flex items-center justify-center gap-2"
        >
          {finishing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : isLast ? "Finish setup" : "Continue"}
        </button>
      </div>
    </div>
  );
}
