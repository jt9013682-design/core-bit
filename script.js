// ═══════════════════════════════════════════════════════════════
// CORE BIT — JavaScript Functionality
// ═══════════════════════════════════════════════════════════════

// ── STATE ──
let authState = {
  isLoggedIn: false,
  user: null,
  language: 'pt-BR'
};

let chatState = {
  messages: [],
  isOpen: false,
  messageCount: 0
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.classList.remove('open');
  });
}

// ═══════════════════════════════════════════════════════════════
// MODAL FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function openModal(modalId) {
  closeAllModals();
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModal(event) {
  const overlay = event.target.closest('.modal-overlay');
  if (overlay && event.target === overlay) {
    overlay.classList.remove('open');
  }
}

// Modal close button
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-close')) {
    const overlay = e.target.closest('.modal-overlay');
    if (overlay) {
      overlay.classList.remove('open');
    }
  }
});

// Modal overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e);
  }
});

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION TABS
// ═══════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('auth-tab')) {
    const tabs = e.target.parentElement;
    tabs.querySelectorAll('.auth-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    e.target.classList.add('active');

    // Toggle forms (if they exist)
    const tabIndex = Array.from(tabs.children).indexOf(e.target);
    const panels = e.target.closest('.modal').querySelectorAll('.auth-panel');
    if (panels.length > 0) {
      panels.forEach((panel, idx) => {
        panel.style.display = idx === tabIndex ? 'block' : 'none';
      });
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// FORM HANDLING
// ═══════════════════════════════════════════════════════════════

document.addEventListener('submit', (e) => {
  if (e.target.classList.contains('auth-form')) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email') || formData.get('login-email');
    const password = formData.get('password') || formData.get('login-password');

    // Validação básica
    if (!email || !password) {
      showToast('Por favor, preencha todos os campos', 'error');
      return;
    }

    if (email.includes('@')) {
      // Login/Registro
      authState.isLoggedIn = true;
      authState.user = {
        email: email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
      };

      closeAllModals();
      updateNavBar();
      showToast(`Bem-vindo, ${authState.user.name}!`, 'success');
    } else {
      showToast('Email inválido', 'error');
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// NAVBAR UPDATE
// ═══════════════════════════════════════════════════════════════

function updateNavBar() {
  const navUser = document.querySelector('.nav-user');
  const navCta = document.querySelector('.nav-cta');

  if (authState.isLoggedIn && authState.user) {
    navUser.classList.add('visible');
    const avatar = navUser.querySelector('.nav-avatar');
    const username = navUser.querySelector('.nav-username');
    
    if (avatar) avatar.textContent = authState.user.name.charAt(0);
    if (username) username.textContent = authState.user.name;
    
    if (navCta) navCta.textContent = 'Dashboard';
  } else {
    navUser.classList.remove('visible');
    if (navCta) navCta.textContent = 'Entrar';
  }
}

// ═══════════════════════════════════════════════════════════════
// LOGIN/SIGNUP BUTTONS
// ═══════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
  // Botão "Entrar" na navbar
  if (e.target.classList.contains('nav-cta') && !authState.isLoggedIn) {
    openModal('authModal');
  }

  // Dashboard na navbar
  if (e.target.classList.contains('nav-cta') && authState.isLoggedIn) {
    showToast('Redirecionando para Dashboard...', 'info');
  }

  // Botão de logout
  if (e.target.classList.contains('btn-logout')) {
    authState.isLoggedIn = false;
    authState.user = null;
    updateNavBar();
    showToast('Até logo!', 'success');
  }
});

// ═══════════════════════════════════════════════════════════════
// HERO CTA BUTTONS
// ═══════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-primary')) {
    if (e.target.textContent.includes('Começar')) {
      if (authState.isLoggedIn) {
        showToast('Redirecionando para o chat...', 'info');
        openChatScreen();
      } else {
        openModal('authModal');
      }
    }
  }

  if (e.target.classList.contains('btn-ghost')) {
    showToast('Documentação em desenvolvimento', 'info');
  }
});

// ═══════════════════════════════════════════════════════════════
// PRICING PLAN BUTTONS
// ═══════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('plan-btn')) {
    if (!authState.isLoggedIn) {
      openModal('authModal');
      showToast('Faça login para continuar', 'info');
      return;
    }

    const planCard = e.target.closest('.plan-card');
    const planName = planCard.querySelector('.plan-name').textContent;

    if (e.target.classList.contains('primary') || 
        e.target.classList.contains('purple') || 
        e.target.classList.contains('green-btn')) {
      openModal('paymentModal');
      showToast(`Plano ${planName} selecionado`, 'success');
    } else if (e.target.classList.contains('ghost')) {
      showToast(`Entre em contato para ${planName}`, 'info');
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// PAYMENT MODAL TABS
// ═══════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('ptab')) {
    const container = e.target.closest('.payment-tabs');
    const paymentType = e.target.dataset.payment;

    // Remove active de todos os tabs
    container.querySelectorAll('.ptab').forEach(tab => {
      tab.classList.remove('active');
    });
    e.target.classList.add('active');

    // Mostra o painel correspondente
    const modal = e.target.closest('.modal');
    modal.querySelectorAll('.pay-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = modal.querySelector(`.pay-panel[data-payment="${paymentType}"]`);
    if (activePanel) {
      activePanel.classList.add('active');
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// PIX COPY BUTTON
// ═══════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('copy-btn')) {
    const pixSection = e.target.closest('.pix-section');
    const pixKey = pixSection ? 
                   pixSection.querySelector('.pix-key-value').textContent :
                   e.target.parentElement.querySelector('.pix-key-value').textContent;
    
    navigator.clipboard.writeText(pixKey).then(() => {
      e.target.classList.add('copied');
      e.target.textContent = '✓ Copiado!';
      
      setTimeout(() => {
        e.target.classList.remove('copied');
        e.target.textContent = '📋 Copiar Chave PIX';
      }, 2000);
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// FAQ ACCORDION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
  const faqQuestion = e.target.closest('.faq-q');
  if (faqQuestion) {
    const faqItem = faqQuestion.closest('.faq-item');
    
    // Fecha outros FAQs
    document.querySelectorAll('.faq-item.open').forEach(item => {
      if (item !== faqItem) {
        item.classList.remove('open');
      }
    });

    // Toggle current FAQ
    faqItem.classList.toggle('open');
  }
});

// ═══════════════════════════════════════════════════════════════
// SUPPORT WIDGET
// ═══════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
  // Abrir/fechar painel de suporte
  if (e.target.classList.contains('support-fab')) {
    const panel = document.querySelector('.support-panel');
    if (panel) {
      panel.classList.toggle('open');
    }
  }

  // Fechar painel de suporte
  if (e.target.classList.contains('support-close')) {
    const panel = document.querySelector('.support-panel');
    if (panel) {
      panel.classList.remove('open');
    }
  }

  // Enviar mensagem de suporte
  if (e.target.classList.contains('support-send')) {
    const input = document.querySelector('.support-input');
    if (input && input.value.trim()) {
      const msgText = input.value;
      const msgContainer = document.querySelector('.support-msgs');

      // Adiciona mensagem do usuário
      const userMsg = document.createElement('div');
      userMsg.className = 'support-msg user';
      userMsg.textContent = msgText;
      msgContainer.appendChild(userMsg);

      // Limpa input
      input.value = '';
      msgContainer.scrollTop = msgContainer.scrollHeight;

      // Resposta automática
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'support-msg bot';
        botMsg.textContent = 'Obrigado pela sua mensagem! Um agente responderá em breve.';
        msgContainer.appendChild(botMsg);
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }, 500);
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// CHAT SCREEN
// ═══════════════════════════════════════════════════════════════

function openChatScreen() {
  const chatScreen = document.getElementById('chatScreen');
  if (chatScreen) {
    chatScreen.classList.add('open');
    chatState.isOpen = true;
  }
}

function closeChatScreen() {
  const chatScreen = document.getElementById('chatScreen');
  if (chatScreen) {
    chatScreen.classList.remove('open');
    chatState.isOpen = false;
  }
}

document.addEventListener('click', (e) => {
  // Botão voltar do chat
  if (e.target.classList.contains('chat-back')) {
    closeChatScreen();
  }

  // Enviar mensagem no chat
  if (e.target.classList.contains('chat-send-btn')) {
    const input = document.querySelector('.chat-input');
    if (input && input.value.trim()) {
      const msgText = input.value;
      chatState.messageCount++;
      
      showToast(`Mensagem enviada: "${msgText}"`, 'success');
      input.value = '';
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// LANGUAGE SELECTOR
// ═══════════════════════════════════════════════════════════════

document.addEventListener('change', (e) => {
  if (e.target.classList.contains('lang-select')) {
    authState.language = e.target.value;
    showToast(`Idioma alterado para ${e.target.value}`, 'info');
  }
});

// ═══════════════════════════════════════════════════════════════
// NAV LINKS SCROLL
// ═══════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
    const href = e.target.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Inicia a navbar
  updateNavBar();

  // Define primeiro tab de auth como ativo
  const firstAuthTab = document.querySelector('.auth-tab');
  if (firstAuthTab) {
    firstAuthTab.classList.add('active');
  }

  // Define primeiro payment tab como ativo
  const firstPayTab = document.querySelector('.ptab');
  if (firstPayTab) {
    firstPayTab.classList.add('active');
  }

  console.log('✓ Core Bit JavaScript loaded successfully');
});
