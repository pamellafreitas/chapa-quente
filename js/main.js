/**
 * CHAPA QUENTE BURGER CO.
 * Interações Globais: Menu Fixo, Menu Mobile Fullscreen e Scroll Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .btn-mobile-order');

  // 1. Sombra e background dinâmico ao rolar a página
  const handleScroll = () => {
    if (window.scrollY > 15) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Checagem inicial

  // 2. Controle do Menu Mobile Fullscreen
  const toggleMobileMenu = () => {
    const isOpen = mobileOverlay?.classList.toggle('is-open');
    menuToggle?.classList.toggle('is-active');
    
    // Bloquear rolagem do corpo enquanto o menu estiver aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    // Acessibilidade: aria-expanded
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  };

  const closeMobileMenu = () => {
    mobileOverlay?.classList.remove('is-open');
    menuToggle?.classList.remove('is-active');
    document.body.style.overflow = '';
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  };

  menuToggle?.addEventListener('click', toggleMobileMenu);

  // Fecha o menu ao clicar em qualquer link interno
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Fecha o menu ao pressionar a tecla ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOverlay?.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // 3. Suporte a animações de entrada ao rolar (IntersectionObserver)
  const animateElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && animateElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    animateElements.forEach(el => {
      // Se já estiver no viewport inicial, exibe imediatamente
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    // Fallback se IntersectionObserver não for suportado
    animateElements.forEach(el => el.classList.add('is-visible'));
  }

  // 4. ScrollSpy para Navegação de Categorias do Cardápio
  const categoryButtons = document.querySelectorAll('.category-nav-btn');
  const categorySections = document.querySelectorAll('.menu-category-section');

  if (categoryButtons.length > 0) {
    const updateActiveCategory = () => {
      let currentSectionId = '';
      const scrollPosition = window.scrollY + 160;

      categorySections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (!currentSectionId && categorySections.length > 0 && window.scrollY < categorySections[0].offsetTop) {
        currentSectionId = categorySections[0].getAttribute('id');
      }

      if (currentSectionId) {
        categoryButtons.forEach(btn => {
          if (btn.getAttribute('href') === `#${currentSectionId}`) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
    };

    window.addEventListener('scroll', updateActiveCategory, { passive: true });
    updateActiveCategory();

    categoryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            e.preventDefault();
            const headerOffset = 135;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          }
        }
      });
    });
  }
});

