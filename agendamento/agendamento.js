window.onload = function() {
    const hoje = new Date().toISOString().split("T")[0];
    const campoData = document.getElementById("data");
    if (campoData) {
        campoData.setAttribute("min", hoje);
    }
    renderizarCards();
};

function criarCard(event) {
    event.preventDefault();

    let whats = document.getElementById("whats").value;
    let nome = document.getElementById("nome").value;
    let procedimento = document.getElementById("procedimento").value;
    let preco = document.getElementById("preco").value;
    let dataInput = document.getElementById("data").value; 
    let horaInput = document.getElementById("hora").value;

    if (!nome || !dataInput || !horaInput) {
        return alert("Por favor, preencha Nome, Data e Hora.");
    }

    // --- SISTEMA DE TRAVA: HORÁRIO DUPLICADO ---
    let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];
    const horarioOcupado = listaUsuarios.some(agendamento => {
        return agendamento.data === dataInput && agendamento.hora === horaInput;
    });

    if (horarioOcupado) {
        alert("Ops! Este horário já está reservado.");
        return;
    }

    const novoUsuario = {
        id: Date.now(), // ID único para identificar o card sem erro
        whats: whats || "",
        nome: nome || "Cliente Sem Nome",
        procedimento: procedimento || "Não Informado",
        preco: preco || "0",
        data: dataInput,
        hora: horaInput,
        oculto: false, // Por padrão, aparece na lateral ao ser criado
        dataCriacao: new Date().getTime() // Para o limite de 1 dia
    };

    listaUsuarios.push(novoUsuario);
    localStorage.setItem("meuBanco", JSON.stringify(listaUsuarios));

    event.target.reset(); 
    renderizarCards();
}

function renderizarCards(listaParaExibir = null) {
    const containerCards = document.getElementById("card"); 
    if (!containerCards) return;

    containerCards.innerHTML = "";
    let listaUsuarios = listaParaExibir || JSON.parse(localStorage.getItem("meuBanco")) || [];
    
    const agora = new Date().getTime();
    const umDiaEmMs = 24 * 60 * 60 * 1000;

    listaUsuarios.forEach((usuario) => {
        // REGRA DE EXIBIÇÃO TEMPORÁRIA
        if (!listaParaExibir) {
            if (usuario.oculto === true) return; // Não mostra se foi clicado no X
            if (agora - usuario.id > umDiaEmMs) return; // Não mostra se passou de 1 dia
        }

        const novoCard = document.createElement("div");
        novoCard.className = "card-agendamento"; 
        
        novoCard.innerHTML = `
            <button class="btn-ocultar" onclick="ocultarCard(${usuario.id})">&times;</button>
            
            <div class="header">
                <div class="cliente-info">
                    <h2 class="nome">${usuario.nome.toUpperCase()}</h2>
                    <p class="detalhes">Data : ${usuario.data.split('-').reverse().join('/')}</p>
                </div>
                <span class="horario">Hora : ${usuario.hora}</span>
            </div>
            <div class="procedimentos-container">
                <p class="label-titulo">PROCEDIMENTOS</p>
                <div class="item-linha">
                    <span>${usuario.procedimento.toUpperCase()}</span>
                    <span>R$ ${usuario.preco}</span>
                </div>
            </div>
            <div class="total-linha">
                <strong>TOTAL</strong>
                <strong>R$ ${usuario.preco}</strong>
            </div>            
            <div class="container-status">
                <div class="status-fila">
                    <i class="bi bi-clock-history"></i> ADICIONADO À FILA
                </div>
            </div>
        `;
        containerCards.appendChild(novoCard);
    });
}

// FUNÇÃO PARA OCULTAR (SEM APAGAR DA FILA)
function ocultarCard(id) {
    let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];
    const index = listaUsuarios.findIndex(u => u.id === id);
    
    if (index !== -1) {
        listaUsuarios[index].oculto = true; // Marca como oculto apenas para esta visualização
        localStorage.setItem("meuBanco", JSON.stringify(listaUsuarios));
        renderizarCards();
    }
}

function filtrarCards() {
    let input = document.getElementById("inputPesquisar");
    if (!input) return;

    let termoBusca = input.value.toLowerCase();
    let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];

    // Na pesquisa, ele ignora se o card está oculto ou não, ele mostra tudo o que achar
    let listaFiltrada = listaUsuarios.filter(usuario => {
        return (
            usuario.nome.toLowerCase().includes(termoBusca) || 
            usuario.whats.includes(termoBusca) || 
            usuario.data.includes(termoBusca)
        );
    });

    renderizarCards(listaFiltrada);
}

// Mantenha as outras funções (enviarWhatsapp, adicionarNovoServico) como estavam.