document.addEventListener('DOMContentLoaded', () => {
    const studentNameInput = document.getElementById('student-name');
    const enterButton = document.getElementById('enter-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    const nameDisplay = document.getElementById('name-display');
    const particlesContainer = document.getElementById('particles');
    const typewriterElement = document.getElementById('typewriter');
    
    // Typewriter effect
    const typewriterTexts = [
        'Learn AI Tools',
        'Build with Claude',
        'Code with Cursor',
        'Future of Development'
    ];
    
    let currentTextIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeWriter() {
        const currentText = typewriterTexts[currentTextIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
            typingSpeed = 500; // Pause before typing next
        }
        
        setTimeout(typeWriter, typingSpeed);
    }
    
    // Start typewriter effect
    setTimeout(typeWriter, 1000);
    
    // Create particles
    function createParticles() {
        particlesContainer.innerHTML = '';
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = `${Math.random() * 6 + 2}px`;
            particle.style.height = particle.style.width;
            particle.style.borderRadius = '50%';
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random color
            const colors = ['#6e42ff', '#00b8ff', '#ff36b5', '#3bff8a'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = randomColor;
            
            // Random opacity
            particle.style.opacity = `${Math.random() * 0.6 + 0.2}`;
            
            // Add animation
            particle.style.animation = `float ${Math.random() * 6 + 3}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Handle enter button click
    enterButton.addEventListener('click', () => {
        const studentName = studentNameInput.value.trim();
        
        if (studentName) {
            nameDisplay.textContent = studentName;
            welcomeMessage.classList.remove('hidden');
            
            // Wait a bit to add visible class for animation effect
            setTimeout(() => {
                welcomeMessage.classList.add('visible');
            }, 10);
            
            // Create particles
            createParticles();
            
            // Add card tilt effect based on mouse movement
            addTiltEffect();
        }
    });
    
    // Allow pressing Enter key in input
    studentNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            enterButton.click();
        }
    });
    
    // Add 3D tilt effect
    function addTiltEffect() {
        const welcomeCard = document.querySelector('.welcome-card');
        
        document.addEventListener('mousemove', (e) => {
            const xPos = (window.innerWidth / 2 - e.clientX) / 25;
            const yPos = (window.innerHeight / 2 - e.clientY) / 25;
            
            welcomeCard.style.transform = `rotateY(${xPos}deg) rotateX(${yPos}deg)`;
        });
        
        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            welcomeCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }
    
    // Add futuristic cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--accent-color);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        transition: width 0.3s, height 0.3s, border-color 0.3s;
        z-index: 9999;
        mix-blend-mode: difference;
    `;
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background-color: var(--accent-color);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 10000;
    `;
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.width = '15px';
        cursor.style.height = '15px';
        cursor.style.borderColor = 'var(--primary-color)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderColor = 'var(--accent-color)';
    });
    
    // Interactive elements effect
    document.querySelectorAll('button, input, .feature-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.style.width = '30px';
            cursor.style.height = '30px';
            cursor.style.borderColor = 'var(--secondary-color)';
        });
        
        item.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'var(--accent-color)';
        });
    });
    
    // Add animated background stars
    createStars();
    
    function createStars() {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        starsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
        `;
        
        document.body.appendChild(starsContainer);
        
        const starCount = 50;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const size = Math.random() * 2 + 1;
            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3});
                border-radius: 50%;
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                animation: twinkle ${Math.random() * 5 + 3}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            starsContainer.appendChild(star);
        }
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}); 