import React, { useState } from 'react';
import { EligibilityInput, EligibilityResult } from '../types/eligibility';
import { initialEligibilityInput, evaluateConsumerEligibility } from '../utils/eligibilityEngine';
import { EligibilityQuestionnaire } from '../components/EligibilityQuestionnaire';
import { EligibilityResultScreen } from '../components/EligibilityResultScreen';

interface EligibilityCheckerProps {
  initialData?: EligibilityInput | null;
  onProceedToCase: (result: EligibilityResult) => void;
  onBackToRoles: () => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  initialData,
  onProceedToCase,
  onBackToRoles,
}) => {
  const [inputData, setInputData] = useState<EligibilityInput>(initialData || initialEligibilityInput);
  const [evaluationResult, setEvaluationResult] = useState<EligibilityResult | null>(null);

  const handleEvaluate = (input: EligibilityInput) => {
    setInputData(input);
    const result = evaluateConsumerEligibility(input);
    setEvaluationResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModifyAnswers = () => {
    setEvaluationResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinue = () => {
    if (evaluationResult) {
      onProceedToCase(evaluationResult);
    }
  };

  if (evaluationResult) {
    return (
      <EligibilityResultScreen
        result={evaluationResult}
        onContinueToCase={handleContinue}
        onModifyAnswers={handleModifyAnswers}
      />
    );
  }

  return (
    <EligibilityQuestionnaire
      initialInput={inputData}
      onComplete={handleEvaluate}
      onBack={onBackToRoles}
    />
  );
};
