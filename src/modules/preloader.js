function closePreloader() {
    const preloader = document.querySelector('.preloader');
    const mainContent = document.querySelector('.content');
    preloader.style.opacity = 0;
    mainContent.style.opacity = 1;
}

export {closePreloader}
