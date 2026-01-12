// script.js - Complete JavaScript for Zensora Tech Website

document.addEventListener('DOMContentLoaded', function() {
    // ============================
    // 1. MOBILE MENU TOGGLE
    // ============================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // ============================
    // 2. CONTACT FORM SUBMISSION
    // ============================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Send data to FormBackend
                const response = await fetch('https://www.formbackend.com/f/2090050a3bce2d75', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formValues)
                });
                
                if (response.ok) {
                    // Show success popup
                    showPopup('success', 'Thank you for your message! We have received your inquiry and will respond as soon as possible.');
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                showPopup('error', 'Sorry, there was an error submitting your form. Please try again or contact us directly.');
            } finally {
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // ============================
    // 3. SMOOTH SCROLLING
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's a page link
            if (this.getAttribute('href').includes('.html')) return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================
    // 4. POPUP NOTIFICATION SYSTEM
    // ============================
    function showPopup(type, message) {
        // Remove existing popup if any
        const existingPopup = document.querySelector('.popup-notification');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // Create popup element
        const popup = document.createElement('div');
        popup.className = `popup-notification ${type}`;
        
        // Add icon based on type
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        
        popup.innerHTML = `
            <div class="popup-content">
                <i class="fas ${icon}"></i>
                <p>${message}</p>
                <button class="popup-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(popup);
        
        // Show popup
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
        
        // Auto-close after 5 seconds
        const autoClose = setTimeout(() => {
            closePopup(popup);
        }, 5000);
        
        // Close button event
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoClose);
            closePopup(popup);
        });
        
        // Close on click outside
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                clearTimeout(autoClose);
                closePopup(popup);
            }
        });
    }
    
    function closePopup(popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }
    
    // ============================
    // 5. FAQ ACCORDION FUNCTIONALITY - FIXED VERSION
    // ============================
    function initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        if (faqQuestions.length > 0) {
            faqQuestions.forEach(question => {
                // Remove any existing event listeners first
                const newQuestion = question.cloneNode(true);
                question.parentNode.replaceChild(newQuestion, question);
                
                // Add fresh event listener
                newQuestion.addEventListener('click', () => {
                    const item = newQuestion.parentElement;
                    const icon = newQuestion.querySelector('i');
                    
                    // Close other FAQ items
                    document.querySelectorAll('.faq-item').forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherIcon = otherItem.querySelector('.faq-question i');
                            if (otherIcon) {
                                otherIcon.classList.remove('fa-chevron-up');
                                otherIcon.classList.add('fa-chevron-down');
                            }
                        }
                    });
                    
                    // Toggle active class
                    item.classList.toggle('active');
                    
                    // Toggle icon
                    if (item.classList.contains('active')) {
                        if (icon) {
                            icon.classList.remove('fa-chevron-down');
                            icon.classList.add('fa-chevron-up');
                        }
                    } else {
                        if (icon) {
                            icon.classList.remove('fa-chevron-up');
                            icon.classList.add('fa-chevron-down');
                        }
                    }
                });
            });
        }
    }
    
    // Initialize FAQ - Call it immediately
    initFAQ();
    
    // ============================
    // 6. FORM VALIDATION ENHANCEMENT
    // ============================
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Add validation styling on blur
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                // Remove error on input
                input.addEventListener('input', function() {
                    clearFieldError(this);
                });
            });
            
            // Add submit validation
            form.addEventListener('submit', function(e) {
                if (!validateForm(this)) {
                    e.preventDefault();
                }
            });
        });
    }
    
    function validateField(field) {
        const errorElement = field.parentElement.querySelector('.form-error') || 
                           document.getElementById(field.id + '-error');
        
        if (field.validity.valid) {
            if (errorElement) {
                errorElement.textContent = '';
            }
            field.classList.remove('invalid');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            
            if (errorElement) {
                errorElement.textContent = getErrorMessage(field);
            }
        }
    }
    
    function clearFieldError(field) {
        const errorElement = field.parentElement.querySelector('.form-error') || 
                           document.getElementById(field.id + '-error');
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('invalid');
    }
    
    function getErrorMessage(field) {
        if (field.validity.valueMissing) {
            return 'This field is required.';
        }
        
        if (field.validity.typeMismatch) {
            if (field.type === 'email') {
                return 'Please enter a valid email address.';
            }
            if (field.type === 'tel') {
                return 'Please enter a valid phone number.';
            }
        }
        
        if (field.validity.tooShort) {
            return `Please enter at least ${field.minLength} characters.`;
        }
        
        if (field.validity.patternMismatch) {
            return 'Please enter a valid value.';
        }
        
        return 'Please enter a valid value.';
    }
    
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            validateField(input);
            if (!input.validity.valid) {
                isValid = false;
                
                // Scroll to first error
                if (isValid === false) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    input.focus();
                    isValid = true; // Reset to prevent multiple scrolls
                }
            }
        });
        
        return isValid;
    }
    
    // Initialize form validation
    initFormValidation();
    
    // ============================
    // 7. SCROLL TO TOP BUTTON
    // ============================
    function initScrollToTop() {
        // Create scroll to top button
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollBtn);
        
        // Show/hide button based on scroll position
        function toggleScrollButton() {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        }
        
        // Scroll to top when clicked
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Initial check
        toggleScrollButton();
        
        // Check on scroll
        window.addEventListener('scroll', toggleScrollButton);
    }
    
    // Initialize scroll to top button
    initScrollToTop();
    
    // ============================
    // 8. SERVICE CARDS HOVER EFFECTS
    // ============================
    function initServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card, .domain-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Initialize service card effects
    initServiceCardEffects();
    
    // ============================
    // 9. ANIMATE ELEMENTS ON SCROLL
    // ============================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .domain-card, .team-member, .process-step');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // ============================
    // 10. CURRENT YEAR IN FOOTER
    // ============================
    function updateFooterYear() {
        const yearElements = document.querySelectorAll('.footer-bottom p');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(element => {
            element.innerHTML = element.innerHTML.replace('2023', currentYear);
        });
    }
    
    // Update footer year
    updateFooterYear();
    
    // ============================
    // 11. FORM SUBJECT AUTO-SELECT
    // ============================
    function initFormSubjectAutoSelect() {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        const formParam = urlParams.get('form');
        
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            if (serviceParam) {
                // Map service parameter to option value
                const serviceMap = {
                    'web-development': 'web-dev',
                    'web-dev': 'web-dev',
                    'mobile-development': 'mobile-dev',
                    'mobile-dev': 'mobile-dev',
                    'it-support': 'it-support',
                    'consultancy': 'consultancy',
                    'it-consultancy': 'consultancy'
                };
                
                if (serviceMap[serviceParam]) {
                    subjectSelect.value = serviceMap[serviceParam];
                }
            } else if (formParam === 'internship') {
                subjectSelect.value = 'internship';
            }
        }
    }
    
    // Initialize form subject auto-select
    initFormSubjectAutoSelect();
});

// ============================
// ADDITIONAL GLOBAL FUNCTIONS
// ============================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format phone number
function formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
}

// Validate email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// FAQ Keyboard Accessibility
document.addEventListener('keydown', function(e) {
    // Handle Enter key on FAQ questions
    if (e.key === 'Enter' && e.target.classList.contains('faq-question')) {
        e.target.click();
    }
    
    // Handle Space key on FAQ questions
    if (e.key === ' ' && e.target.classList.contains('faq-question')) {
        e.preventDefault();
        e.target.click();
    }
});