"use client"

import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useOnboarding } from '@/contexts/OnboardingContext'
import styles from "./progress-bar.module.css"

export default function ProgressBar({ steps, children }) {
  const { 
    currentStep, 
    onboardingStatus, 
    selectedShop,
    goToNextStep,
    goToPreviousStep
  } = useOnboarding();
  
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

  // Helper function to determine if a step is complete
  const isStepComplete = (stepId) => {
    switch (stepId) {
      case 1:
        return onboardingStatus.hasConfiguredBolApi;
      case 2:
        return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync;
      case 3:
        return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && onboardingStatus.hasCompletedVatSetup;
      case 4:
        return onboardingStatus.hasConfiguredBolApi && onboardingStatus.hasCompletedShopSync && onboardingStatus.hasCompletedInvoiceSetup;
      case 5:
        // Completion step - always complete when reached
        return true;
      default:
        return false;
    }
  };

  // Helper function to determine if a step can be accessed
  const canGoToStep = (stepId) => {
    // If no shop is selected, only step 1 is accessible
    if (!selectedShop && stepId !== 1) return false;
    
    // Can always go to current step or previous steps
    if (stepId <= currentStep) return true;
    
    // Can go to next step if current step is complete
    if (stepId === currentStep + 1) {
      return isStepComplete(currentStep);
    }
    
    // Can go to future steps if all previous steps are complete
    for (let i = 1; i < stepId; i++) {
      if (!isStepComplete(i)) return false;
    }
    return true;
  };

  // Check if next button should be enabled
  const isNextEnabled = isStepComplete(currentStep) && currentStep < steps.length;
  console.log('ProgressBar: currentStep:', currentStep, 'isStepComplete(currentStep):', isStepComplete(currentStep), 'isNextEnabled:', isNextEnabled);
  console.log('ProgressBar: onboardingStatus:', onboardingStatus);
  
  // Check if previous button should be enabled
  const isPreviousEnabled = currentStep > 1;

  return (
    <div className={styles.progressBarContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.headerH2}>Setup Progress</h2>
        <p className={styles.headerP}>
          Step {currentStep} of {steps.length}
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className={styles.progressSection}>
        {/* Background Line */}
        <div className={styles.backgroundLine}></div>

        {/* Progress Line */}
        <div className={styles.progressLine} style={{ width: `${progressPercentage}%` }}></div>

        {/* Step Indicators */}
        <div className={styles.stepIndicators}>
          {steps.map((step, index) => {
            const isCompleted = isStepComplete(step.id);
            const isCurrent = currentStep === step.id;
            const isAccessible = canGoToStep(step.id);

            let circleClasses = styles.circleIndicator;
            if (isCompleted) {
              circleClasses += ` ${styles.completed}`;
            } else if (isCurrent) {
              circleClasses += ` ${styles.current}`;
            } else {
              circleClasses += ` ${styles.default}`;
            }

            // Add clickable class if step is accessible
            if (isAccessible) {
              circleClasses += ` ${styles.clickable}`;
            }

            let titleClasses = styles.stepTitle;
            if (isCompleted || isCurrent) {
              titleClasses += ` ${styles.active}`;
            } else if (isAccessible) {
              titleClasses += ` ${styles.accessible}`;
            } else {
              titleClasses += ` ${styles.disabled}`;
            }

            return (
              <div key={step.id} className={styles.stepIndicator}>
                <div 
                  className={circleClasses}
                  onClick={() => {
                    // Step navigation is now handled by the parent component
                    // This is just for visual feedback
                  }}
                >
                  {isCompleted ? (
                    <Check className={styles.checkIcon} />
                  ) : (
                    <span className={styles.stepNumber}>{step.id}</span>
                  )}
                </div>
                <span className={titleClasses}>{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        <button
          onClick={() => {
            console.log('Previous button clicked, currentStep:', currentStep, 'isPreviousEnabled:', isPreviousEnabled);
            if (isPreviousEnabled) {
              goToPreviousStep();
            }
          }}
          disabled={!isPreviousEnabled}
          className={`${styles.buttonBase} ${styles.prevButton} ${!isPreviousEnabled ? styles.disabled : ''}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className={styles.dotIndicators}>
          {steps.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index + 1 <= currentStep ? styles.active : styles.inactive}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            console.log('Next button clicked, currentStep:', currentStep, 'isNextEnabled:', isNextEnabled);
            if (isNextEnabled) {
              goToNextStep();
            }
          }}
          disabled={!isNextEnabled}
          className={`${styles.buttonBase} ${styles.nextButton} ${!isNextEnabled ? styles.disabled : ''}`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}