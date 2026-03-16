// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

// Close menu when clicking nav links
nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Scroll animations
const fadeElements = document.querySelectorAll(
    '.service-card, .stat-card, .process-step, .contact-item, .about-text, .cta-box, .pricing-card, .form-intro, .contact-form'
);

fadeElements.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeElements.forEach(el => observer.observe(el));

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});

// Telegram Bot config
const TELEGRAM_BOT_TOKEN = '8455367631:AAE6-6QolS_lDAHI2Ys1JG3xSbNm4gSWaZs';
const TELEGRAM_CHAT_ID = '-5173541921';

async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    });
    return response.ok;
}

// Contact form handler
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check required fields
        const name = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const services = [...document.querySelectorAll('input[name="service"]:checked')].map(cb => cb.parentElement.textContent.trim());
        const packageEl = document.querySelector('input[name="package"]:checked');
        const packageName = packageEl ? packageEl.parentElement.textContent.trim() : 'Chưa chọn';
        const message = document.getElementById('message').value.trim();

        if (!name || !phone || services.length === 0) {
            return;
        }

        // Disable button while sending
        const submitBtn = contactForm.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi...';

        // Build Telegram message
        const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const telegramMsg = `🔔 <b>KHÁCH HÀNG MỚI - VIRAL STUDIO</b>\n\n` +
            `👤 <b>Họ tên:</b> ${name}\n` +
            `📞 <b>SĐT:</b> ${phone}\n` +
            `${email ? `📧 <b>Email:</b> ${email}\n` : ''}` +
            `🎯 <b>Dịch vụ:</b> ${services.join(', ')}\n` +
            `📦 <b>Gói:</b> ${packageName}\n` +
            `${message ? `💬 <b>Ghi chú:</b> ${message}\n` : ''}` +
            `\n🕐 <i>${now}</i>`;

        try {
            const success = await sendToTelegram(telegramMsg);

            if (success) {
                formSuccess.classList.add('show');
                if (formError) formError.classList.remove('show');
                submitBtn.style.display = 'none';

                setTimeout(() => {
                    contactForm.reset();
                    formSuccess.classList.remove('show');
                    submitBtn.style.display = '';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Gửi yêu cầu tư vấn';
                }, 5000);
            } else {
                throw new Error('Gửi thất bại');
            }
        } catch (err) {
            if (formError) formError.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Gửi yêu cầu tư vấn';

            setTimeout(() => {
                if (formError) formError.classList.remove('show');
            }, 5000);
        }
    });
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
