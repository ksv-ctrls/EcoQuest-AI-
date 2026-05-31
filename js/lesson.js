document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const quizResults = document.getElementById('quiz-results');

    const correctAnswers = {
        q1: 'b',
        q2: 'b',
        q3: 'b',
        q4: 'b',
        q5: 'b',
        q6: 'b',
        q7: 'b',
        q8: 'b',
        q9: 'b',
        q10: 'b'
    };

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let score = 0;
        const formData = new FormData(quizForm);
        const userAnswers = {};

        // Disable the button to prevent multiple submissions
        quizForm.querySelector('.submit-quiz-btn').disabled = true;
        quizForm.querySelector('.submit-quiz-btn').textContent = 'Submitted!';

        for (const [key, value] of formData.entries()) {
            userAnswers[key] = value;
            const questionDiv = quizForm.querySelector(`input[name="${key}"]`).closest('.quiz-question');
            const labels = questionDiv.querySelectorAll('label');
            
            labels.forEach(label => {
                const input = label.querySelector('input');
                if (input.value === correctAnswers[key]) {
                    label.classList.add('correct'); // Highlight correct answer
                }
                if (input.checked && input.value !== correctAnswers[key]) {
                    label.classList.add('incorrect'); // Highlight incorrect user choice
                }
                input.disabled = true; // Disable all options after submission
            });

            if (value === correctAnswers[key]) {
                score++;
            }
        }

        const xpEarned = score * 100;

        // Display results
        const scoreDisplay = document.createElement('div');
        scoreDisplay.innerHTML = `<p>You scored <span class="score">${score} out of 10</span>!</p><p>You've earned ${xpEarned} XP!</p>`;
        
        // Clear previous results and add the new one
        quizResults.innerHTML = '';
        quizResults.appendChild(scoreDisplay);

        // Show the 'Learn by Playing' button
        const learnByPlayingBtn = document.createElement('a');
        learnByPlayingBtn.href = 'game.html';
        learnByPlayingBtn.className = 'learn-by-playing-btn';
        learnByPlayingBtn.textContent = 'Learn by Playing';
        quizResults.appendChild(learnByPlayingBtn);
        
        quizResults.classList.add('show');

        // Store the XP earned to be picked up by the dashboard
        if (xpEarned > 0) {
            localStorage.setItem('xpEarned', xpEarned);
        }
    });
});