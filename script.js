// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 8, 4, 0.95)';
        nav.style.padding = '0.8rem 2.5rem';
    } else {
        nav.style.background = 'rgba(10, 8, 4, 0.65)';
        nav.style.padding = '1rem 2.5rem';
    }
});

// Form Submission Handling
const biryaniForm = document.getElementById('biryaniForm');
if(biryaniForm) {
    biryaniForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple visual feedback
        const btn = biryaniForm.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = "Sending Inquiry...";
        btn.style.opacity = "0.7";
        btn.disabled = true;

        setTimeout(() => {
            alert("Thank you! Your royal feast inquiry has been sent. We will contact you shortly.");
            btn.innerText = originalText;
            btn.style.opacity = "1";
            btn.disabled = false;
            biryaniForm.reset();
        }, 1500);
    });
}

// Smooth Reveal Animation on Scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card, .section-title').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
    observer.observe(el);
});
