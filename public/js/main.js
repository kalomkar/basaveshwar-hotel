// 2026 Premium JS Logic - Basaveshwar Hotel

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initTypingEffect();
    initScrollTop();
    updateCartCounter();
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    const progress = document.querySelector('.scroll-progress');

    // Scrolled State
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Scroll Progress
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progress) progress.style.width = scrolled + "%";

    // Active Section Tracking
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === `#${section.id}`) {
                    a.classList.add('active');
                }
            });
        }
    });
});

// Scroll Reveal Implementation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .stagger-reveal, .reveal-left, .reveal-up, .reveal-zoom');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0 });

    revealElements.forEach(el => observer.observe(el));
}

// Typing Effect for Hero
function initTypingEffect() {
    const typingEl = document.querySelector('.typing-text');
    if (!typingEl) return;

    const phrases = ["Authentic South Indian Breakfast", "Taste of Tradition", "Best Idli Vada in Town"];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIdx];

        if (isDeleting) {
            typingEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 50;
        } else {
            typingEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Scroll to Top Button
function initScrollTop() {
    const btn = document.createElement('div');
    btn.id = 'scroll-top';
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) btn.classList.add('visible');
        else btn.classList.remove('visible');
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Enhanced Cart Functionality
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('basaveshwar_cart')) || [];

    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('basaveshwar_cart', JSON.stringify(cart));
    updateCartCounter();
    renderSideCart();
    openCart();

    // Premium Feedback
    showToast(`${item.name} added to cart!`);
}

function openCart() {
    document.querySelector('.cart-panel')?.classList.add('active');
    document.querySelector('.cart-overlay')?.classList.add('active');
}

function closeCart() {
    document.querySelector('.cart-panel')?.classList.remove('active');
    document.querySelector('.cart-overlay')?.classList.remove('active');
}

function renderSideCart() {
    const cart = JSON.parse(localStorage.getItem('basaveshwar_cart')) || [];
    const container = document.getElementById('side-cart-items');
    const totalEl = document.getElementById('side-cart-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 2rem; opacity:0.6;">Your cart is empty</div>';
        totalEl.innerHTML = '₹0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid #eee; padding-bottom:1rem;">
                <div>
                    <h4 style="margin:0;">${item.name}</h4>
                    <p style="margin:0; font-size:0.9rem; color:#666;">₹${item.price} x ${item.quantity}</p>
                </div>
                <div style="font-weight:bold; color:var(--primary);">₹${item.price * item.quantity}</div>
            </div>
        `;
    }).join('');
    totalEl.innerHTML = `₹${total}`;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast animate-fade-in';
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('basaveshwar_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counterEl = document.getElementById('cart-counter');
    if (counterEl) {
        counterEl.innerHTML = `<i class="fa-solid fa-shopping-basket"></i> ${totalItems}`;
        counterEl.classList.add('bounce');
        setTimeout(() => counterEl.classList.remove('bounce'), 500);
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });

            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Success Feedback (Confetti)
function triggerSuccessFeedback() {
    const colors = ['#E65100', '#FFB300', '#FFF8E1', '#FF8A65'];
    for (let i = 0; i < 60; i++) {
        const confetto = document.createElement('div');
        confetto.className = 'confetto';
        confetto.style.left = Math.random() * 100 + 'vw';
        confetto.style.width = Math.random() * 8 + 4 + 'px';
        confetto.style.height = Math.random() * 8 + 4 + 'px';
        confetto.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetto.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetto.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
        confetto.style.animationDelay = Math.random() * 3 + 's';
        document.body.appendChild(confetto);
        setTimeout(() => confetto.remove(), 5000);
    }
}
// Contact Form Submission
document.getElementById('contactForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try {
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Ripples & Button Interactions
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn-premium, .cart-btn, .lang-btn');
            if (!target) return;

            const rect = target.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.position = 'absolute';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            target.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });


        if (response.ok) {
            showToast('Message sent! We will contact you soon.');
            this.reset();
        } else {
            showToast('Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('System error. Please try again later.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});
