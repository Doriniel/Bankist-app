'use strict';

// Account Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 21000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-06-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2022-08-05T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2021-10-18T21:31:17.178Z',
    '2021-10-23T07:42:02.383Z',
    '2021-11-28T09:15:04.904Z',
    '2022-01-01T10:17:24.185Z',
    '2022-01-08T14:11:59.604Z',
    '2022-02-27T17:01:17.194Z',
    '2022-03-11T23:36:17.929Z',
    '2022-04-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2021-10-01T21:31:17.178Z',
    '2021-10-12T07:42:02.383Z',
    '2021-12-14T09:15:04.904Z',
    '2022-01-04T10:17:24.185Z',
    '2022-01-21T14:11:59.604Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
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

let currentAccount, timer;

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  // sorting logic:
  // with slice() making a copy of an array - not to mutate original:
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const date = new Date(account.movementsDates[i]);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);
    const displayDate = `${day}/${month}/${year}`;

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov}€</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((accum, el) => accum + el, 0);

  labelBalance.textContent = `${account.balance}€`;
};

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((acc, deposit) => acc + deposit, 0);

  labelSumIn.textContent = `${income.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(outcome).toFixed(2)}€`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// update UI:

const updateUI = function (acc) {
  // calculate and display summary:
  calcDisplaySummary(acc);

  // calculate and display balance:
  calcDisplayBalance(acc);

  //display money movements:
  displayMovements(acc);
};

// create username property for each account:
const createUsername = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsername(accounts);

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  // check if credentials are correct and get current account;
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // creating date:
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const day = `${now.getDate()}`.padStart(2, 0);
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message:
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // clear content of inputs (login):
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // set timer and check if only 1 timer at a time is existing:
    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOutTimer();

    // update UI:
    updateUI(currentAccount);
  }
});

// logging-out: hide UI and welcome message:
const hideUI = function () {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';
};

// functionality of transfer money:
// 0. check if recipient exists, it's not to itself, amount of money > 0 and <= balance,
// 1. add negative movement to current user;
// 2. add positive movement to recipient;
// 3. update UI and hide input values;

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const recievingAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmount = Number(inputTransferAmount.value);

  if (
    recievingAcc &&
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    currentAccount?.username !== inputTransferTo.value
  ) {
    inputTransferTo.value = inputTransferAmount.value = '';

    // doing the transfer:
    currentAccount.movements.push(-transferAmount);
    recievingAcc.movements.push(transferAmount);

    //adding transfer date to data:
    currentAccount.movementsDates.push(new Date().toISOString());
    recievingAcc.movementsDates.push(new Date().toISOString());

    // Update UI:
    updateUI(currentAccount);
    console.log(
      `Transfer to ${recievingAcc.owner} in amount of ${transferAmount} was made.`
    );

    // Reset timer - as an activity was made:
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// functionality to request a loan:
// flowchart - the account should have at least 1 deposit that is 10% more than loan amount.

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov > loanAmount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);

      // Reset timer - as an activity was made:
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});

// functionality of closing the account:

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // find index of accout to delete:
    let closedAccountIndex = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );

    // deleting the account from the array of accounts:
    accounts.splice(closedAccountIndex, 1);

    // hide Ui to log-out;

    hideUI();
    console.log(accounts);
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// sorting: if it's sorted - than display movements, if it is not sorted - 1) sort, 2) display movements;
// we need variable with state of sorting, outside of this function. and change it (true| false).

let stateSort = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault();

  displayMovements(currentAccount, !stateSort);
  stateSort = !stateSort;
});

const startLogOutTimer = function () {
  let timerMin = 10 * 60;

  const tick = function () {
    let min = String(Math.trunc(timerMin / 60)).padStart(2, 0);
    let sec = String(Math.trunc(timerMin % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (timerMin === 0) {
      clearInterval(timerFunc);
      hideUI();
    }

    timerMin--;
  };

  tick();

  const timerFunc = setInterval(tick, 1000);
  return timerFunc;
};

// Idea: to make a dialogue window when recepient of transfer do not exist?(input - button)
