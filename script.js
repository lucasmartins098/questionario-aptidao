let questionarioAtual = 'ministerial';

function trocarQuestionario() {
    // Oculta todas as instruções primeiro
    document.getElementById('instrucoes-ministerial').style.display = 'none';
    document.getElementById('instrucoes-redentivo').style.display = 'none';
    document.getElementById('instrucoes-motivacional').style.display = 'none';
    
    // Troca para o próximo questionário
    switch(questionarioAtual) {
        case 'ministerial':
            questionarioAtual = 'redentivo';
            document.getElementById('tituloQuestionario').textContent = 'Questionário de Dons Redentivos';
            document.getElementById('instrucoes-redentivo').style.display = 'block';
            break;
        case 'redentivo':
            questionarioAtual = 'motivacional';
            document.getElementById('tituloQuestionario').textContent = 'Questionário de Dons Motivacionais';
            document.getElementById('instrucoes-motivacional').style.display = 'block';
            break;
        case 'motivacional':
            questionarioAtual = 'ministerial';
            document.getElementById('tituloQuestionario').textContent = 'Questionário de Dons Ministeriais';
            document.getElementById('instrucoes-ministerial').style.display = 'block';
            break;
    }
    
    // Atualiza as questões
    carregarQuestoes();
    
    // Limpa os resultados anteriores
    document.getElementById('resultados').classList.add('hidden');
    document.getElementById('questionarioForm').reset();
}

function carregarQuestoes() {
    const questoesContainer = document.getElementById('questoes');
    let questoes;
    
    switch(questionarioAtual) {
        case 'ministerial':
            questoes = questoesDonsMinisteriais;
            break;
        case 'redentivo':
            questoes = questoesRedentivas;
            break;
        case 'motivacional':
            questoes = questoesMotivacionais;
            break;
    }
    
    questoesContainer.innerHTML = '';
    
    questoes.forEach((questao, index) => {
        const questaoDiv = document.createElement('div');
        questaoDiv.className = 'questao';
        
        let opcoesHtml = '';
        
        // Define as opções baseado no tipo de questionário
        if (questionarioAtual === 'redentivo') {
            opcoesHtml = `
                <div class="radio-group">
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="1" id="q${index + 1}_1" required><label for="q${index + 1}_1">Nunca</label></div>
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="2" id="q${index + 1}_2" required><label for="q${index + 1}_2">Às Vezes</label></div>
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="3" id="q${index + 1}_3" required><label for="q${index + 1}_3">Na Maioria das Vezes</label></div>
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="4" id="q${index + 1}_4" required><label for="q${index + 1}_4">Sempre</label></div>
                </div>`;
        } else {
            // Para ministerial e motivacional (escala 0-5)
            opcoesHtml = `
                <div class="radio-group">
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="0" id="q${index + 1}_0" required><label for="q${index + 1}_0">Nunca</label></div>
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="1" id="q${index + 1}_1" required><label for="q${index + 1}_1">Raramente</label></div>
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="2" id="q${index + 1}_2" required><label for="q${index + 1}_2">Às Vezes</label></div>
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="3" id="q${index + 1}_3" required><label for="q${index + 1}_3">Usualmente</label></div>
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="4" id="q${index + 1}_4" required><label for="q${index + 1}_4">Na Maioria das Vezes</label></div>
                    <div class="radio-option"><input type="radio" name="q${index + 1}" value="5" id="q${index + 1}_5" required><label for="q${index + 1}_5">Sempre</label></div>
                </div>`;
        }
        
        questaoDiv.innerHTML = `
            <p>${questao}</p>
            ${opcoesHtml}
        `;
        
        questoesContainer.appendChild(questaoDiv);
    });
}

// Inicializa o questionário quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    carregarQuestoes();
    document.getElementById('questionarioForm').addEventListener('submit', calcularResultados);
});

function calcularResultados(event) {
    event.preventDefault();
    
    let dons;
    switch(questionarioAtual) {
        case 'ministerial':
            dons = donsMinisteriais;
            break;
        case 'redentivo':
            dons = donsRedentivos;
            break;
        case 'motivacional':
            dons = donsMotivacionais;
            break;
    }
    
    const resultados = {};
    
    for (let dom in dons) {
        resultados[dom] = 0;
        dons[dom].forEach(questao => {
            const resposta = document.querySelector(`input[name="q${questao}"]:checked`);
            if (resposta) {
                resultados[dom] += parseInt(resposta.value);
            }
        });
    }
    
    mostrarResultados(resultados);
}

function mostrarResultados(resultados) {
    const resultadosDiv = document.getElementById('resultados');
    const graficoDiv = document.getElementById('graficoDons');
    const interpretacaoDiv = document.getElementById('interpretacao');
    
    resultadosDiv.classList.remove('hidden');
    graficoDiv.innerHTML = '';
    interpretacaoDiv.innerHTML = '';
    
    // Calcula a pontuação máxima possível para cada tipo de questionário
    let maxPontuacao;
    switch(questionarioAtual) {
        case 'redentivo':
            maxPontuacao = 13 * 4; // 13 questões por dom, máximo 4 pontos cada
            break;
        case 'motivacional':
            maxPontuacao = 20 * 5; // 20 questões por dom, máximo 5 pontos cada
            break;
        default:
            maxPontuacao = 5 * 5; // 5 questões por dom, máximo 5 pontos cada
    }
    
    for (let dom in resultados) {
        const pontuacao = resultados[dom];
        const porcentagem = (pontuacao / maxPontuacao) * 100;
        
        graficoDiv.innerHTML += `
            <div style="margin: 10px 0;">
                <strong>${dom}:</strong> ${pontuacao} pontos
                <div style="background-color: #eee; height: 20px; border-radius: 10px;">
                    <div style="background-color: #2ecc71; height: 100%; width: ${porcentagem}%; border-radius: 10px;"></div>
                </div>
            </div>
        `;
    }
    
    const maiorPontuacao = Math.max(...Object.values(resultados));
    const donsDestacados = Object.entries(resultados)
        .filter(([_, pontuacao]) => pontuacao === maiorPontuacao)
        .map(([dom, _]) => dom);
    
    interpretacaoDiv.innerHTML = `
        <h3>Interpretação</h3>
        <p>Seus dons mais evidentes são: ${donsDestacados.join(', ')}</p>
        <p>Pontuação máxima alcançada: ${maiorPontuacao} pontos</p>
    `;
}