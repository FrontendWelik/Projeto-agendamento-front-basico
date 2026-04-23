
let dataRelatorio = new Date(); // Inicia na data atual

window.onload = function() {
    renderizarCaixa();
};

function mudarMes(direcao) {
    // Adiciona ou subtrai 1 mês na data de visualização
    dataRelatorio.setMonth(dataRelatorio.getMonth() + direcao);
    renderizarCaixa();
}

function renderizarCaixa() {
    const container = document.getElementById("containerCaixa");
    const displayMes = document.getElementById("mes-atual-display");
    if (!container) return;

    container.innerHTML = "";
    const lista = JSON.parse(localStorage.getItem("meuBanco")) || [];
    
    // Configurações de data para filtro
    const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const mesFiltro = (dataRelatorio.getMonth() + 1).toString().padStart(2, '0');
    const anoFiltro = dataRelatorio.getFullYear();
    const hoje = new Date().toISOString().split('T')[0];

    // Atualiza o título do mês no topo
    displayMes.innerText = `${nomesMeses[dataRelatorio.getMonth()]} ${anoFiltro}`;

    let somaHoje = 0;
    let somaMes = 0;

    // Filtra apenas os finalizados que pertencem ao mês/ano selecionado
    const finalizados = lista.filter(u => {
        if (!u.finalizado) return false;
        
        const [ano, mes, dia] = u.data.split('-');
        
        if (mes === mesFiltro && ano == anoFiltro) {
            const valor = parseFloat(u.preco) || 0;
            somaMes += valor;
            if (u.data === hoje) somaHoje += valor;
            return true;
        }
        return false;
    });

    // Atualiza os valores do painel de status
    document.getElementById("ganhoHoje").innerText = `R$ ${somaHoje.toFixed(2).replace('.', ',')}`;
    document.getElementById("ganhoMes").innerText = `R$ ${somaMes.toFixed(2).replace('.', ',')}`;

    if (finalizados.length === 0) {
        container.innerHTML = `<p style="color: gray; text-align: center; margin-top: 50px;">Nenhum faturamento registrado para este período.</p>`;
        return;
    }

    // Ordena por data (mais recentes primeiro)
    finalizados.sort((a, b) => b.data.localeCompare(a.data));

    finalizados.forEach(usuario => {
        const card = document.createElement("div");
        card.className = "card-agendamento"; // Usa sua classe padrão de design
        card.style.borderLeft = "6px solid #27ae60"; // Destaque lateral verde (caixa)

        const htmlServicos = usuario.servicos.map(s => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px;">
                <span style="color: #b0b0b0;">${s.nome.toUpperCase()}</span>
                <span style="color: #fff;">R$ ${parseFloat(s.valor).toFixed(2).replace('.', ',')}</span>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="header" style="text-align: center; margin-bottom: 10px;">
                <h2 class="nome" style="color: #f1960d; font-size: 22px;">${usuario.nome.toUpperCase()}</h2>
                <p class="detalhes" style="color: #fff; font-size: 14px;">Pago em: ${usuario.data.split('-').reverse().join('/')}</p>
            </div>
            <div class="procedimentos-container" style="width: 100%; padding: 5px;">
                <p style="color: #4a90e2; font-size: 10px; font-weight: bold; margin-bottom: 8px;">DETALHES DO SERVIÇO</p>
                ${htmlServicos}
            </div>
            <div class="divisor-nota" style="border-top: 1px dashed rgba(255,255,255,0.2); margin: 12px 0;"></div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                <span style="font-size: 14px;">VALOR RECEBIDO</span>
                <span style="color: #5df312; font-size: 18px;">R$ ${usuario.preco.replace('.', ',')}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function fecharCaixa() {
    if(confirm("Deseja realizar o fechamento do caixa do dia?")) {
        alert("Caixa do dia fechado com sucesso!");
    }
}