
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
    const hoje = new Date().toISOString().split('T')[0];

    // 1. Filtra os ativos (não finalizados/cancelados) e ORDENA por data e hora
    const ativos = lista.filter(u => !u.finalizado && !u.cancelado).sort((a, b) => {
        const dataA = a.data + a.hora;
        const dataB = b.data + b.hora;
        return dataA.localeCompare(dataB);
    });

    let ultimaDataRenderizada = "";

    ativos.forEach((usuario) => {
        // 2. Divisor de Data (Mantendo sua organização por dia)
        if (usuario.data !== ultimaDataRenderizada) {
            const dataExibicao = usuario.data === hoje ? "HOJE" : usuario.data.split('-').reverse().join('/');
            
            const divisor = document.createElement("div");
            divisor.className = "divisor-data";
            divisor.innerHTML = `<span>${dataExibicao}</span>`;
            container.appendChild(divisor);
            
            ultimaDataRenderizada = usuario.data;
        }

        // 3. Novo Design do Card (Igual ao Temporário, sem preços)
        const card = document.createElement("div");
        card.className = "card-agendamento"; // Usando a mesma classe da Fila/Temporário
        
        // Formata os procedimentos em lista simples (sem o valor R$)
        const htmlProcedimentos = usuario.servicos ? 
            usuario.servicos.map(s => `
                <div style="margin-bottom: 3px; color: #b0b0b0; font-size: 14px;">
                    <i class="bi bi-check2-short"></i> ${s.nome.toUpperCase()}
                </div>
            `).join('') : 
            `<div style="color: #b0b0b0;">${usuario.procedimento.toUpperCase()}</div>`;

        card.innerHTML = `
            <div class="header" style="text-align: center; margin-bottom: 15px;">
                <h2 class="nome" style="color: #f1960d; font-size: 24px;">${usuario.nome.toUpperCase()}</h2>
                <p class="detalhes" style="color: #fff; font-size: 18px;">Data: ${usuario.data.split('-').reverse().join('/')}</p>
                <p class="horario" style="color: #5df312; font-size: 20px; font-weight: bold;">Hora: ${usuario.hora}h</p>
            </div>
            
            <div class="procedimentos-container" style="width: 100%; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                <p class="label-titulo" style="color: #4a90e2; font-size: 11px; font-weight: bold; margin-bottom: 8px;">PROCEDIMENTOS AGENDADOS</p>
                ${htmlProcedimentos}
            </div>

            <div class="container-status" style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
                 <button class="lixo" onclick="apagarDaHome(${usuario.id})" style="background: #e74c3c; border: none; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    <i class="bi bi-trash"></i>
                 </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}



// Adicione ao final do seu contagemClientes.js
function filtrarHome() {
    const termo = document.getElementById("inputPesquisar").value.toLowerCase();
    const lista = JSON.parse(localStorage.getItem("meuBanco")) || [];

    const filtrados = lista.filter(u => {
        const correspondeNome = u.nome.toLowerCase().includes(termo);
        const estaAtivo = !u.finalizado && !u.cancelado && !u.oculto;
        return correspondeNome && estaAtivo;
    });

    renderizarHome(filtrados);
}