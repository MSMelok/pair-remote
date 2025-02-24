document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const guideContainer = document.getElementById('guideContainer');
    const startButton = document.getElementById('startGuide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navigation = document.getElementById('navigation');
    const progress = document.getElementById('progress');
    const slides = document.querySelectorAll('.slide');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    let currentSlide = 1;
    const totalSlides = slides.length;
    let isAnimating = false;

    // Theme handling
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
            setTheme(newTheme);
        }, 150);
    });

    // Initialize guide
    function initializeGuide() {
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            guideContainer.style.display = 'block';
            navigation.classList.add('visible');
            updateSlide(1);
        }, 300);
    }

    // Update progress bar
    function updateProgress(slideNumber) {
        const progressWidth = ((slideNumber - 1) / (totalSlides - 1)) * 100;
        progress.style.width = `${progressWidth}%`;
    }

    // Slide navigation with animation lock
    function updateSlide(slideNumber) {
        if (isAnimating) return;
        isAnimating = true;

        const currentSlideElement = slides[currentSlide - 1];
        const nextSlideElement = slides[slideNumber - 1];
        const direction = slideNumber > currentSlide ? 1 : -1;

        // Remove active class from current slide
        currentSlideElement.classList.remove('active');
        currentSlideElement.style.transform = `translateY(${-direction * 20}px)`;
        currentSlideElement.style.opacity = '0';

        // Show and animate next slide
        nextSlideElement.style.display = 'block';
        nextSlideElement.style.transform = `translateY(${direction * 20}px)`;
        nextSlideElement.style.opacity = '0';

        setTimeout(() => {
            nextSlideElement.classList.add('active');
            nextSlideElement.style.transform = 'translateY(0)';
            nextSlideElement.style.opacity = '1';

            currentSlide = slideNumber;

            // Update progress and navigation
            updateProgress(currentSlide);
            prevBtn.disabled = currentSlide === 1;
            nextBtn.innerHTML = currentSlide === totalSlides ? 
                'Finish <i class="fas fa-check"></i>' : 
                'Next <i class="fas fa-arrow-right"></i>';

            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }, 50);
    }

    // Event Listeners
    startButton.addEventListener('click', () => {
        startButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            startButton.style.transform = 'scale(1)';
            initializeGuide();
        }, 150);
    });

    prevBtn.addEventListener('click', () => {
        if (!prevBtn.disabled && !isAnimating) {
            prevBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                prevBtn.style.transform = 'scale(1)';
                updateSlide(currentSlide - 1);
            }, 150);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;

        nextBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            nextBtn.style.transform = 'scale(1)';
            if (currentSlide < totalSlides) {
                updateSlide(currentSlide + 1);
            } else {
                guideContainer.style.opacity = '0';
                navigation.classList.remove('visible');
                setTimeout(() => {
                    currentSlide = 1;
                    guideContainer.style.display = 'none';
                    welcomeScreen.style.display = 'flex';
                    welcomeScreen.style.opacity = '1';
                    welcomeScreen.style.transform = 'translateY(0)';
                }, 300);
            }
        }, 150);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (guideContainer.style.display === 'block') {
            if (e.key === 'ArrowRight' && currentSlide < totalSlides) {
                nextBtn.click();
            } else if (e.key === 'ArrowLeft' && currentSlide > 1) {
                prevBtn.click();
            }
        }
    });

    // Prevent scroll navigation
    window.addEventListener('wheel', (e) => {
        if (guideContainer.style.display === 'block') {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent touch navigation
    document.addEventListener('touchmove', (e) => {
        if (guideContainer.style.display === 'block') {
            e.preventDefault();
        }
    }, { passive: false });
});