window.onload = function() {
    atualizarPeriodo();
    exibirBannerMeta();
    processarDados();
};

function atualizarPeriodo() {
    const data = new Date();
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    document.getElementById("periodoAtual").innerText = `${meses[data.getMonth()]} de ${data.getFullYear()}`;
}

function definirNovaMeta() {
    const valor = document.getElementById("inputMeta").value;
    const prazo = document.getElementById("inputPrazo").value;

    if (!valor || !prazo) {
        alert("Por favor, preencha o valor e o prazo da meta.");
        return;
    }

    const objetivo = {
        valor: parseFloat(valor),
        prazo: prazo,
        criadoEm: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem("objetivoAtual", JSON.stringify(objetivo));
    exibirBannerMeta();
    processarDados(); // Atualiza os cálculos com a nova meta
}

function exibirBannerMeta() {
    const container = document.getElementById("bannerMetaContainer");
    const objetivo = JSON.parse(localStorage.getItem("objetivoAtual"));
    
    if (!objetivo) {
        container.innerHTML = "";
        return;
    }

    const banco = JSON.parse(localStorage.getItem("meuBanco")) || [];
    const mesAtual = new Date().toISOString().slice(0, 7);
    
    // Soma o que foi ganho no mês
    const totalGanhos = banco
        .filter(u => u.finalizado && u.data.startsWith(mesAtual))
        .reduce((acc, u) => acc + parseFloat(u.preco.replace(',', '.')), 0);

    const metaBatida = totalGanhos >= objetivo.valor;
    let classeSucesso = metaBatida ? "sucesso" : "";
    
    let mensagem = metaBatida ? 
        `<span class="msg-sucesso"><i class="bi bi-trophy"></i> META ALCANÇADA!</span>` : 
        `<span style="color: #f1960d; font-weight: bold;">Faltam R$ ${(objetivo.valor - totalGanhos).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>`;

    const dataFormatada = objetivo.prazo.split('-').reverse().join('/');

    container.innerHTML = `
        <div class="banner-meta ${classeSucesso}">
            <div class="info-meta">
                <p>OBJETIVO ATIVO</p>
                <h2>R$ ${objetivo.valor.toLocaleString('pt-BR')} até ${dataFormatada}</h2>
            </div>
            <div class="status-meta">
                ${mensagem}
            </div>
        </div>
    `;
}

function processarDados() {
    const banco = JSON.parse(localStorage.getItem("meuBanco")) || [];
    const corpoTabela = document.getElementById("corpoTabela");
    const mesAtual = new Date().toISOString().slice(0, 7);
    
    corpoTabela.innerHTML = "";

    let totalAlcancado = 0;
    let totalCancelado = 0;

    banco.forEach(item => {
        let classeStatus = "";
        let textoStatus = "";

        if (item.finalizado) {
            classeStatus = "status-finalizado";
            textoStatus = "FINALIZADO";
            totalAlcancado += parseFloat(item.preco.replace(',', '.'));
        } else if (item.cancelado) {
            classeStatus = "status-cancelado";
            textoStatus = "CANCELADO";
            totalCancelado += parseFloat(item.preco.replace(',', '.'));
        } else {
            classeStatus = "status-pendente";
            textoStatus = "PENDENTE";
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.procedimento || 'Serviço'}</td>
            <td>1</td>
            <td>R$ ${item.preco}</td>
            <td class="${classeStatus}">${textoStatus}</td>
        `;
        corpoTabela.appendChild(tr);
    });

    // Atualiza os Cards
    document.getElementById("valorAlcancado").innerText = `R$ ${totalAlcancado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById("valorCancelado").innerText = `R$ ${totalCancelado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    
    // Atualiza Progresso e Valor Pendente
    const objetivo = JSON.parse(localStorage.getItem("objetivoAtual"));
    if (objetivo) {
        const porcentagem = Math.min((totalAlcancado / objetivo.valor) * 100, 100);
        document.getElementById("progressoPreenchimento").style.width = porcentagem + "%";
        
        const pendente = Math.max(objetivo.valor - totalAlcancado, 0);
        document.getElementById("valorPendente").innerText = `R$ ${pendente.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }
}