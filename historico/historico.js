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

    // Atualiza os contadores do topo
    atualizarEstatisticas(finalizados);

    if (finalizados.length === 0) {
        container.innerHTML = `<p style="text-align:center; opacity:0.5; margin-top:50px;">Nenhum atendimento finalizado encontrado.</p>`;
        return;
    }

    finalizados.forEach((usuario) => {
        const card = document.createElement("div");
        card.className = "cardFilho";
        // Estilo específico para histórico: borda verde sutil indicando conclusão
        card.style.border = "1px solid rgba(39, 174, 96, 0.3)";
        
        const nomesProcedimentos = usuario.servicos ? 
            usuario.servicos.map(s => s.nome).join(", ") : 
            usuario.procedimento;

        card.innerHTML = `
            <div class="info-cliente-home">
                <h3 style="color: #27ae60;">${usuario.nome.toUpperCase()}</h3>
                <p>${nomesProcedimentos.toUpperCase()}</p>
                <small style="color: #fefefe; font-size: 14px;">Concluído em: ${usuario.data.split('-').reverse().join('/')}</small>
            </div>

            <div style="color: #5df312; font-size: 20px; font-weight: bold;">
                R$ ${usuario.preco.replace('.', ',')}
            </div>

            <div class="lixo" onclick="removerDoHistorico(${usuario.id})" style="margin-left: 20px;">
                <img src="../icones/lixeira.png" alt="Excluir Permanentemente" title="Excluir do Histórico">
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