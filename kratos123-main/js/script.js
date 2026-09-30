// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');
  const nav = document.querySelector('nav');

  // Adiciona um evento de clique em cada link do menu
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.checked = false; // Desmarca o checkbox, fechando o menu
    });
  });

  // Altera o fundo do nav ao rolar a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });
});