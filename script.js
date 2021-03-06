"use strict";

/////////////////////////////////////////////////
// BANKIST APP

// Dados das contas
const c1 = {
    nome: 'Ivander Carlos Dias',
    movimentos: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    rendimento: 1.2, // %
    pin: 1111,
    movimentosDatas: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-11-07T23:36:17.929Z',
        '2020-11-11T10:51:36.790Z',
    ],
    moeda: 'BRL',
    local: 'pt-BR',
};

const c2 = {
    nome: 'Giovanna Bueno',
    movimentos: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    rendimento: 1.5,
    pin: 2222,
    movimentosDatas: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    moeda: 'USD',
    local: 'en-US',
};

const contas = [c1, c2];

// Elementos DOM
const labelWelcome = document.querySelector(".welcome");
const labelData = document.querySelector(".data");
const labelSaldo = document.querySelector(".saldo__valor");
const labelEntrada = document.querySelector(".sumario__valor--entrada");
const labelSaida = document.querySelector(".sumario__valor--saida");
const labelRendimento = document.querySelector(".sumario__valor--rendimento");
const labelTimer = document.querySelector(".timer__clock");

const containerApp = document.querySelector(".app");
const containerMovimentos = document.querySelector(".movimentos");

const btnLogin = document.querySelector(".login__btn");
const btnTransferir = document.querySelector(".form__btn--transferir");
const btnEmprestar = document.querySelector(".form__btn--emprestar");
const btnEncerrar = document.querySelector(".form__btn--encerrar");
const btnOrdenar = document.querySelector(".btn--ordenar");

const inputLoginUsuario = document.querySelector(".login__input--usuario");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferirUsuario = document.querySelector(".form__input--transferir-usuario");
const inputTransferirValor = document.querySelector(".form__input--transferir-valor");
const inputEmprestarValor = document.querySelector(".form__input--emprestar-valor");
const inputEncerrarUsuario = document.querySelector(".form__input--encerrar-usuario");
const inputEncerrarPin = document.querySelector(".form__input--encerrar-pin");

/////////////////////////////////////////////////
// Variáveis globais utilizadas
let contaAtiva;

// Atualiza UI
const atualizaUI = function(arr) {
    // exibe movimentação
    displayMovimentos(arr); 
    // exibe saldo
    calcDisplaySaldo(arr);
    // exibe sumário
    calcDisplaySumario(arr); 
}

// Define um usuário para cada contas
const defineUsuario = function(arr) {
    arr.forEach(conta => conta.usuario = conta.nome.toLowerCase().split(" ")[0]);
};
defineUsuario(contas);

// Função datas
const formataData = function(data) {
    // calcula a diferença entre duas datas
    const calcDiasPassados = (data1, data2) => Math.round(Math.abs((data2 - data1) / (1000 * 60 * 60 * 24)));
    const diasPassados = calcDiasPassados(new Date(), data);
    // exibe data movimentação
    if (diasPassados === 0) return "Hoje";
    if (diasPassados === 1) return "Ontem";
    if (diasPassados <= 7) return `${diasPassados} dias atrás`;
    const ano = data.getFullYear();
    const mes = `${data.getMonth() + 1}`.padStart(2, "0");
    const dia = `${data.getDate()}`.padStart(2, "0");
    return `${dia}/${mes}/${ano}`;
}

// Formatar número
const formataNumeros = function(valor, local, moeda) {
    return new Intl.NumberFormat(local, {
    style: "currency",
    currency: moeda,
    }).format(valor);
};

// Login
btnLogin.addEventListener("click", function(e) {
    // não deixa realizar o submit no form
    e.preventDefault();
    // verifica input usuario
    contaAtiva = contas.find(conta => conta.usuario === inputLoginUsuario.value);
    // verifica input pin
    if (contaAtiva?.pin === Number(inputLoginPin.value)) {
        // mensagem boas vindas
        labelWelcome.textContent = `Seja bem-vindo, ${contaAtiva.nome.split(" ")[0]}!`;
        // exibe a data atual
        const dataAtual = new Date();
        const ano = dataAtual.getFullYear();
        const mes = `${dataAtual.getMonth() + 1}`.padStart(2, "0");
        const dia = `${dataAtual.getDate()}`.padStart(2, "0");
        const hora = `${dataAtual.getHours()}`.padStart(2, "0");
        const minuto = `${dataAtual.getMinutes()}`.padStart(2, "0");
        labelData.textContent = `${dia}/${mes}/${ano}, ${hora}:${minuto}`;
        // limpa os inputs
        inputLoginUsuario.value = inputLoginPin.value = "";
        inputLoginUsuario.blur();
        inputLoginPin.blur();
        // exibe conteúdo app
        containerApp.style.opacity = 1;
        // atualiza UI
        atualizaUI(contaAtiva);
    }
});

// Mostra a movimentação da conta
const displayMovimentos = function(conta, ordem = false) {
    // zera todo conteudo dos movimentos
    containerMovimentos.innerHTML = "";
    // exibir na ordem desejada
    const movs = ordem ? contaAtiva.movimentos.slice().sort((a, b) => a - b) : contaAtiva.movimentos;
    // cria uma nova linha para cada movimento existente
    movs.forEach((movimento, i) => {
        const tipo = movimento > 0 ? "entrada" : "saida";
        // recebe a data e formata para exibição
        const data = new Date(contaAtiva.movimentosDatas[i]);
        const dataMovimentacao = formataData(data);
        // cria as rows com os movimentos
        const movimentoItemHTML = `
            <div class="movimentos__item">
                <div class="movimentos__tipo movimentos__tipo--${tipo}">${i + 1}. ${tipo}</div>
                <div class="movimentos__data">${dataMovimentacao}</div>
                <div class="movimentos__valor">${formataNumeros(movimento, contaAtiva.local, contaAtiva.moeda)}</div>
            </div>
        `;
        // insere a nova linha no HTML
        containerMovimentos.insertAdjacentHTML("afterbegin", movimentoItemHTML);
    });
};

// Calcula e exibe o saldo da conta
const calcDisplaySaldo = function(conta) {
    conta.saldo = conta.movimentos.reduce((total, item) => total + item, 0);
    labelSaldo.textContent = formataNumeros(conta.saldo, conta.local, conta.moeda);
};

// Calcula e exige as estatísticas da conta
const calcDisplaySumario = function(conta) {
    // exibe soma depósitos
    const entrada = conta.movimentos.filter(movimento => movimento > 0).reduce((total, movimento) => total + movimento, 0);
    labelEntrada.textContent = formataNumeros(entrada, conta.local, conta.moeda); 
    // exibe soma saques
    const saida = conta.movimentos.filter(movimento => movimento < 0).reduce((total, movimento) => total + movimento, 0);
    labelSaida.textContent = formataNumeros(Math.abs(saida), conta.local, conta.moeda); 
    // exibe rendimento que a conta irá ganhar com os depósitos
    const rendimento = conta.movimentos.filter(entrada => entrada > 0).map(entrada => (entrada * conta.rendimento) / 100).filter(entrada => entrada >= 1).reduce((total, entrada) => total + entrada, 0);
    labelRendimento.textContent = formataNumeros(rendimento, conta.local, conta.moeda); 
};

// Transferir para outra conta
btnTransferir.addEventListener("click", function(e) {
    e.preventDefault();
    // recebe informações dos inputs
    const valor = Number(inputTransferirValor.value);
    const receberTransferencia = contas.find(conta => conta.usuario === inputTransferirUsuario.value);
    // verifica se será possivel transferir
    if (valor > 0 && valor <= contaAtiva.saldo && receberTransferencia && receberTransferencia !== contaAtiva) {
        // debita e credita os valores nas contas
        contaAtiva.movimentos.push(-valor);
        receberTransferencia.movimentos.push(valor);
        // cria a data da transferencia
        contaAtiva.movimentosDatas.push(new Date().toISOString());
        receberTransferencia.movimentosDatas.push(new Date().toISOString());
        // atualiza UI
        atualizaUI(contaAtiva);
    }
    // limpa os inputs
    inputTransferirUsuario.value = inputTransferirValor.value = "";
});

// Empréstimo
btnEmprestar.addEventListener("click", function(e) {
    e.preventDefault();
    const valor = Math.floor(inputEmprestarValor.value);
    if (valor <= contaAtiva.saldo * 0.1) {
        // cria um delay de 4seg para aprovar o empréstimo
        setTimeout(function () {
            contaAtiva.movimentos.push(valor);
            contaAtiva.movimentosDatas.push(new Date().toISOString());
            // cria a data do empréstimo
            atualizaUI(contaAtiva);
        }, 4000);
    }
    // limpa os inputs
    inputEmprestarValor.value = "";
});

// Encerrar conta
btnEncerrar.addEventListener("click", function(e) {
    e.preventDefault();
    // verifica se a conta a excluir é a mesma da conta que esta ativa/logada
    if (contaAtiva.usuario === inputEncerrarUsuario.value && contaAtiva.pin === Number(inputEncerrarPin.value)) {
        // encontra o index da conta no array contas e depois exclui
        const apagar = contas.findIndex(conta => conta.usuario === contaAtiva.usuario);
        contas.splice(apagar, 1);
        // oculta conteúdo app
        containerApp.style.opacity = 0;
        // limpa os inputs
        inputEncerrarUsuario.value = inputEncerrarPin.value = "";
    }
});

let ordem = false;
// Ordenar os movimentos
btnOrdenar.addEventListener("click", function(e) {
    e.preventDefault();
    displayMovimentos(contaAtiva, !ordem)
    ordem = !ordem;
});