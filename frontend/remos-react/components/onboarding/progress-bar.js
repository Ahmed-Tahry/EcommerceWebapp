"use client"

import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import styles from "./progress-bar.module.css"

export default function ProgressBar({ currentStep, steps, children }) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

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
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            let circleClasses = styles.circleIndicator
            if (isCompleted) {
              circleClasses += ` ${styles.completed}`
            } else if (isCurrent) {
              circleClasses += ` ${styles.current}`
            } else {
              circleClasses += ` ${styles.default}`
            }

            let titleClasses = styles.stepTitle
            if (isCompleted || isCurrent) {
              titleClasses += ` ${styles.active}`
            } else {
              titleClasses += ` ${styles.inactive}`
            }

            let descriptionClasses = styles.stepDescription
            if (isCompleted || isCurrent) {
              descriptionClasses += ` ${styles.active}`
            } else {
              descriptionClasses += ` ${styles.inactive}`
            }

            return (
              <div key={step.id} className={styles.stepItem}>
                {/* Circle Indicator */}
                <div className={circleClasses}>
                  {isCompleted ? <Check className={styles.checkIcon} /> : <span>{step.id}</span>}
                </div>

                {/* Step Info */}
                <div className={styles.stepInfo}>
                  <div className={titleClasses}>{step.title}</div>
                  <div className={descriptionClasses}>{step.description}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className={styles.currentStepContent}>
        <div className="text-center">
          <h3 className={styles.currentStepContentH3}>{steps[currentStep - 1].title}</h3>
          <p className={styles.currentStepContentP}>{steps[currentStep - 1].description}</p>
          {children}
          <div className={styles.innerProgressBar}>
            <div
              className={styles.innerProgressBarFill}
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className={styles.completionText}>{Math.round((currentStep / steps.length) * 100)}% Complete</p>
        </div>
      </div>

      {/* Navigation Buttons (Disabled) */}
      <div className={styles.navigationButtons}>
        <button  className={`${styles.buttonBase} ${styles.prevButton} opacity-50 cursor-not-allowed`}>
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

        <button  className={`${styles.buttonBase} ${styles.nextButton} opacity-50 cursor-not-allowed`}>
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}