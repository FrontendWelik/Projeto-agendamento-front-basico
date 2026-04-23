window.onload = function() {
    // Carrega a meta salva anteriormente, se houver
    const metaSalva = localStorage.getItem("metaFaturamento");
    if(metaSalva) {
        document.getElementById("metaMensal").value = metaSalva;
    }
};

// --- NOVA FUNÇÃO: SALVAR META ---
function salvarMeta() {
    const valorMeta = document.getElementById("metaMensal").value;
    if(!valorMeta || valorMeta <= 0) return alert("Por favor, insira um valor válido para a meta.");
    
    localStorage.setItem("metaFaturamento", valorMeta);
    alert("Meta de faturamento definida com sucesso! Agora você pode acompanhar seu progresso.");
}

// --- EXPORTAR RELATÓRIO ---
function exportarRelatorio(tipo) {
    const mes = document.getElementById("mesFiltro").value;
    if(!mes) return alert("Selecione um mês para exportar o relatório.");

    const banco = JSON.parse(localStorage.getItem("meuBanco")) || [];
    const dadosMes = banco.filter(u => u.finalizado && u.data.startsWith(mes));

    if(dadosMes.length === 0) return alert("Não há registros de atendimentos finalizados para o mês selecionado.");

    let conteudo = "Data;Cliente;Procedimento;Valor\n";
    dadosMes.forEach(u => {
        conteudo += `${u.data};${u.nome};${u.procedimento || 'Vários'};${u.preco}\n`;
    });

    baixarArquivo(conteudo, `faturamento_${mes}.csv`, 'text/csv');
}

function baixarArquivo(conteudo, nomeArquivo, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    link.click();
}

// --- SESSÃO E LIMPEZA ---
function sairSistema() {
    if(confirm("Deseja realmente sair e voltar para a página inicial?")) {
        window.location.href = "../index.html";
    }
}

function limparTudo() {
    // Dupla confirmação por segurança
    const confirmacao1 = confirm("ATENÇÃO: Você está prestes a apagar TODOS os dados do sistema. Esta ação não pode ser desfeita.");
    if(confirmacao1) {
        const confirmacao2 = prompt("Para confirmar, digite 'APAGAR' abaixo:");
        if(confirmacao2 === "APAGAR") {
            localStorage.clear();
            alert("O sistema foi resetado com sucesso.");
            window.location.href = "../index.html";
        } else {
            alert("Ação cancelada. A palavra de confirmação estava incorreta.");
        }
    }
}