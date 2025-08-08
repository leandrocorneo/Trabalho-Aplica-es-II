document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const selector = link.dataset.scroll;
      scrollToElement(selector);
    });
  });

  function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      const offset = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    } 
    return;
  }
});