import React, { useState } from 'react';

const MultiStepForm = ({ children, onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const steps = React.Children.toArray(children);

  const nextStep = () => step < steps.length - 1 && setStep(step + 1);
  const prevStep = () => step > 0 && setStep(step - 1);
  const updateFormData = (data) => setFormData(prev => ({ ...prev, ...data }));
  const handleComplete = () => onComplete && onComplete(formData);
  const currentStep = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  return React.createElement(
    'div', { className: 'msf-root' },

    // ── Step Indicator ──────────────────────────────────────────────────────
    React.createElement('div', { className: 'msf-progress-area' },
      // Step dots
      React.createElement('div', { className: 'msf-steps-row' },
        steps.map((s, i) => React.createElement(
          'div', { key: i, className: 'msf-step-item' },
          React.createElement('div', {
            className: `msf-step-dot ${i < step ? 'msf-dot-done' : i === step ? 'msf-dot-active' : 'msf-dot-pending'}`
          },
            i < step
              ? React.createElement('span', null, '✓')
              : React.createElement('span', null, i + 1)
          ),
          React.createElement('span', { className: `msf-step-label ${i === step ? 'msf-step-label-active' : ''}` },
            s.props.title || `Step ${i + 1}`
          ),
          i < steps.length - 1 && React.createElement('div', {
            className: `msf-step-line ${i < step ? 'msf-line-done' : ''}`
          })
        ))
      ),

      // Progress bar
      React.createElement('div', { className: 'msf-progress-bar-track' },
        React.createElement('div', {
          className: 'msf-progress-bar-fill',
          style: { width: `${progress}%` }
        })
      ),
      React.createElement('div', { className: 'msf-progress-label' },
        React.createElement('span', null, currentStep.props.title || `Step ${step + 1}`),
        React.createElement('span', null, `${step + 1} of ${steps.length}`)
      )
    ),

    // ── Form Content ─────────────────────────────────────────────────────────
    React.createElement('div', { className: 'msf-content' },
      React.cloneElement(currentStep, {
        formData,
        updateFormData,
        nextStep,
        prevStep,
        isLastStep: step === steps.length - 1,
        isFirstStep: step === 0,
        onComplete: handleComplete
      })
    )
  );
};

const Step = ({ children, title, formData, updateFormData, nextStep, prevStep, isLastStep, isFirstStep, onComplete }) => {
  return React.createElement(
    'div', { className: 'msf-step-content' },
    typeof children === 'function'
      ? children({ formData, updateFormData })
      : children,
    React.createElement('div', { className: 'msf-step-nav' },
      !isFirstStep
        ? React.createElement('button', {
          onClick: prevStep,
          className: 'dash-action-btn dash-action-btn-ghost msf-nav-prev'
        },
          React.createElement('span', null, '←'),
          React.createElement('span', null, 'Back')
        )
        : React.createElement('div'),
      isLastStep
        ? React.createElement('button', {
          onClick: onComplete,
          className: 'dash-action-btn dash-action-btn-primary msf-nav-save'
        },
          React.createElement('span', null, '✨'),
          React.createElement('span', null, 'Save Biodata')
        )
        : React.createElement('button', {
          onClick: nextStep,
          className: 'dash-action-btn dash-action-btn-primary msf-nav-next'
        },
          React.createElement('span', null, 'Continue'),
          React.createElement('span', null, '→')
        )
    )
  );
};

MultiStepForm.Step = Step;
export default MultiStepForm;