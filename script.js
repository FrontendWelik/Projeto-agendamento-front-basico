window.onload = function() {
    // Bloquear datas retroativas no calendário (HTML)
    const hoje = new Date().toISOString().split("T")[0];
    const campoData = document.getElementById("data");
    if (campoData) {
        campoData.setAttribute("min", hoje);
    }
    
    renderizarCards();
};

function criarCard(event) {
    event.preventDefault();

    // Captura dos valores
    let whats = document.getElementById("whats").value;
    let nome = document.getElementById("nome").value;
    let procedimento = document.getElementById("procedimento").value;
    let preco = document.getElementById("preco").value;
    let dataInput = document.getElementById("data").value; // Formato AAAA-MM-DD
    let horaInput = document.getElementById("hora").value;

    if (!nome || !dataInput || !horaInput) {
        return alert("Por favor, preencha Nome, Data e Hora.");
    }

    // --- SISTEMA DE TRAVA: DATA E HORA PASSADA ---
    const agora = new Date();
    const dataEscolhida = new Date(dataInput + 'T' + horaInput);
    const dataHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const dataSelecionadaApenas = new Date(dataEscolhida.getFullYear(), dataEscolhida.getMonth(), dataEscolhida.getDate());

    if (dataSelecionadaApenas < dataHoje) {
        alert("Não é possível agendar em dias passados!");
        return;
    }

    if (dataSelecionadaApenas.getTime() === dataHoje.getTime()) {
        const horaAtualEmMinutos = agora.getHours() * 60 + agora.getMinutes();
        const [horaSel, minSel] = horaInput.split(':').map(Number);
        const horaSelecionadaEmMinutos = horaSel * 60 + minSel;

        if (horaSelecionadaEmMinutos < horaAtualEmMinutos) {
            alert("Este horário já passou! Escolha um horário futuro.");
            return;
        }
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
        whats: whats,
        nome: nome,
        procedimento: procedimento,
        preco: preco,
        data: dataInput,
        hora: horaInput
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

    listaUsuarios.forEach((usuario, index) => {
        // --- CONVERSÃO PARA MODELO BRASILEIRO ---
        // Transforma "2026-04-17" em ["2026", "04", "17"] e inverte para "17/04/2026"
        const dataBr = usuario.data.split('-').reverse().join('/');

        const novoCard = document.createElement("div");
        novoCard.className = "card-agendamento"; 
        
        novoCard.innerHTML = `
            <div class="header">
                <div class="cliente-info">
                    <h2 class="nome">${usuario.nome.toUpperCase()}</h2>
                    <p class="detalhes">Data : ${dataBr}</p>
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
            <div class="acoes-principais">
                <button class="btn-cancelar" onclick="deletarCard(${index})">CANCELAR</button>
                <button class="btn-finalizar">FINALIZAR</button>
            </div>
             <button class="btn-reagendar">

                 Reagendar

            </button>
            <button class="btn-whatsapp" onclick="enviarWhatsapp(${index})">
            <i class="bi bi-whatsapp"></i> WHATSAPP
            </button>
        `;
        containerCards.appendChild(novoCard);
    });
}

function deletarCard(index) {
    let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];
    listaUsuarios.splice(index, 1);
    localStorage.setItem("meuBanco", JSON.stringify(listaUsuarios));
    renderizarCards();
}

function filtrarCards() {
    let input = document.getElementById("inputPesquisar");
    if (!input) return;

    let termoBusca = input.value.toLowerCase();
    let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];

    let listaFiltrada = listaUsuarios.filter(usuario => {
        // O filtro continua funcionando com a data original (AAAA-MM-DD) ou você pode adaptar se quiser
        return (
            usuario.nome.toLowerCase().includes(termoBusca) || 
            usuario.whats.includes(termoBusca) || 
            usuario.data.includes(termoBusca)
        );
    });

    renderizarCards(listaFiltrada);
}

// acrescenn=tando o numero do whatsapp no botão 

function enviarWhatsapp(index) {
    let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];
    let usuario = listaUsuarios[index];

    if (!usuario) return;

    // Remove caracteres não numéricos do telefone (deixa apenas números)
    let telefone = usuario.whats.replace(/\D/g, '');
    
    // Se o usuário não digitou o código do país (55), você pode adicionar:
    if (telefone.length <= 11) {
        telefone = "55" + telefone;
    }

    // Monta a mensagem personalizada
    let mensagem = `Olá, aqui é do salão welik , estou confirmando o seu agendamento :\n` +
                   `Cliente: ${usuario.nome}\n` +
                   `Data: ${usuario.data.split('-').reverse().join('/')}\n` +
                   `Hora: ${usuario.hora}h\n` +
                   `Serviço: ${usuario.procedimento}\n` +
                   `Valor: R$ ${usuario.preco}`;

    // Codifica a mensagem para o formato de URL
    let mensagemUrl = encodeURIComponent(mensagem);

    // Abre o link em uma nova aba
    window.open(`https://wa.me/${telefone}?text=${mensagemUrl}`, '_blank');
}

// adicionar procedimento

function adProcedimento(){
    
}