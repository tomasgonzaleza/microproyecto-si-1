window.onload = function() {
  let usersLeaderboard = JSON.parse(localStorage.getItem("usersLeaderboard"));
  let listOfPlayers = [];
  let registerNewPlayerButton = document.querySelector("#registerPlayerButton");
  let startGameButton = document.querySelector("#startGameButton");
  let registeredUserList = document.querySelector("#registeredUserList");
  let leaderBoardTable = document.querySelector("#leaderBoardTable");
  let readyToStart = document.querySelector("#readyToStart");
  let boardSizeSelect = document.querySelector("#boardSizeSelect");
  let mainMenu = document.querySelector("#mainMenu");
  let bingoGame = document.querySelector("#bingoGame");
  let nextNumberButton = document.querySelector("#nextNumberButton");
  let userBingoTables = document.querySelector("#userBingoTables");
  let bingoNumberResults = document.querySelector("#bingoNumberResults");
  let turnsP = document.querySelector("#turns");

  let possibleBoardValues = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    [41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
  ];

  let turns = 0;
  let selectedBingoNumbers = [[], [], [], [], []];

  const appendElement = (parentElement, htmlElement, innerHtml, className) => {
    let newElement = document.createElement(htmlElement);
    newElement.innerHTML = innerHtml;
    newElement.className = className;
    parentElement.appendChild(newElement);
  };

  const setLeaderboard = () => {
    let _count = 1;
    if (!usersLeaderboard) return;

    for (let user of usersLeaderboard) {
      appendElement(
        leaderBoardTable,
        "tr",
        `<tr>${_count}</tr><tr>${user.username}</tr><tr>${user.victories}</tr>`,
        "table-row"
      );
      _count++;
    }
  };

  const addVictoryToLeaderboard = username => {
    let user = usersLeaderboard[username];
    if (!user) usersLeaderboard[username].victories = 0;
    usersLeaderboard[username].victories++;
  };

  const generateBingoBoards = size => {
    for (const player of listOfPlayers) {
      let bingoBoard = [];
      for (let i = 0; i < size; i++) {
        if (i > size) break;
        let numbers = [];
        for (let j = 0; j < size; j++) {
          if (j > size) break;
          let notDifferent = true;
          while (notDifferent) {
            let _randomNumber = Math.floor(Math.random() * 10);
            let bingoRandomNumber = possibleBoardValues[i][_randomNumber];
            if (!numbers.includes(bingoRandomNumber)) {
              numbers.push(bingoRandomNumber);
              notDifferent = false;
            }
          }
        }
        bingoBoard.push(numbers);
      }
      player["bingoBoard"] = bingoBoard;
    }
  };

  const readyToStartPlaying = () => {
    if (listOfPlayers.length < 4) return;
    registerNewPlayerButton.style.display = "none";
    readyToStart.style.display = "block";
  };

  const addNewUser = username => {
    let newUser = {
      bingoBoard: [],
      username
    };
    listOfPlayers.push(newUser);
    appendElement(registeredUserList, "LI", username, "list-item");
  };

  const showBingoTables = () => {
    let bingo = "BINGO";
    for (const player of listOfPlayers) {
      let tr = document.createElement("tr");
      for (let k = 0; k < listOfPlayers[0].bingoBoard.length; k++) {
        let td = document.createElement("td");
        td.innerHTML = bingo[k];
        tr.appendChild(td);
      }
      let table = document.createElement("TABLE");
      table.className = "user-bingo-table";
      table.appendChild(tr);
      let playerDiv = document.createElement("DIV");
      let h2 = document.createElement("h2");
      h2.innerHTML = player.username;
      playerDiv.appendChild(h2);
      for (let i = 0; i < player.bingoBoard.length; i++) {
        let tableRow = document.createElement("tr");
        for (let j = 0; j < player.bingoBoard[i].length; j++) {
          appendElement(
            tableRow,
            "TD",
            player.bingoBoard[i][j],
            "user-bingo-data"
          );
        }
        table.appendChild(tableRow);
      }
      playerDiv.appendChild(table);
      userBingoTables.appendChild(playerDiv);
    }
  };

  const generateNextNumber = () => {
    if (turns > 24) {
      alert("The game is over!");
      return;
    }
    let isDifferent = true;
    while (isDifferent) {
      let _randomLetter = Math.floor(Math.random() * 5);
      let _randomNumber = Math.floor(Math.random() * 10);
      let newValue = possibleBoardValues[_randomLetter][_randomNumber];

      if (!selectedBingoNumbers[_randomLetter].includes(newValue)) {
        selectedBingoNumbers[_randomLetter].push(newValue);
        isDifferent = false;
        let bingoNumbers = bingoNumberResults.innerHTML;
        if (bingoNumbers == "") bingoNumbers += newValue;
        else bingoNumbers += `,${newValue}`;
        bingoNumberResults.innerHTML = bingoNumbers;
        turns++;
        turnsP.innerHTML = turns;
      }
    }
  };

  const showBingoSelectedNumbers = () => {};

  startGameButton.addEventListener("click", () => {
    let boardSize = boardSizeSelect.value;
    generateBingoBoards(boardSize);
    mainMenu.style.display = "none";
    bingoGame.style.display = "block";
    showBingoTables();
  });

  registerNewPlayerButton.addEventListener("click", () => {
    if (listOfPlayers.length > 3) {
      alert("There are already 4 members");
      return;
    }

    let newUser = prompt("Please add the name of the new user");
    addNewUser(newUser);

    if (listOfPlayers.length === 4) readyToStartPlaying();
  });

  nextNumberButton.addEventListener("click", () => {
    generateNextNumber();
  });

  setLeaderboard();
};
