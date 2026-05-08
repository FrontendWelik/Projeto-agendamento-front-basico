// mobile-behavior.js

document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.querySelector('nav');
    
    if (navbar) {
        // 1. Cria o botão hambúrguer dinamicamente
        const btnMenu = document.createElement('button');
        btnMenu.className = 'btn-hamburguer';
        btnMenu.innerHTML = '<i class="bi bi-list"></i>'; // Usa o ícone do Bootstrap que você já tem
        
        // 2. Insere o botão na nav (antes do H1 ou no final)
        navbar.prepend(btnMenu);

        // 3. Evento de clique para abrir/fechar
        btnMenu.addEventListener('click', function() {
            navbar.classList.toggle('menu-aberto');
            
            // Troca o ícone de 'lista' para 'X' quando aberto
            const icone = btnMenu.querySelector('i');
            if (navbar.classList.contains('menu-aberto')) {
                icone.classList.replace('bi-list', 'bi-x');
            } else {
                icone.classList.replace('bi-x', 'bi-list');
            }
        });

        // 4. Fecha o menu ao clicar em qualquer link
        const links = navbar.querySelectorAll('ul li');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('menu-aberto');
                btnMenu.querySelector('i').classList.replace('bi-x', 'bi-list');
            });
        });
    }
});