

window.onload = function() {
    renderizarHistorico();
};

function renderizarHistorico(listaParaExibir = null) {
    const container = document.getElementById("containerHistorico");
    if (!container) return;

    container.innerHTML = "";
    let lista = listaParaExibir || JSON.parse(localStorage.getItem("meuBanco")) || [];

    // Filtra apenas os FINALIZADOS
    const finalizados = lista.filter(u => u.finalizado === true && u.cancelado !== true);

    // Atualiza estatísticas do topo
    if (typeof atualizarEstatisticas === "function") {
        atualizarEstatisticas(finalizados);
    }

    if (finalizados.length === 0) {
        container.innerHTML = `<p style="text-align:center; width:100%; opacity:0.5; margin-top:50px;">Nenhum atendimento finalizado encontrado.</p>`;
        return;
    }

    finalizados.forEach((usuario) => {
        const card = document.createElement("div");
        card.className = "cardFilhoHistorico";

        // Gera a lista de procedimentos com preço
        let htmlServicos = "";
        if (usuario.servicos && usuario.servicos.length > 0) {
            htmlServicos = usuario.servicos.map(s => `
                <div class="item-servico">
                    <span>${s.nome.toUpperCase()}</span>
                    <span>R$ ${parseFloat(s.valor).toFixed(2).replace('.', ',')}</span>
                </div>
            `).join('');
        } else {
            htmlServicos = `<div class="item-servico"><span>${usuario.procedimento.toUpperCase()}</span><span>R$ ${usuario.preco}</span></div>`;
        }

        card.innerHTML = `
            <h3>${usuario.nome.toUpperCase()}</h3>
            
            <div class="lista-procedimentos">
                <p style="font-size: 10px; color: #79ade1; margin-bottom: 8px; font-weight: bold;">SERVIÇOS REALIZADOS:</p>
                ${htmlServicos}
            </div>

            <div class="footer-card">
                <span class="data">${usuario.data.split('-').reverse().join('/')}</span>
                <span class="total">R$ ${usuario.preco.replace('.', ',')}</span>
            </div>

            <div class="lixo-historico" onclick="removerDoHistorico(${usuario.id})">
                <img src="../icones/lixeira.png" alt="Excluir" style="width: 20px; margin-top: 20px">
            </div>
        `;
        
        container.appendChild(card);
    });
}

function atualizarEstatisticas(lista) {
    document.getElementById("totalFinalizados").innerText = lista.length;
    
    const totalDinheiro = lista.reduce((acc, curr) => {
        const valor = parseFloat(curr.preco.replace(',', '.'));
        return acc + valor;
    }, 0);

    document.getElementById("faturamentoTotal").innerText = `R$ ${totalDinheiro.toFixed(2).replace('.', ',')}`;
}

function filtrarHistorico() {
    const termo = document.getElementById("inputPesquisar").value.toLowerCase();
    const lista = JSON.parse(localStorage.getItem("meuBanco")) || [];
    const filtrados = lista.filter(u => 
        u.finalizado && u.nome.toLowerCase().includes(termo)
    );
    renderizarHistorico(filtrados);
}

function removerDoHistorico(id) {
    if(confirm("Deseja apagar este registro permanentemente do histórico?")) {
        let lista = JSON.parse(localStorage.getItem("meuBanco")) || [];
        lista = lista.filter(u => u.id !== id);
        localStorage.setItem("meuBanco", JSON.stringify(lista));
        renderizarHistorico();
    }
}


// Adicione ao final do seu historico.js
function filtrarHistorico() {
    const termo = document.getElementById("inputPesquisar").value.toLowerCase();
    const lista = JSON.parse(localStorage.getItem("meuBanco")) || [];

    const filtrados = lista.filter(u => {
        const correspondeNome = u.nome.toLowerCase().includes(termo);
        const estaFinalizado = u.finalizado === true && u.cancelado !== true;
        return correspondeNome && estaFinalizado;
    });

    renderizarHistorico(filtrados);
}