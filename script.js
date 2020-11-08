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
    usuario: "steven",
    pin: 3333,
};

const conta4 = {
    nome: "Sarah Smith",
    movimentos: [430, 1000, 700, 50, 90],
    taxaJuros: 1,
    usuario: "sarah",
    pin: 4444,
};

const conta5 = {
    nome: "Ivander Dias",
    movimentos: [10, 20, 500, -50, 35],
    taxaJuros: 1,
    usuario: "ivander",
    pin: 5555,
};

const contas = [conta1, conta2, conta3, conta4, conta5];

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
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsuario = document.querySelector(".login__input--usuario");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Variáveis globais utilizadas
let usuarioAtivo;

// Login
btnLogin.addEventListener("click", function (e) {
    // não deixa realizar o submit no form
    e.preventDefault();

    // verifica input usuario
    usuarioAtivo = contas.find(conta => conta.usuario === inputLoginUsuario.value);
    console.log(usuarioAtivo);
    
    // verifica input pin
    if (usuarioAtivo?.pin === Number(inputLoginPin.value)) {
        // mensagem boas vindas
        labelWelcome.textContent = `Seja bem-vindo, ${usuarioAtivo.nome.split(" ")[0]}!`;
        // limpa os inputs
        inputLoginUsuario.value = inputLoginPin.value = "";
        inputLoginUsuario.blur();
        inputLoginPin.blur();
        // exibe conteúdo app
        containerApp.style.opacity = 1;
        // exibe movimentação
        displayMovimentos(usuarioAtivo.movimentos); 
        // exibe saldo
        calcDisplaySaldo(usuarioAtivo.movimentos);
        // exibe sumário
        calcDisplaySumario(usuarioAtivo); 
    }
});

// Mostra a movimentação da conta
const displayMovimentos = function (movimentos) {
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
const calcDisplaySaldo = function (movimentos) {
    const saldo = movimentos.reduce((total, item) => total + item, 0);
    labelSaldo.textContent = `R$ ${saldo}`;
};

// Calcula e exige as estatiscas da conta
const calcDisplaySumario = function (conta) {
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