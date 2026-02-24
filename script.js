// ===== DARK MODE / LIGHT MODE TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const body = document.body;

// Check if user has saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

function applyTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
        const icon = '<i class="fas fa-sun"></i>';
        if (themeToggle) themeToggle.innerHTML = icon;
        if (themeToggleMobile) themeToggleMobile.innerHTML = icon;
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        const icon = '<i class="fas fa-moon"></i>';
        if (themeToggle) themeToggle.innerHTML = icon;
        if (themeToggleMobile) themeToggleMobile.innerHTML = icon;
        localStorage.setItem('theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// Add event listeners to both toggle buttons
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
}

// ===== SINGLE PAGE WITH SMOOTH SCROLL NAVIGATION =====
function initNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const abItems = document.querySelectorAll('.ab-item');
    const contentSections = document.querySelectorAll('.content-section');
    const editorContent = document.querySelector('.editor-content');

    function updateActiveTab() {
        // Determine which section is currently in view
        let currentSection = 'home';
        
        contentSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = editorContent.scrollTop + rect.top - editorContent.offsetTop;
            const sectionVisibility = sectionTop - editorContent.scrollTop;
            
            // Section is in viewport
            if (sectionVisibility < editorContent.clientHeight / 2) {
                currentSection = section.getAttribute('data-section');
            }
        });

        // Update active states
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        abItems.forEach(item => {
            item.classList.remove('active');
        });
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Set active
        const activeTab = document.querySelector(`.tab[data-tab="${currentSection}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        const activeAbItem = document.querySelector(`.ab-item[data-section="${currentSection}"]`);
        if (activeAbItem) activeAbItem.classList.add('active');
        
        const activeSection = document.querySelector(`.content-section[data-section="${currentSection}"]`);
        if (activeSection) activeSection.classList.add('active');
    }

    function scrollToSection(sectionName) {
        const section = document.querySelector(`.content-section[data-section="${sectionName}"]`);
        if (section) {
            const sectionTop = section.offsetTop - editorContent.offsetTop;
            editorContent.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    // Tab click handler
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionName = tab.getAttribute('data-tab');
            scrollToSection(sectionName);
        });
    });

    // Activity bar click handler
    abItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionName = item.getAttribute('data-section');
            scrollToSection(sectionName);
        });
    });

    // Update active tab on scroll
    editorContent.addEventListener('scroll', updateActiveTab, { passive: true });

    // Initial update
    updateActiveTab();
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}

// ===== SCROLL ANIMATIONS FOR CARDS =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all service cards and sections with stagger effect
document.querySelectorAll('.service-card, .about-point, .stat-item, .portfolio-item, .pricing-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
});

// ===== MOUSE FOLLOW EFFECT ON SERVICE CARDS =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set CSS variables for gradient/glow effect
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });
});

// ===== CONSOLE MESSAGE =====
// ===== CONTACT FORM (MAILTO) =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userName = document.getElementById('user_name').value.trim();
        const userEmail = document.getElementById('user_email').value.trim();
        const projectType = document.getElementById('project_type').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!userName || !userEmail || !projectType || !message) {
            showFormStatus('Please fill in all fields.', 'error');
            return;
        }

        const subject = `Project Inquiry: ${projectType}`;
        const body = [
            'Hello BeresKoding Team,',
            '',
            'I would like to discuss a project with the following details:',
            '',
            `Name: ${userName}`,
            `Email: ${userEmail}`,
            `Project Type: ${projectType}`,
            '',
            'Project Details:',
            message,
            '',
            'Thank you.',
            userName
        ].join('\n');

        const mailtoUrl = `mailto:bereskoding@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
        showFormStatus('Opening your email client...', 'success');
    });
}

function showFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status show ${type}`;
    setTimeout(() => {
        formStatus.classList.remove('show');
    }, 5000);
}
// ===== CHATBOT FUNCTIONALITY =====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotMinimize = document.getElementById('chatbotMinimize');
const chatbotQuickReplies = document.getElementById('chatbotQuickReplies');

let chatbotOpen = false;
let chatbotMinimized = false;

const quickReplies = [
    { label: 'Layanan', message: 'Apa layanan kalian?' },
    { label: 'Harga', message: 'Berapa biayanya?' },
    { label: 'Kontak', message: 'Cara menghubungi?' },
    { label: 'Portfolio', message: 'Bisa lihat portfolio?' },
    { label: 'Proses', message: 'Bagaimana proses kerja?' },
    { label: '/help', message: '/help' }
];

// Chatbot knowledge base
const chatbotResponses = {
    // Indonesian
    services: {
        id: ['layanan', 'jasa', 'service', 'apa yang ditawarkan', 'apa saja yang kalian bisa', 'bisa apa', 'kemampuan', 'jasa apa', 'pembuatan website', 'bikin website'],
        response: `Kami fokus pada pembuatan website front-end dengan:
✅ HTML5, CSS3, JavaScript (vanilla)
✅ Responsive design (mobile-friendly)
✅ Animations & interaksi ringan
✅ Optimasi performa dasar

Catatan: Kami hanya mengerjakan website statis berbasis HTML/CSS/JS (tanpa backend/CMS).`
    },
    pricing: {
        id: ['harga', 'berapa biaya', 'price', 'biaya', 'paket', 'package', 'budget', 'estimasi', 'range harga', 'tarif', 'biayanya'],
        response: `Harga kami sangat kompetitif dan fleksibel! 💰

Untuk informasi detail tentang package dan pricing, silakan hubungi kami:
📧 Email: bereskoding@gmail.com
💬 WhatsApp: Siap kasih konsultasi gratis!`
    },
    technology: {
        id: ['teknologi', 'technology', 'apa teknologi', 'html', 'css', 'javascript', 'bahasa pemrograman', 'stack', 'framework', 'tools'],
        response: `Tech stack kami hanya:

⭐ HTML5
⭐ CSS3
⭐ JavaScript (vanilla)

Kami tidak menggunakan framework atau backend. Fokus kami adalah front-end yang rapi, responsif, dan cepat.`
    },
    contact: {
        id: ['kontak', 'hubungi', 'contact', 'cara menghubungi', 'alamat', 'nomor', 'email', 'whatsapp', 'wa'],
        response: `💬 WhatsApp: +62 882-1056-5665
📧 Email: bereskoding@gmail.com
📍 Location: Jakarta, Indonesia

Tersedia 24/7 untuk menjawab pertanyaan Anda!`
    },
    about: {
        id: ['tentang', 'about', 'siapa', 'company', 'perusahaan', 'tim', 'profil', 'background'],
        response: `Tentang BeresKoding 🎯

Kami adalah tim developer profesional yang passionate tentang web development. Dengan fokus pada:
✅ Clean Code
✅ Modern Technologies
✅ Client Satisfaction
✅ Fast Delivery

Setiap project dikerjakan dengan dedikasi penuh untuk mencapai hasil terbaik!`
    },
    portfolio: {
        id: ['portfolio', 'project', 'karya', 'project apa', 'sudah bikin apa', 'referensi', 'contoh', 'sample'],
        response: `Portfolio kami mencakup berbagai project:
🌐 Website Development
🛍️ E-commerce Solutions
📄 Landing Pages yang Converting
🎨 UI/UX Design
⚡ Performance Optimization

Ingin melihat portfolio lengkap? Hubungi kami untuk detail lebih lanjut!`
    },
    process: {
        id: ['proses', 'bagaimana cara kerja', 'alur', 'timeline', 'process', 'berapa lama', 'durasi', 'lama pengerjaan'],
        response: `Proses Kerja Kami 📋

1️⃣ Konsultasi - Pahami kebutuhan Anda
2️⃣ Planning - Buat strategi dan timeline
3️⃣ Development - Koding berkualitas tinggi
4️⃣ Testing - QA dan bug fixing
5️⃣ Delivery - Handover dan support

Timeline tergantung kompleksitas, tapi kami selalu on-time!`
    },
    hello: {
        id: ['halo', 'hi', 'hello', 'pagi', 'siang', 'malam', 'hai', 'hei'],
        response: 'Halo! 👋 Senang bertemu Anda. Ada yang bisa saya bantu? 😊'
    },
    thanks: {
        id: ['terima kasih', 'makasih', 'thanks', 'thx', 'makasih ya'],
        response: 'Sama-sama! 🙌 Jika ada pertanyaan lain, saya siap membantu.'
    },
    help: {
        id: ['bantuan', 'help', 'apa yang bisa kamu jawab', 'topik apa', 'cara pakai', 'bisa tanya apa', 'kamu bisa apa'],
        response: `Saya bisa membantu dengan pertanyaan tentang:
✅ Layanan HTML/CSS/JS
✅ Harga & Paket
✅ Cara Kontak
✅ Portfolio
✅ Proses Kerja
✅ Revisi & Support
✅ Estimasi Waktu

Coba tanya: "Apa layanan kalian?" atau "Berapa biayanya?"`
    },
    revisions: {
        id: ['revisi', 'perubahan', 'revision', 'ubah desain', 'ubah fitur', 'update'],
        response: `Tentu! Revisi bisa dilakukan sesuai kesepakatan scope.
Biasanya kami sediakan beberapa kali revisi minor agar hasil sesuai ekspektasi.`
    },
    seo: {
        id: ['seo', 'optimasi', 'google', 'search engine', 'ranking'],
        response: `Kami menerapkan best practices SEO on-page untuk website statis: struktur HTML rapi, performance optimal, dan meta yang sesuai.`
    },
    landing_page: {
        id: ['landing page', 'landing', 'promo page', 'page promo'],
        response: `Ya, kami bisa membuat landing page yang fokus pada konversi.
Mulai dari copy, layout, sampai tracking dasar.`
    },
    requirements: {
        id: ['butuh apa', 'requirements', 'kebutuhan awal', 'data apa', 'bahan apa', 'brief'],
        response: `Untuk mulai, biasanya kami butuh:
1) Tujuan website
2) Contoh referensi
3) Konten (logo, teks, gambar)
4) Deadline & budget
Tenang, kami bantu rapikan jika belum lengkap.`
    },
    // English
    services_en: {
        en: ['service', 'services', 'what do you offer', 'what can you do', 'capabilities', 'build a website'],
        response: `We focus on front-end website development with:
✅ HTML5, CSS3, JavaScript (vanilla)
✅ Responsive design
✅ Light animations & interactions
✅ Basic performance optimization

Note: We build static websites only (no backend/CMS).`
    },
    pricing_en: {
        en: ['price', 'pricing', 'cost', 'how much', 'package', 'budget', 'estimate'],
        response: `Our pricing is competitive and flexible! 💰

For detailed package & pricing information, please contact us:
📧 Email: bereskoding@gmail.com
💬 WhatsApp: Available for free consultation!`
    },
    technology_en: {
        en: ['technology', 'tech stack', 'html', 'css', 'javascript', 'programming language', 'framework', 'tools'],
        response: `Our stack is strictly:

⭐ HTML5
⭐ CSS3
⭐ JavaScript (vanilla)

No frameworks or backend. We focus on clean, responsive front-end.`
    },
    contact_en: {
        en: ['contact', 'how to reach', 'address', 'phone number', 'telephone', 'whatsapp', 'wa'],
        response: `💬 WhatsApp: +62 882-1056-5665
📧 Email: bereskoding@gmail.com
📍 Location: Jakarta, Indonesia

Available 24/7 to answer your questions!`
    },
    hello_en: {
        en: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        response: 'Hello! 👋 Nice to meet you. How can I help? 😊'
    },
    thanks_en: {
        en: ['thanks', 'thank you', 'appreciate it', 'thx'],
        response: 'You are welcome! 🙌 Feel free to ask anything else.'
    },
    revisions_en: {
        en: ['revisions', 'changes', 'update design', 'change feature', 'revision'],
        response: `Sure! Revisions are available based on the agreed scope.
We usually include a few minor revisions to match your expectations.`
    },
    seo_en: {
        en: ['seo', 'optimize', 'google', 'search engine', 'ranking'],
        response: `We apply on-page SEO basics for static sites: clean HTML structure, performance optimization, and proper metadata.`
    },
    landing_page_en: {
        en: ['landing page', 'promo page'],
        response: `Yes, we can create high-converting landing pages.
From copy to layout and basic tracking.`
    },
    requirements_en: {
        en: ['requirements', 'what do you need', 'what should i prepare', 'brief'],
        response: `To get started, we usually need:
1) Website goals
2) References
3) Content (logo, text, images)
4) Deadline & budget
No worries if not ready yet, we can help refine it.`
    }
};

function detectLanguage(text) {
    const enWords = ['what', 'how', 'can', 'you', 'hello', 'hi', 'help', 'service', 'technology', 'contact', 'price', 'about', 'please'];
    const words = text.toLowerCase().split(' ');
    const enCount = words.filter(w => enWords.includes(w)).length;
    return enCount > 0 ? 'en' : 'id';
}

function getChatbotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    const language = detectLanguage(message);

    // Search through all responses
    for (const key in chatbotResponses) {
        const respObj = chatbotResponses[key];
        const keywords = language === 'en' ? (respObj.en || []) : (respObj.id || []);
        
        for (const keyword of keywords) {
            if (message.includes(keyword)) {
                return respObj.response;
            }
        }
    }

    // Default response - direct to WhatsApp
    if (language === 'en') {
        return `I don't quite understand that. 😅 Please chat with us on WhatsApp for a faster response! 📱\n\n<a href="https://wa.me/6288210565665" target="_blank" style="color: #238636; text-decoration: underline;">💬 Chat on WhatsApp</a>`;
    } else {
        return `Maaf, saya belum ngerti pertanyaannya. 😅 Yuk hubungi kami lewat WhatsApp untuk respons yang lebih cepat! 📱\n\n<a href="https://wa.me/6288210565665" target="_blank" style="color: #238636; text-decoration: underline;">💬 Chat di WhatsApp</a>`;
    }
}

function addMessage(text, sender) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${sender}-message`;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    // Replace newlines with <br> tags for proper display
    const formattedText = text.replace(/\n/g, '<br>');
    contentEl.innerHTML = `<p>${formattedText}</p>`;
    
    messageEl.appendChild(contentEl);
    chatbotMessages.appendChild(messageEl);
    
    // Auto scroll to bottom
    setTimeout(() => {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 0);
}

function sendMessage() {
    const message = chatbotInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';
    
    // Simulate bot typing
    setTimeout(() => {
        const isHelpCommand = message.toLowerCase() === '/help';
        const response = isHelpCommand ? chatbotResponses.help.response : getChatbotResponse(message);
        addMessage(response, 'bot');
    }, 400);
}

function renderQuickReplies() {
    if (!chatbotQuickReplies) return;
    chatbotQuickReplies.innerHTML = '';

    quickReplies.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chatbot-chip';
        button.textContent = item.label;
        button.addEventListener('click', () => {
            chatbotInput.value = item.message;
            sendMessage();
        });
        chatbotQuickReplies.appendChild(button);
    });
}

// Chatbot toggle
chatbotToggle.addEventListener('click', () => {
    chatbotOpen = !chatbotOpen;
    if (chatbotOpen) {
        chatbotContainer.classList.remove('hidden');
        chatbotToggle.classList.add('hidden');
        chatbotInput.focus();
    } else {
        chatbotContainer.classList.add('hidden');
        chatbotToggle.classList.remove('hidden');
    }
});

// Chatbot minimize
chatbotMinimize.addEventListener('click', () => {
    chatbotOpen = false;
    chatbotContainer.classList.add('hidden');
    chatbotToggle.classList.remove('hidden');
});

// Send message on button click
chatbotSend.addEventListener('click', sendMessage);

// Send message on Enter key
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
// Ensure chatbot-toggle stays at the bottom on mobile, even when keyboard is open
function fixChatbotTogglePosition() {
    if (window.innerWidth <= 768) {
        chatbotToggle.style.position = 'fixed';
        chatbotToggle.style.bottom = '16px';
        chatbotToggle.style.right = '16px';
        chatbotToggle.style.left = 'auto';
        chatbotToggle.style.zIndex = '9999';
    } else {
        chatbotToggle.style.position = '';
        chatbotToggle.style.bottom = '';
        chatbotToggle.style.right = '';
        chatbotToggle.style.left = '';
        chatbotToggle.style.zIndex = '';
    }
}
window.addEventListener('resize', fixChatbotTogglePosition);
window.addEventListener('orientationchange', fixChatbotTogglePosition);
fixChatbotTogglePosition();

renderQuickReplies();
