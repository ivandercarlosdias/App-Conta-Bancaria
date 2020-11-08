"use strict";

/////////////////////////////////////////////////
// BANKIST APP

// Dados das contas
const conta1 = {
    nome: "Jonas Schmedtmann",
    movimentos: [200, 450, -400, 3000, -650, -130, 70, 1300],
    taxaJuros: 1.2, // %
    usuario: "jonas",
    pin: 1111,
};

const conta2 = {
    nome: "Jessica Davis",
    movimentos: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    taxaJuros: 1.5,
    usuario: "jessica",
    pin: 2222,
};

const conta3 = {
    nome: "Steven Thomas Williams",
    movimentos: [200, -200, 340, -300, -20, 50, 400, -460],
    taxaJuros: 0.7,
    pin: 3333,
};

const conta4 = {
    nome: "Sarah Smith",
    movimentos: [430, 1000, 700, 50, 90],
    taxaJuros: 1,
    pin: 4444,
};

const conta5 = {
    nome: "Ivander Dias",
    movimentos: [10, 20, 500, -50, 35],
    taxaJuros: 1,
    pin: 5555,
};

const conta6 = {
    nome: "Giovanna Bueno",
    movimentos: [1, 1.50, -50, -100, -300],
    taxaJuros: 1.2,
    pin: 6666,
};

const contas = [conta1, conta2, conta3, conta4, conta5, conta6];

// Elementos DOM
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelSaldo = document.querySelector(".saldo__valor");
const labelEntrada = document.querySelector(".sumario__valor--entrada");
const labelSaida = document.querySelector(".sumario__valor--saida");
const labelJuros = document.querySelector(".sumario__valor--juros");
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

const atualizaUI = function(conta) {
    // exibe movimentação
    displayMovimentos(conta.movimentos); 
    // exibe saldo
    calcDisplaySaldo(conta);
    // exibe sumário
    calcDisplaySumario(conta); 
}

// Define um usuário para cada contas
const defineUsuario = function(contas) {
    contas.forEach(function(conta) {
        conta.usuario = conta.nome.toLowerCase().split(" ")[0];
    });
};
defineUsuario(contas);

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
const displayMovimentos = function(movimentos) {
    // zera todo conteudo dos movimentos
    containerMovimentos.innerHTML = "";
    // cria uma nova linha para cada movimento existente
    movimentos.forEach((value, i) => {
        const tipo = value > 0 ? "entrada" : "saida";
        const movimentoItemHTML = `
            <div class="movimentos__item">
                <div class="movimentos__tipo movimentos__tipo--${tipo}">${i + 1}: ${tipo}</div>
                <div class="movimentos__data">3 dias atrás</div>
                <div class="movimentos__valor">${value}</div>
            </div>
        `;
        // insere a nova linha no HTML
        containerMovimentos.insertAdjacentHTML("afterbegin", movimentoItemHTML);
    });
};

// Calcula e exibe o saldo da conta
const calcDisplaySaldo = function(conta) {
    conta.saldo = conta.movimentos.reduce((total, item) => total + item, 0);
    labelSaldo.textContent = `R$ ${conta.saldo}`;
};

// Calcula e exige as estatiscas da conta
const calcDisplaySumario = function(conta) {
    // exibe soma depósitos
    const entrada = conta.movimentos.filter(movimento => movimento > 0).reduce((total, movimento) => total + movimento, 0);
    labelEntrada.textContent = `R$ ${entrada}`; 
    // exibe soma saques
    const saida = conta.movimentos.filter(movimento => movimento < 0).reduce((total, movimento) => total + movimento, 0);
    labelSaida.textContent = `R$ ${Math.abs(saida)}`; 
    // exibe juros que ganhou com os depósitos
    const juros = conta.movimentos.filter(entrada => entrada > 0).map(entrada => (entrada * conta.taxaJuros) / 100).filter(entrada => entrada >= 1).reduce((total, entrada) => total + entrada, 0);
    labelJuros.textContent = `R$ ${juros}`; 
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
        receberTransferencia.movimentos.push(valor);
        contaAtiva.movimentos.push(-valor);
        // atualiza UI
        atualizaUI(contaAtiva);
    }
    // limpa os inputs
    inputTransferirUsuario.value = inputTransferirValor.value = "";
    inputTransferirUsuario.blur();
    inputTransferirValor.blur();
});

// Empréstimo
btnEmprestar.addEventListener("click", function(e) {
    e.preventDefault();
});

// Encerrar conta
btnEncerrar.addEventListener("click", function(e) {
    e.preventDefault();
    // verifica se a conta a excluir é a mesma da conta que esta ativa/logada
    if (contaAtiva.usuario === inputEncerrarUsuario.value && contaAtiva.pin === Number(inputEncerrarPin.value)) {
        console.log("Conta excluída!");
        // encontra o index da conta no array contas e depois exclui
        const apagar = contas.findIndex(conta => conta.usuario === contaAtiva.usuario);
        contas.splice(apagar, 1);
        // oculta conteúdo app
        containerApp.style.opacity = 0;
        // limpa os inputs
        inputEncerrarUsuario.value = inputEncerrarPin.value = "";
        inputEncerrarUsuario.blur();
        inputEncerrarPin.blur();
    }
});