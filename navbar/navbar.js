


const navHTML = `
<nav>
            <h1>Agendamento Online</h1>
            <ul>
                <li>
                    <img src="../icones/house.png" alt="">
                    <a href="../index.html">Home</a>
                </li>

                <li>
                    <img src="../icones/calendar.png" alt="">
                    <a href="../agendamento/agendamento.html">Novo Agendamento</a>
                </li>

                <li>
                    <img src="../icones/right-arrow.png" alt="">
                    <a href="../fila/fila.html">Fila de Agendados </a>
                </li>

                <li>
                    <img src="../icones/history.png" alt="">
                    <a href="../historico/historico.html">Historico</a>
                </li>

                <li>
                    <img src="../icones/close.png" alt="">
                    <a href="../cancelados/cancelado.html">Cancelado</a>
                </li>

                <li>
                    <img src="../icones/money.png" alt="">
                    <a href="../caixa/caixa.html">Caixa</a>
                </li>

                <li>
                    <img src="../icones/gear.png" alt="">
                    <a href="../config/config.html">Configuração</a>
                </li>

                <li>
                    <img src="../icones/exit.png" alt="">
                    <a href="../metas/metas.html">Metas</a>
                </li>
            </ul>
        </nav>

`;
document.getElementById('navbar').innerHTML = navHTML;


// Lógica para marcar a página ativa
const links = document.querySelectorAll('nav ul li a');
const currentPath = window.location.pathname;

links.forEach(link => {
    // Verifica se o caminho atual termina com o href do link
    // O use de .includes() ajuda a identificar a página mesmo com caminhos relativos
    if (currentPath.includes(link.getAttribute('href').replace('..', ''))) {
        link.parentElement.classList.add('ativo');
    }
});


// Seleciona todas as LIs dentro da navegação
const menuItems = document.querySelectorAll('nav ul li');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Busca o link (tag <a>) que está dentro dessa LI específica
        const link = item.querySelector('a');
        
        if (link) {
            // Pega o endereço (href) do link e muda a página
            window.location.href = link.href;
        }
    });
});