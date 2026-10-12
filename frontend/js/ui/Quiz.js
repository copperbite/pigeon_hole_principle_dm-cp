// ============================================================================
// UI Component: Quiz (3 Multiple-Choice Questions with Instant Explanations)
// ============================================================================

export class Quiz {
  constructor(container, questions = []) {
    this.container = container;
    this.questions = questions;
    this.currentQuestion = 0;
    this.score = 0;
    this.answersGiven = {};
    this.render();
  }

  render() {
    if (!this.questions.length) return;
    const q = this.questions[this.currentQuestion];

    this.container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <strong style="color:var(--primary-600)">Test Your Understanding</strong>
          <span style="font-size:0.8125rem; color:var(--text-muted)">
            Question ${this.currentQuestion + 1} of ${this.questions.length}
          </span>
        </div>

        <div class="quiz-question-box">
          <p class="quiz-question-title">${q.question}</p>
          <div class="quiz-options">
            ${q.options.map((opt, idx) => `
              <button class="quiz-option" data-index="${idx}">${opt}</button>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="quizFeedback"></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:var(--space-4)">
          <button class="btn btn-outline" id="hintBtn" style="font-size:0.8125rem">💡 Hint</button>
          <button class="btn btn-primary" id="nextQuizBtn" style="display:none; font-size:0.8125rem">Next Question →</button>
        </div>
      </div>
    `;

    const optionBtns = this.container.querySelectorAll('.quiz-option');
    const feedback = this.container.querySelector('#quizFeedback');
    const nextBtn = this.container.querySelector('#nextQuizBtn');
    const hintBtn = this.container.querySelector('#hintBtn');

    hintBtn.addEventListener('click', () => {
      alert(`Hint: ${q.hint || 'Think about the worst-case distribution across the boxes.'}`);
    });

    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selected = parseInt(e.currentTarget.dataset.index, 10);
        const isCorrect = selected === q.answer;

        optionBtns.forEach((b, idx) => {
          b.disabled = true;
          if (idx === q.answer) b.classList.add('correct');
          else if (idx === selected) b.classList.add('wrong');
        });

        feedback.className = `quiz-feedback show ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.innerHTML = `
          <strong>${isCorrect ? '✓ Correct!' : '✗ Not quite.'}</strong>
          <p style="margin-top:4px">${q.explanation}</p>
        `;

        if (isCorrect && !this.answersGiven[this.currentQuestion]) {
          this.score++;
        }
        this.answersGiven[this.currentQuestion] = true;

        if (this.currentQuestion < this.questions.length - 1) {
          nextBtn.style.display = 'inline-flex';
        } else {
          nextBtn.textContent = 'Finish Quiz';
          nextBtn.style.display = 'inline-flex';
        }
      });
    });

    nextBtn.addEventListener('click', () => {
      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        this.render();
      } else {
        this.renderResults();
      }
    });
  }

  renderResults() {
    this.container.innerHTML = `
      <div class="quiz-container" style="text-align:center; padding:var(--space-8)">
        <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:var(--space-2)">Quiz Completed! 🎉</h3>
        <p style="font-size:1rem; color:var(--text-muted); margin-bottom:var(--space-4)">
          You scored <b>${this.score}</b> out of <b>${this.questions.length}</b>.
        </p>
        <button class="btn btn-primary" id="retryQuizBtn">Retry Quiz</button>
      </div>
    `;

    this.container.querySelector('#retryQuizBtn').addEventListener('click', () => {
      this.currentQuestion = 0;
      this.score = 0;
      this.answersGiven = {};
      this.render();
    });
  }
}
