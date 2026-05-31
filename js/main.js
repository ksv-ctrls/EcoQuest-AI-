document.addEventListener('DOMContentLoaded', () => {
    const startAdventureBtn = document.getElementById('start-adventure-btn');
    const headerSignupBtn = document.getElementById('header-signup-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = authModal.querySelector('.close-btn');
    const showLoginLink = document.getElementById('show-login');
    const showSignupLink = document.getElementById('show-signup');
    const formContainer = authModal.querySelector('.form-container');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    // --- Set Dynamic Form Height ---
    const setFormHeight = () => {
        if (formContainer.classList.contains('login-active')) {
            formContainer.style.height = loginForm.scrollHeight + 'px';
        } else {
            formContainer.style.height = signupForm.scrollHeight + 'px';
        }
    };

    // --- Show Modal ---
    const openModal = () => {
        authModal.classList.add('active');
        document.body.classList.add('modal-active');
        // Set initial height after a short delay to ensure correct rendering
        setTimeout(setFormHeight, 50); 
    };

    startAdventureBtn.addEventListener('click', openModal);
    headerSignupBtn.addEventListener('click', openModal);

    // --- Hide Modal ---
    const closeModal = () => {
        authModal.classList.remove('active');
        document.body.classList.remove('modal-active');
    };

    closeModalBtn.addEventListener('click', closeModal);
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // --- Switch between forms ---
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        formContainer.classList.add('login-active');
        setFormHeight();
    });

    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        formContainer.classList.remove('login-active');
        setFormHeight();
    });

    // --- Handle form submission ---
    const forms = authModal.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // On successful login/signup, redirect to the dashboard
            window.location.href = 'dashboard.html';
        });
    });

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.features h2, .feature-cards .card, .process-promise');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
});