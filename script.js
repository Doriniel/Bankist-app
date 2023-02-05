'use strict'

// Account Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// // // // // //

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements) {
    containerMovements.innerHTML = "";

    movements.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    })
}

const calcDisplayBalance = function (account) {
    account.balance = account.movements.reduce((accum, el) => accum + el, 0);

    labelBalance.textContent = `${account.balance}€`;
}


const calcDisplaySummary = function (account) {

    const income = account.movements.filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);

    const outcome = account.movements.filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);

    const interest = account.movements.filter(mov => mov > 0)
        .map(deposit => deposit * account.interestRate / 100)
        .reduce((acc, deposit) => acc + deposit, 0);

    labelSumIn.textContent = `${income}€`;
    labelSumOut.textContent = `${Math.abs(outcome)}€`;
    labelSumInterest.textContent = `${interest}€`;
}

// update UI:

const updateUI = function(acc) {

    // calculate and display summary:
    calcDisplaySummary(acc);

    // calculate and display balance:
    calcDisplayBalance(acc);

    //display money movements:
    displayMovements(acc.movements);
}


// create username property for each account:
const createUsername = function (accounts) {
    accounts.forEach(acc => {
        acc.username = acc.owner
            .toLowerCase()
            .split(" ")
            .map(word => word[0])
            .join("");
    })
}

createUsername(accounts);

let currentAccount;

btnLogin.addEventListener('click', function (event) {
    event.preventDefault();

    // check if credentials are correct and get current account;
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    
    if ( currentAccount?.pin === Number(inputLoginPin.value)) {

    //display UI and welcome message:
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;

    // clear content of inputs (login):
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // update UI:
    updateUI(currentAccount);
    }
})


// logging-out: hide UI and welcome message:
const hideUI = function(){
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
}

// let max = movements.reduce((accum, el) => (accum > el ? accum : el), movements[0]);
// console.log(max);

// functionality of transfer money:
// 0. check if recipient exists, it's not to itself, amount of money > 0 and <= balance, 
// 1. add negative movement to current user; 
// 2. add positive movement to recipient;
// 3. update UI and hide input values;

btnTransfer.addEventListener('click', function(event){
    event.preventDefault();

    const recievingAcc = accounts.find(acc => acc.username === inputTransferTo.value);
    const transferAmount = Number(inputTransferAmount.value);

    if (recievingAcc && 
        transferAmount > 0 &&
        transferAmount <= currentAccount.balance &&
        currentAccount?.username !== inputTransferTo.value) {
            
            inputTransferTo.value = inputTransferAmount.value = "";

            currentAccount.movements.push(-transferAmount);
            recievingAcc.movements.push(transferAmount);

            updateUI(currentAccount);
            console.log(`Transfer to ${recievingAcc.owner} in amount of ${transferAmount} was made.`)
    }
})

// functionality of closing the account:

btnClose.addEventListener('click', function(event) {
    event.preventDefault();

    if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {

        // find index of accout to delete:
        let closedAccountIndex = accounts.findIndex(acc => acc.username === inputCloseUsername.value);

        // deleting the account from the array of accounts:
        accounts.splice(closedAccountIndex, 1);

        // hide Ui to log-out;
    
        hideUI();
        console.log(accounts);
    }

    inputCloseUsername.value = inputClosePin.value = "";
})

// Idea: to make a dialogue window when recepient of transfer do not exist?(input - button)