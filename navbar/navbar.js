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
                    <a href="../fila/fila.html">Fila</a>
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

                <li class="baixo">
                    <img src="../icones/gear.png" alt="">
                    <a href="../configuracao/configuracao.html">Configuração</a>
                </li>

                <li class="baixo">
                    <img src="../icones/exit.png" alt="">
                    <a href="#">Sair</a>
                </li>
            </ul>
        </nav>

`;
document.getElementById('navbar').innerHTML = navHTML;

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