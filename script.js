window.onload = function() {
    const hoje = new Date().toISOString().split("T")[0];
    const campoData = document.getElementById("data");
    if (campoData) {
        campoData.setAttribute("min", hoje);
    }
    renderizarCards();
};

function renderizarCards(listaParaExibir = null) {
    const containerCards = document.getElementById("card"); 
    if (!containerCards) return;

    containerCards.innerHTML = "";
    let listaUsuarios = listaParaExibir || JSON.parse(localStorage.getItem("meuBanco")) || [];
    
    listaUsuarios.forEach((usuario, index) => {
        // Na página de fila, geralmente queremos ver tudo, 
        // mas se quiser esconder os que foram marcados como oculto no temporário, 
        // descomente a linha abaixo:
        // if (!listaParaExibir && usuario.oculto === true) return;

        const dataBr = usuario.data.split('-').reverse().join('/');
        const novoCard = document.createElement("div");
        novoCard.className = "card-agendamento"; 
        
        let htmlServicos = "";
        if (usuario.servicos && Array.isArray(usuario.servicos)) {
            htmlServicos = usuario.servicos.map(s => `
                <div class="item-linha" style="display: flex; justify-content: space-between;">
                    <span>${s.nome.toUpperCase()}</span>
                    <span>R$ ${parseFloat(s.valor).toFixed(2).replace('.',',')}</span>
                </div>
            `).join('');
        } else {
            htmlServicos = `
                <div class="item-linha" style="display: flex; justify-content: space-between;">
                    <span>${usuario.procedimento.toUpperCase()}</span>
                    <span>R$ ${usuario.preco}</span>
                </div>`;
        }

        novoCard.innerHTML = `
            <div class="header" style="text-align: center;">
                <h2 class="nome" style="color: #f1960d;">${usuario.nome.toUpperCase()}</h2>
                <p class="detalhes">Data : ${dataBr}</p>
                <p class="horario" style="color: #5df312; font-weight: bold;">Hora : ${usuario.hora}h</p>
            </div>

            <div class="procedimentos-container" style="margin-top: 15px;">
                <p class="label-titulo" style="color: #4a90e2; font-size: 12px; font-weight: bold;">SERVIÇOS (NOTA FISCAL)</p>
                ${htmlServicos}
            </div>

            <div class="divisor-nota" style="border-top: 2px dashed rgba(255,255,255,0.2); margin: 15px 0;"></div>

            <div class="total-linha" style="display: flex; justify-content: space-between; font-weight: bold;">
                <span>TOTAL GERAL</span>
                <span style="color: #5df312;">R$ ${usuario.preco.replace('.', ',')}</span>
            </div>            
            
            <div class="acoes-principais" style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn-cancelar" onclick="deletarCard(${index})" style="flex: 1; background: #e74c3c; color: white; border-radius: 5px; padding: 8px; cursor: pointer;">CANCELAR</button>
                <button class="btn-finalizar" onclick="ocultarCard(${usuario.id})" style="flex: 1; background: #27ae60; color: white; border-radius: 5px; padding: 8px; cursor: pointer;">FINALIZAR</button>
            </div>

            <button class="btn-whatsapp" onclick="enviarWhatsapp(${index})" style="width: 100%; margin-top: 10px; background: #25d366; color: white; border-radius: 20px; padding: 10px; border: none; font-weight: bold; cursor: pointer;">
                <i class="bi bi-whatsapp"></i> WHATSAPP
            </button>
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

function deletarCard(index) {
    if(confirm("Deseja realmente EXCLUIR este agendamento da fila permanentemente?")) {
        let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];
        listaUsuarios.splice(index, 1);
        localStorage.setItem("meuBanco", JSON.stringify(listaUsuarios));
        renderizarCards();
    }
}

function enviarWhatsapp(index) {
    let listaUsuarios = JSON.parse(localStorage.getItem("meuBanco")) || [];
    let usuario = listaUsuarios[index];
    if (!usuario) return;

    let telefone = usuario.whats.replace(/\D/g, '');
    if (telefone.length <= 11) telefone = "55" + telefone;

    let mensagem = `Olá ${usuario.nome}, confirmamos seu agendamento para o dia ${usuario.data.split('-').reverse().join('/')} às ${usuario.hora}h.`;
    window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

//finalizar cards
function finalizarAgendamento(id) {
    let lista = JSON.parse(localStorage.getItem("meuBanco")) || [];
    const index = lista.findIndex(u => u.id === id);
    
    if (index !== -1) {
        lista[index].finalizado = true; // Marca como concluído
        lista[index].oculto = true;     // Esconde da fila
        localStorage.setItem("meuBanco", JSON.stringify(lista));
        renderizarCards(); // Atualiza a fila (o card some daqui)
    }
}