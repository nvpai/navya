// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.init();
    }

    init() {
        // Set initial theme based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = this.getSavedTheme();
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (prefersDark) {
            this.setTheme('dark');
        }

        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.saveTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    saveTheme(theme) {
        // Store theme preference in memory (since localStorage is not available)
        window.portfolioTheme = theme;
    }

    getSavedTheme() {
        return window.portfolioTheme || null;
    }
}

// Navigation and Scrolling
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.scrollProgress = document.querySelector('.scroll-progress');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollProgress();
        this.setupNavbarBackground();
        this.setupMobileMenu();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    // FIXED: Updated offset to account for proper navbar height
                    const offsetTop = target.offsetTop - 80; // Using fixed navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollProgress() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            this.scrollProgress.style.width = scrollPercent + '%';
        });
    }

    setupNavbarBackground() {
        window.addEventListener('scroll', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (window.scrollY > 100) {
                this.navbar.style.background = currentTheme === 'dark' 
                    ? 'rgba(17, 24, 39, 0.98)' 
                    : 'rgba(255, 255, 255, 0.98)';
            } else {
                this.navbar.style.background = currentTheme === 'dark' 
                    ? 'rgba(17, 24, 39, 0.95)' 
                    : 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    setupMobileMenu() {
        this.mobileMenuBtn.addEventListener('click', () => {
            this.navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navLinks.classList.remove('active');
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.navLinks.classList.remove('active');
            }
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupHeroAnimations();
        // FIXED: Disabled parallax effect to prevent overlap issues
        // this.setupParallax();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate skill cards
                    if (entry.target.classList.contains('skills-grid')) {
                        this.animateSkillCards();
                    }
                }
            });
        }, this.observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    animateSkillCards() {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 200);
        });
    }

    setupHeroAnimations() {
        // Typing animation for hero title
        setTimeout(() => {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.opacity = '1';
                this.typeWriter(heroTitle, 'Navya Pai', 150);
            }
        }, 1000);
    }

    typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        type();
    }

    /* FIXED: Disabled parallax effect that was causing overlap issues
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero && scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
    */
}

// Contact Form Manager
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        // Store form data in memory
        this.storeFormSubmission(formData);
        
        // Show success message
        this.showSuccessMessage();
        
        // Reset form
        this.form.reset();
    }

    storeFormSubmission(formData) {
        // In a real implementation, this would be sent to a server
        if (!window.formSubmissions) {
            window.formSubmissions = [];
        }
        window.formSubmissions.push(formData);
        console.log('Form submitted:', formData);
    }

    showSuccessMessage() {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 100px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 1002;
                animation: slideInRight 0.5s ease;
            ">
                <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                Message sent successfully! I'll get back to you soon.
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Skills Interaction Manager
class SkillsManager {
    constructor() {
        this.skillCards = document.querySelectorAll('.skill-card');
        this.init();
    }

    init() {
        this.setupSkillCardAnimations();
        this.setupSkillTagInteractions();
    }

    setupSkillCardAnimations() {
        // Initial state for skill cards
        this.skillCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        });
    }

    setupSkillTagInteractions() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.highlightSkill(tag);
            });
        });
    }

    highlightSkill(tag) {
        // Remove previous highlights
        document.querySelectorAll('.skill-tag.highlighted').forEach(t => {
            t.classList.remove('highlighted');
        });
        
        // Add highlight to clicked tag
        tag.classList.add('highlighted');
        
        // Add CSS for highlighted state
        if (!document.querySelector('#skill-highlight-style')) {
            const style = document.createElement('style');
            style.id = 'skill-highlight-style';
            style.innerHTML = `
                .skill-tag.highlighted {
                    background: var(--primary-color) !important;
                    color: white !important;
                    transform: scale(1.05) !important;
                    box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Project Card Manager
class ProjectManager {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.setupProjectCardAnimations();
        this.setupProjectLinkHandlers();
    }

    setupProjectCardAnimations() {
        this.projectCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.animateProjectCard(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateProjectCard(card, 'leave');
            });
        });
    }

    animateProjectCard(card, action) {
        const header = card.querySelector('.project-header');
        const content = card.querySelector('.project-content');
        
        if (action === 'enter') {
            header.style.transform = 'scale(1.02)';
            content.style.transform = 'translateY(-5px)';
        } else {
            header.style.transform = 'scale(1)';
            content.style.transform = 'translateY(0)';
        }
    }

    setupProjectLinkHandlers() {
        const projectLinks = document.querySelectorAll('.project-link');
        
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleProjectLink(link);
            });
        });
    }

    handleProjectLink(link) {
        const linkText = link.textContent.trim();
        const projectTitle = link.closest('.project-card').querySelector('.project-title').textContent;
        
        // In a real implementation, these would link to actual projects
        const message = `${linkText} for "${projectTitle}" - This would link to the actual project/repository`;
        
        this.showProjectLinkNotification(message);
    }

    showProjectLinkNotification(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 1002;
                max-width: 300px;
                animation: slideInRight 0.5s ease;
            ">
                <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Performance Manager
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupScrollOptimization();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupImageOptimization() {
        // Placeholder for image optimization logic
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        });
    }

    setupScrollOptimization() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            // Throttle scroll events for better performance
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll-based animations would go here
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', updateScrollEffects, { passive: true });
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Resume Download Manager
class ResumeManager {
    constructor() {
        this.init();
    }

    init() {
        this.createFloatingResumeButton();
    }

    createFloatingResumeButton() {
        const resumeBtn = document.createElement('div');
        resumeBtn.innerHTML = `
            <button id="resume-btn" style="
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: var(--primary-color);
                color: white;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
            " title="Download Resume">
                <i class="fas fa-download"></i>
            </button>
        `;
        
        document.body.appendChild(resumeBtn);
        
        const button = document.getElementById('resume-btn');
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.background = 'var(--secondary-color)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.background = 'var(--primary-color)';
        });
        
        button.addEventListener('click', () => {
            this.downloadResume();
        });
    }

    downloadResume() {
        // In a real implementation, replace this URL with your actual resume PDF link
        const resumeUrl = 'https://drive.google.com/file/d/1qBFfNkCAHCckoa8q3F79VRRcESCuDetN/view?usp=sharing'; // Replace with your actual resume link
        
        // For demonstration, we'll show a notification
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 1002;
                animation: slideInRight 0.5s ease;
            ">
                <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>
                Floating resume download - Replace URL in script.js with your actual resume link
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
        
        // Uncomment the line below when you have a real resume URL
         window.open(resumeUrl, '_blank', 'noopener,noreferrer');
        
        console.log('Floating resume download requested');
    }
}

// Add required CSS animations
const addAnimations = () => {
    if (!document.querySelector('#dynamic-animations')) {
        const style = document.createElement('style');
        style.id = 'dynamic-animations';
        style.innerHTML = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% {
                    transform: translate3d(0,0,0);
                }
                40%, 43% {
                    transform: translate3d(0,-30px,0);
                }
                70% {
                    transform: translate3d(0,-15px,0);
                }
                90% {
                    transform: translate3d(0,-4px,0);
                }
            }
            
            .bounce {
                animation: bounce 1s ease infinite;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translate3d(0,40px,0);
                }
                to {
                    opacity: 1;
                    transform: translate3d(0,0,0);
                }
            }
            
            .fadeInUp {
                animation: fadeInUp 0.6s ease forwards;
            }
        `;
        document.head.appendChild(style);
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add animations CSS
    addAnimations();
    
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const animationManager = new AnimationManager();
    const contactFormManager = new ContactFormManager();
    const skillsManager = new SkillsManager();
    const projectManager = new ProjectManager();
    const performanceManager = new PerformanceManager();
    const resumeManager = new ResumeManager();
    
    // Store managers globally for debugging
    window.portfolioManagers = {
        theme: themeManager,
        navigation: navigationManager,
        animation: animationManager,
        contact: contactFormManager,
        skills: skillsManager,
        projects: projectManager,
        performance: performanceManager,
        resume: resumeManager
    };
    
    console.log('Portfolio initialized successfully - Overlap issue fixed');
});

// Handle window resize
window.addEventListener('resize', Utils.debounce(() => {
    // Recalculate layouts if needed
    console.log('Window resized');
}, 250));

// Handle visibility change (for performance optimization)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        console.log('Tab hidden - pausing animations');
    } else {
        // Resume animations when tab becomes visible
        console.log('Tab visible - resuming animations');
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
});

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a production environment
        console.log('Service Worker support detected');
    });
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        AnimationManager,
        ContactFormManager,
        SkillsManager,
        ProjectManager,
        PerformanceManager,
        ResumeManager,
        Utils
    };
}