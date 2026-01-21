/**
 * Stevie Athletics — Internationalization (i18n)
 * Language switcher functionality and translation structure
 */

// Available languages
const LANGUAGES = {
    pl: {
        code: 'pl',
        name: 'Polski',
        flag: '🇵🇱',
        url: '/'
    },
    en: {
        code: 'en',
        name: 'English',
        flag: '🇬🇧',
        url: '/en/'
    },
    es: {
        code: 'es',
        name: 'Español',
        flag: '🇪🇸',
        url: '/es/'
    }
};

// Translation keys structure (to be filled later)
const TRANSLATIONS = {
    pl: {
        nav: {
            oferta: 'Oferta',
            assessment: 'Assessment',
            caseStudies: 'Case Studies',
            about: 'O mnie',
            faq: 'FAQ',
            contact: 'Kontakt',
            cta: 'Umów konsultację'
        },
        hero: {
            headline1: 'Chcesz trenować jak sportowiec',
            headline2: 'i poprawić wyniki bez kontuzji?',
            subheadline: 'Indywidualna analiza, plan treningowy i konsultacja 1:1 — online lub stacjonarnie w Szczecinie',
            cta: 'Umów bezpłatną konsultację',
            stats: {
                athletes: 'sportowców poprawiło wyniki',
                years: 'lat doświadczenia',
                approach: 'indywidualne podejście'
            }
        },
        services: {
            title: 'Formy współpracy',
            subtitle: 'Wybierz formę dopasowaną do Twoich potrzeb',
            online: {
                title: 'Online',
                desc: 'Indywidualny plan, feedback, stały kontakt'
            },
            hybrid: {
                title: 'Hybryda',
                desc: 'Plan online + sesje stacjonarne + testy'
            },
            studio: {
                title: 'Stacjonarnie',
                desc: 'Trening 1:1 w studio z pełnym nadzorem'
            }
        },
        footer: {
            tagline: 'Przygotowanie motoryczne dla sportowców i aktywnych ludzi.',
            navigation: 'Nawigacja',
            services: 'Usługi',
            contact: 'Kontakt',
            copyright: '© 2026 Stevie Athletics. Wszystkie prawa zastrzeżone.',
            privacy: 'Polityka prywatności',
            cookies: 'Cookies'
        }
    },
    en: {
        nav: {
            oferta: 'Services',
            assessment: 'Assessment',
            caseStudies: 'Case Studies',
            about: 'About',
            faq: 'FAQ',
            contact: 'Contact',
            cta: 'Book Consultation'
        },
        hero: {
            headline1: 'Train like an athlete',
            headline2: 'and improve results without injury?',
            subheadline: 'Individual analysis, training plan and 1:1 consultation — online or in-person in Szczecin',
            cta: 'Book Free Consultation',
            stats: {
                athletes: 'athletes improved results',
                years: 'years of experience',
                approach: 'individual approach'
            }
        },
        // ... more translations
    },
    es: {
        nav: {
            oferta: 'Servicios',
            assessment: 'Evaluación',
            caseStudies: 'Casos de Éxito',
            about: 'Sobre mí',
            faq: 'FAQ',
            contact: 'Contacto',
            cta: 'Reservar Consulta'
        },
        hero: {
            headline1: '¿Quieres entrenar como un atleta',
            headline2: 'y mejorar resultados sin lesiones?',
            subheadline: 'Análisis individual, plan de entrenamiento y consulta 1:1 — online o presencial en Szczecin',
            cta: 'Reservar Consulta Gratis',
            stats: {
                athletes: 'atletas mejoraron resultados',
                years: 'años de experiencia',
                approach: 'enfoque individual'
            }
        },
        // ... more translations
    }
};

// Current language detection
function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.startsWith('/en/')) return 'en';
    if (path.startsWith('/es/')) return 'es';
    return 'pl';
}

// Initialize language switcher
function initLanguageSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    const currentLang = getCurrentLanguage();
    const currentBtn = switcher.querySelector('.lang-switcher__current span');

    if (currentBtn) {
        currentBtn.textContent = currentLang.toUpperCase();
    }

    // Set active state
    const options = switcher.querySelectorAll('.lang-switcher__option');
    options.forEach(option => {
        if (option.dataset.lang === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Store preference
    localStorage.setItem('preferred-language', currentLang);
}

// Get translation
function t(key, lang = null) {
    const currentLang = lang || getCurrentLanguage();
    const keys = key.split('.');
    let value = TRANSLATIONS[currentLang];

    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            // Fallback to Polish
            value = TRANSLATIONS.pl;
            for (const k2 of keys) {
                value = value?.[k2];
            }
            return value || key;
        }
    }

    return value || key;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initLanguageSwitcher);

// Export for use in other scripts
window.i18n = {
    getCurrentLanguage,
    t,
    LANGUAGES,
    TRANSLATIONS
};
