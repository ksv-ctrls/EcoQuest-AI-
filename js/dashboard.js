document.addEventListener('DOMContentLoaded', () => {
    const xpProgress = document.querySelector('.xp-progress');
    const xpLabel = document.querySelector('.xp-label span:last-child');
    
    // --- Initial XP values (can be replaced with real data later) ---
    let currentXp = 0;
    const maxXp = 2000;

    // --- Check for XP earned from the lesson ---
    const lessonXpEarned = localStorage.getItem('xpEarned');
    if (lessonXpEarned) {
        currentXp += parseInt(lessonXpEarned, 10);
        localStorage.removeItem('xpEarned');
    }

    // --- Check for XP earned from the game ---
    const gameXpEarned = localStorage.getItem('gameXpEarned');
    if (gameXpEarned) {
        currentXp += parseInt(gameXpEarned, 10);
        localStorage.removeItem('gameXpEarned');
    }

    // --- Update the UI with the current XP ---
    const updateXpDisplay = () => {
        // Update the text label
        xpLabel.textContent = `${currentXp.toLocaleString()} / ${maxXp.toLocaleString()}`;
        
        // Update the progress bar width
        const progressPercentage = (currentXp / maxXp) * 100;
        xpProgress.style.width = `${progressPercentage}%`;
    };

    // --- Animate the XP bar on page load ---
    if (xpProgress) {
        const initialWidth = xpProgress.style.width;
        xpProgress.style.width = '0%';
        
        setTimeout(() => {
            updateXpDisplay();
        }, 300); // Small delay to ensure the transition is visible
    } else {
        updateXpDisplay();
    }
});