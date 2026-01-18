/**
 * Stevie Athletics — Performance Assessment Logic
 * Enhanced with smooth animations and transitions
 */

(function() {
  'use strict';
  
  const TOTAL_QUESTIONS = 8;
  let currentQuestion = 1;
  let answers = {};
  let isTransitioning = false;
  
  // DOM Elements
  const assessment = document.getElementById('assessment');
  const assessmentResult = document.getElementById('assessmentResult');
  const form = document.getElementById('assessmentForm');
  const progressFill = document.querySelector('.progress__fill');
  const currentQuestionEl = document.getElementById('currentQuestion');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetAssessment');
  
  if (!form) return;
  
  // Initialize
  init();
  
  function init() {
    setupNavigation();
    setupFormSubmission();
    setupReset();
    setupAutoAdvance();
    updateProgress();
    updateNavigation();
  }
  
  function setupNavigation() {
    prevBtn?.addEventListener('click', () => {
      if (!isTransitioning) {
        goToQuestion(currentQuestion - 1);
      }
    });
    
    nextBtn?.addEventListener('click', () => {
      if (!isTransitioning && validateCurrentQuestion()) {
        goToQuestion(currentQuestion + 1);
      }
    });
  }
  
  function setupAutoAdvance() {
    // Auto-advance when an option is selected (with smooth transition)
    form.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', () => {
        // Visual feedback delay
        setTimeout(() => {
          if (currentQuestion < TOTAL_QUESTIONS && !isTransitioning) {
            if (validateCurrentQuestion()) {
              goToQuestion(currentQuestion + 1);
            }
          }
        }, 400);
      });
    });
  }
  
  function setupFormSubmission() {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateAllQuestions()) {
        collectAnswers();
        const result = calculateResult();
        showResult(result);
        trackAssessment(result);
      }
    });
  }
  
  function setupReset() {
    resetBtn?.addEventListener('click', () => {
      resetAssessment();
    });
  }
  
  function goToQuestion(num) {
    if (num < 1 || num > TOTAL_QUESTIONS || isTransitioning) return;
    
    isTransitioning = true;
    
    const currentQEl = document.querySelector(`.assessment__question[data-question="${currentQuestion}"]`);
    const newQEl = document.querySelector(`.assessment__question[data-question="${num}"]`);
    
    if (!currentQEl || !newQEl) {
      isTransitioning = false;
      return;
    }
    
    // Exit animation for current question
    currentQEl.classList.add('exit');
    currentQEl.classList.remove('active');
    
    // Wait for exit animation
    setTimeout(() => {
      // Reset all questions
      document.querySelectorAll('.assessment__question').forEach(q => {
        q.classList.remove('active', 'exit');
      });
      
      // Show new question with enter animation
      newQEl.classList.add('active');
      
      currentQuestion = num;
      updateProgress();
      updateNavigation();
      
      // Scroll to top of question smoothly
      newQEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Reset transition flag after animation completes
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }, 300);
  }
  
  function updateProgress() {
    const progress = (currentQuestion / TOTAL_QUESTIONS) * 100;
    
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      if (progressFill) {
        progressFill.classList.add('animating');
        progressFill.style.width = `${progress}%`;
      }
      
      if (currentQuestionEl) {
        // Add animation class for number change
        currentQuestionEl.classList.add('updated');
        currentQuestionEl.textContent = currentQuestion;
        
        // Remove animation class after animation completes
        setTimeout(() => {
          currentQuestionEl.classList.remove('updated');
          if (progressFill) {
            progressFill.classList.remove('animating');
          }
        }, 400);
      }
    });
  }
  
  function updateNavigation() {
    if (prevBtn) {
      prevBtn.disabled = currentQuestion === 1;
    }
    
    if (currentQuestion === TOTAL_QUESTIONS) {
      nextBtn?.classList.add('hidden');
      submitBtn?.classList.remove('hidden');
    } else {
      nextBtn?.classList.remove('hidden');
      submitBtn?.classList.add('hidden');
    }
  }
  
  function validateCurrentQuestion() {
    const questionEl = document.querySelector(`.assessment__question[data-question="${currentQuestion}"]`);
    const inputs = questionEl?.querySelectorAll('input[type="radio"]');
    const isAnswered = Array.from(inputs || []).some(input => input.checked);
    
    if (!isAnswered) {
      // Add shake animation
      questionEl?.classList.add('shake');
      setTimeout(() => questionEl?.classList.remove('shake'), 500);
      
      // Highlight radio options
      inputs?.forEach(input => {
        const label = input.closest('.radio-option');
        if (label) {
          label.classList.add('error');
          setTimeout(() => label.classList.remove('error'), 500);
        }
      });
      
      return false;
    }
    return true;
  }
  
  function validateAllQuestions() {
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      const questionEl = document.querySelector(`.assessment__question[data-question="${i}"]`);
      const inputs = questionEl?.querySelectorAll('input[type="radio"]');
      const isAnswered = Array.from(inputs || []).some(input => input.checked);
      
      if (!isAnswered) {
        goToQuestion(i);
        setTimeout(() => validateCurrentQuestion(), 500);
        return false;
      }
    }
    return true;
  }
  
  function collectAnswers() {
    const formData = new FormData(form);
    answers = Object.fromEntries(formData.entries());
  }
  
  /**
   * Calculate result based on assessment logic
   * Result A: Konsultacja stacjonarna
   * Result B: Konsultacja online
   * Result C: Plan treningowy
   */
  function calculateResult() {
    const { injury, awareness, goal, preference, independence, contact } = answers;
    
    // Scoring system for nuanced results
    let scoreA = 0; // Studio
    let scoreB = 0; // Online consultation
    let scoreC = 0; // Independent plan
    
    // Injury scoring
    if (injury === 'fresh') scoreA += 3;
    else if (injury === 'chronic') scoreA += 2;
    else if (injury === 'occasional') { scoreB += 1; scoreC += 1; }
    else if (injury === 'none') { scoreC += 2; }
    
    // Awareness scoring
    if (awareness === 'beginner') scoreA += 3;
    else if (awareness === 'basic') { scoreA += 2; scoreB += 1; }
    else if (awareness === 'intermediate') { scoreB += 2; scoreC += 1; }
    else if (awareness === 'advanced') { scoreB += 1; scoreC += 3; }
    
    // Goal scoring
    if (goal === 'recovery') scoreA += 2;
    else if (goal === 'strength') { scoreB += 1; scoreC += 1; }
    else if (goal === 'performance') { scoreB += 2; scoreC += 1; }
    else if (goal === 'maintenance') { scoreB += 1; scoreC += 2; }
    
    // Preference scoring
    if (preference === 'studio') scoreA += 2;
    else if (preference === 'hybrid') { scoreA += 1; scoreB += 2; }
    else if (preference === 'online') { scoreB += 1; scoreC += 2; }
    
    // Independence scoring
    if (independence === 'low') scoreA += 2;
    else if (independence === 'medium-low') { scoreA += 1; scoreB += 1; }
    else if (independence === 'medium-high') { scoreB += 2; scoreC += 1; }
    else if (independence === 'high') { scoreC += 3; }
    
    // Contact preference scoring
    if (contact === 'in-person') { scoreA += 1; }
    else if (contact === 'online') { scoreB += 1; scoreC += 1; }
    
    // Determine result
    const maxScore = Math.max(scoreA, scoreB, scoreC);
    
    // Additional conditions for better routing
    const canBeIndependent = 
      (awareness === 'advanced' || awareness === 'intermediate') &&
      (independence === 'high' || independence === 'medium-high') &&
      (injury === 'none' || injury === 'occasional');
    
    if (scoreA === maxScore) return 'A';
    if (scoreC === maxScore && canBeIndependent) return 'C';
    return 'B';
  }
  
  function showResult(result) {
    // Hide assessment form with smooth transition
    if (assessment) {
      assessment.style.opacity = '0';
      assessment.style.transform = 'translateY(-20px) scale(0.95)';
      assessment.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        assessment.classList.add('hidden');
      }, 500);
    }
    
    // Show result container
    if (assessmentResult) {
      assessmentResult.classList.remove('hidden');
      
      // Hide all result cards
      document.querySelectorAll('.result-card').forEach(card => {
        card.classList.add('hidden');
      });
      
      // Show correct result
      const resultCard = document.getElementById(`result${result}`);
      if (resultCard) {
        resultCard.classList.remove('hidden');
      }
      
      // Smooth scroll to result
      setTimeout(() => {
        assessmentResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
  
  function trackAssessment(result) {
    // Track submit event
    if (typeof trackEvent === 'function') {
      trackEvent('assessment_submit', { answers });
      trackEvent('assessment_result', { result, variant: result });
    }
  }
  
  function resetAssessment() {
    // Reset form
    form.reset();
    answers = {};
    currentQuestion = 1;
    isTransitioning = false;
    
    // Reset UI
    document.querySelectorAll('.assessment__question').forEach((q, i) => {
      q.classList.remove('active', 'exit');
      if (i === 0) {
        q.classList.add('active');
      }
    });
    
    // Reset assessment visibility
    if (assessment) {
      assessment.classList.remove('hidden');
      assessment.style.opacity = '1';
      assessment.style.transform = 'translateY(0) scale(1)';
    }
    
    // Hide result
    if (assessmentResult) {
      assessmentResult.classList.add('hidden');
    }
    
    updateProgress();
    updateNavigation();
    
    // Smooth scroll to top
    setTimeout(() => {
      assessment?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
})();
