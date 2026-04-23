window.onload = function() {
    atualizarPainelStatus();
    renderizarHome();
    
    // Inicia o relógio em tempo real
    setInterval(atualizarRelogio, 1000);
};

function atualizarRelogio() {
    const agora = new Date();
    const hora = agora.toLocaleTimeString('pt-BR');
    const elementoHora = document.getElementById("horaAtual");
    if (elementoHora) elementoHora.innerText = hora;
}

function atualizarPainelStatus() {
    const lista = JSON.parse(localStorage.getItem("meuBanco")) || [];
    const agora = new Date();
    const hojeFormatado = agora.toLocaleDateString('pt-BR');

    // Filtra apenas os que não estão ocultos e são de hoje
    const ativosHoje = lista.filter(u => !u.oculto);

    document.getElementById("totalClientes").innerText = ativosHoje.length;
    document.getElementById("dataAtual").innerText = hojeFormatado;
}

function renderizarHome(listaParaExibir = null) {
    const container = document.getElementById("containerHome");
    if (!container) return;

    container.innerHTML = "";
    let lista = listaParaExibir || JSON.parse(localStorage.getItem("meuBanco")) || [];

    // 1. Filtra os ativos e ORDENA por data e hora para não ficarem misturados
    const ativos = lista.filter(u => !u.finalizado && !u.cancelado).sort((a, b) => {
        return new Date(a.data + 'T' + a.hora) - new Date(b.data + 'T' + b.hora);
    });

    const hoje = new Date().toISOString().split('T')[0];
    let ultimaDataRenderizada = "";

    ativos.forEach((usuario) => {
        // 2. LÓGICA DO DIVISOR: Se a data deste card for diferente da anterior, cria o título
        if (usuario.data !== ultimaDataRenderizada) {
            const dataExibicao = usuario.data === hoje ? "HOJE" : usuario.data.split('-').reverse().join('/');
            
            const divisor = document.createElement("div");
            divisor.className = "divisor-data";
            divisor.innerHTML = `<span>${dataExibicao}</span>`;
            container.appendChild(divisor);
            
            ultimaDataRenderizada = usuario.data;
        }

        // 3. SEU CARD ORIGINAL (Mantido exatamente como estava)
        const nomesProcedimentos = usuario.servicos ? 
            usuario.servicos.map(s => s.nome).join(", ") : 
            usuario.procedimento;

        const card = document.createElement("div");
        card.className = "cardFilho";
        
        card.innerHTML = `
    
                <div class="info-cliente-home">
                <h3>${usuario.nome.toUpperCase()}</h3>
                <p>${nomesProcedimentos.toUpperCase()}</p>
                <small style="color: #f0f7f8; font-size: 25px;">${usuario.data.split('-').reverse().join('/')}</small>
            </div>

            <div style="color: #5df312; font-size: 25px;">
                ${usuario.hora}h
            </div>

            <div class="lixo" onclick="apagarDaHome(${usuario.id})">
                <img src="icones/lixeira.png" alt="Remover">
            </div>
        `;
        container.appendChild(card);
    });
}