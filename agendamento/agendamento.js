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

    const nome = document.getElementById("nome").value;
    const whats = document.getElementById("whats").value;
    const dataInput = document.getElementById("data").value;
    const horaInput = document.getElementById("hora").value;

    let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];

    const conflito = listaUsuarios.find(u => u.data === dataInput && u.hora === horaInput && !u.oculto);
    if (conflito) {
        return alert(`Atenção: Já existe um agendamento para este horário com ${conflito.nome}.`);
    }

    const servicosInputs = document.querySelectorAll('.servico');
    const precosInputs = document.querySelectorAll('.preco');
    let listaDeServicos = [];
    let valorTotal = 0;

    servicosInputs.forEach((input, index) => {
        let nomeServico = input.value;
        let precoServico = parseFloat(precosInputs[index].value) || 0;
        if (nomeServico) {
            listaDeServicos.push({ nome: nomeServico, valor: precoServico });
            valorTotal += precoServico;
        }
    });

    if (!nome || !dataInput || !horaInput || listaDeServicos.length === 0) {
        return alert("Por favor, preencha todos os campos e ao menos um serviço.");
    }

    const novoUsuario = {
        id: Date.now(),
        whats: whats,
        nome: nome,
        servicos: listaDeServicos,
        preco: valorTotal.toFixed(2),
        data: dataInput,
        hora: horaInput,
        oculto: false
    };

    listaUsuarios.push(novoUsuario);
    localStorage.setItem("meuBanco", JSON.stringify(listaUsuarios));

    event.target.reset();
    // Limpa os campos extras de serviço se houver
    const container = document.getElementById('container-procedimentos');
    if (container) {
        container.innerHTML = `
            <input type="text" placeholder="Procedimento" class="servico" id="procedimento">
            <input type="number" placeholder="R$50" class="preco" id="preco" oninput="calcularTotalAutomatico()" required>
        `;
    }
    renderizarCards();
}

function renderizarCards(listaParaExibir = null) {
    const containerCards = document.getElementById("card");
    if (!containerCards) return;

    containerCards.innerHTML = "";
    let listaUsuarios = listaParaExibir || JSON.parse(localStorage.getItem("meuBanco")) || [];
    const agora = new Date().getTime();

    listaUsuarios.forEach((usuario) => {
        // Mantém suas regras de ocultar e tempo de 24h
        if (!listaParaExibir && usuario.oculto === true) return;
        if (!listaParaExibir && (agora - usuario.id > 86400000)) return;

        const novoCard = document.createElement("div");
        novoCard.className = "card-agendamento";

        // --- LÓGICA DE STATUS (CONVERSA ENTRE AS PÁGINAS) ---
        let textoStatus = "ADICIONADO À FILA";
        let corStatus = "#f39c12"; // Laranja original
        let iconeStatus = "bi-clock-history";

        if (usuario.finalizado === true) {
            textoStatus = "ATENDIMENTO FINALIZADO";
            corStatus = "#27ae60"; // Verde
            iconeStatus = "bi-check-circle-fill";
            novoCard.style.border = "2px solid #27ae60";
        } else if (usuario.cancelado === true) {
            textoStatus = "AGENDAMENTO CANCELADO";
            corStatus = "#e74c3c"; // Vermelho
            iconeStatus = "bi-x-circle-fill";
            novoCard.style.border = "2px solid #e74c3c";
        }
        // ---------------------------------------------------

        let htmlServicos = usuario.servicos.map(s => `
            <div class="item-linha" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #b0b0b0;">${s.nome.toUpperCase()}</span>
                <span style="color: #ffffff;">R$ ${parseFloat(s.valor).toFixed(2).replace('.', ',')}</span>
            </div>
        `).join('');

        novoCard.innerHTML = `
            <button class="btn-ocultar" onclick="ocultarCard(${usuario.id})">&times;</button>
            <div class="header" style="text-align: center; margin-bottom: 15px;">
                <h2 class="nome" style="color: #f1960d; font-size: 24px;">${usuario.nome.toUpperCase()}</h2>
                <p class="detalhes" style="color: #fff; font-size: 20px;">Data : ${usuario.data.split('-').reverse().join('/')}</p>
                <p class="horario" style="color: #5df312; font-size: 22px; font-weight: bold;">Hora : ${usuario.hora}h</p>
            </div>
            <div class="procedimentos-container" style="width: 100%; margin-top: 10px;">
                <p class="label-titulo" style="color: #4a90e2; font-size: 11px; font-weight: bold; margin-bottom: 10px;">SERVIÇOS (NOTA FISCAL)</p>
                ${htmlServicos}
            </div>
            <div class="divisor-nota" style="border-top: 2px dashed rgba(255,255,255,0.2); margin: 15px 0;"></div>
            <div class="total-linha" style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="font-size: 16px;">TOTAL GERAL</strong>
                <strong style="color: #5df312; font-size: 20px;">R$ ${usuario.preco.replace('.', ',')}</strong>
            </div>            
            <div class="container-status" style="margin-top: 20px; display: flex; justify-content: center;">
                <div class="status-fila" style="background-color: ${corStatus}; color: white; width: 100%; padding: 12px; border-radius: 25px; text-align: center; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="bi ${iconeStatus}"></i> ${textoStatus}
                </div>
            </div>
        `;
        containerCards.appendChild(novoCard);
    });
}






function ocultarCard(id) {
    let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];
    const index = listaUsuarios.findIndex(u => u.id === id);
    if (index !== -1) {
        listaUsuarios[index].oculto = true;
        localStorage.setItem("meuBanco", JSON.stringify(listaUsuarios));
        renderizarCards();
    }
}

function adicionarNovoServico() {
    const container = document.getElementById('container-procedimentos');
    const novaLinha = document.createElement('div');
    novaLinha.className = 'input-group'; // Mantendo a classe que você usa no CSS
    novaLinha.style.display = "flex";
    novaLinha.style.gap = "10px";
    novaLinha.style.marginTop = "10px";
    
    novaLinha.innerHTML = `
        <input type="text" placeholder="Procedimento" class="servico" style="flex: 1;">
        <input type="number" placeholder="R$" class="preco" oninput="calcularTotalAutomatico()" style="width: 80px;">
        <button type="button" onclick="this.parentElement.remove(); calcularTotalAutomatico();" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size: 20px;">&times;</button>
    `;
    container.appendChild(novaLinha);
}

function calcularTotalAutomatico() {
    const precos = document.querySelectorAll('.preco');
    let soma = 0;
    precos.forEach(input => {
        soma += parseFloat(input.value) || 0;
    });
    // Se você tiver um campo de total visível no formulário, pode atualizar aqui
    return soma;
}