// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.feature-card, .stat-item');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Add floating animation to hero cards
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach((card, index) => {
    // Add random delay and duration for more natural movement
    const delay = index * 2;
    const duration = 6 + (index * 0.5);
    
    card.style.animationDelay = `${delay}s`;
    card.style.animationDuration = `${duration}s`;
  });
});

// Stats counter animation
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target.toLocaleString() + (element.textContent.includes('+') ? '+' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start).toLocaleString() + (element.textContent.includes('+') ? '+' : '');
    }
  }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      
      statNumbers.forEach(statNumber => {
        const text = statNumber.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        
        if (number) {
          statNumber.textContent = '0';
          setTimeout(() => {
            animateCounter(statNumber, number);
          }, 200);
        }
      });
      
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const heroSection = document.querySelector('.hero-section');
  
  if (heroSection) {
    const rate = scrolled * -0.5;
    heroSection.style.transform = `translateY(${rate}px)`;
  }
});

