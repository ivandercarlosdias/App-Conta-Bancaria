"use strict";

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: "Jonas Schmedtmann",
    movimentos: [200, 450, -400, 3000, -650, -130, 70, 1300],
    jurosRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: "Jessica Davis",
    movimentos: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    jurosRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: "Steven Thomas Williams",
    movimentos: [200, -200, 340, -300, -20, 50, 400, -460],
    jurosRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: "Sarah Smith",
    movimentos: [430, 1000, 700, 50, 90],
    jurosRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////

// TODO: Fazer fn que cria username para os usuarios

// Mostra a movimentação da conta
const displayMovimentos = function (movimentos) {
    containerMovimentos.innerHTML = "";
    movimentos.forEach(function (value, i) {
        const tipo = value > 0 ? "entrada" : "saida";
        const movimentoItemHTML = `
            <div class="movimentos__item">
                <div class="movimentos__tipo movimentos__tipo--${tipo}">${i + 1}: ${tipo}</div>
                <div class="movimentos__data">3 dias atrás</div>
                <div class="movimentos__valor">${value}</div>
            </div>
        `;
        containerMovimentos.insertAdjacentHTML("afterbegin", movimentoItemHTML);
    });
};
displayMovimentos(account1.movimentos);

// Calcula e exibe o saldo da conta
const calcDisplaySaldo = function (movimentos) {
    const saldo = movimentos.reduce(function (total, item) {
        return total + item;
    }, 0);
    labelSaldo.textContent = `R$ ${saldo}`;
};
calcDisplaySaldo(account1.movimentos);

// Calcula e exige as estatiscas da conta (tudo que foi creditado, debitado e os juros ganhos com os depositos)
const calcDisplaySumario = function (movimentos) {
    // Soma os depósitos
    const entrada = movimentos.filter(movimento => movimento > 0).reduce((total, movimento) => total + movimento, 0);
    labelEntrada.textContent = `R$ ${entrada}`;
    // Soma os saques
    const saida = movimentos.filter(movimento => movimento < 0).reduce((total, movimento) => total + movimento, 0);
    labelSaida.textContent = `R$ ${Math.abs(saida)}`;
    // Juros que irá ganhar com os depósitos
    const juros = movimentos.filter(entrada => entrada > 0).map(entrada => (entrada * 1.2) / 100).filter(entrada => entrada >= 1).reduce((total, entrada) => total + entrada, 0);
    labelJuros.textContent = `R$ ${juros}`;
};
calcDisplaySumario(account1.movimentos);