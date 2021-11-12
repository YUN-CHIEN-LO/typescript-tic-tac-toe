// 格子狀態
enum State {
  circle = 1,
  cross = -1,
  empty = 0,
}

// 勝利條件
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

// 紀錄遊戲狀態
let myBoard = <number[]>[];
// 紀錄玩家腳色
let isCirlce = true as boolean;
// 紀錄點擊(下棋)次數
let clickCount = 0 as number;

/**
 * 渲染遊戲
 *
 * @param {boolean} clickable - 是否開放點擊
 */
const renderBoard = function (clickable: boolean) {
  const boardDOM = document.getElementById("board") as HTMLElement;
  // 清空DOM
  boardDOM.innerHTML = "";

  myBoard.forEach((x, id) => {
    let target = null as any;
    // 判斷要插入的template是[圈圈]、[叉叉]還是[空白]
    switch (x) {
      case State.empty:
        target = document
          .getElementsByTagName("template")[0]
          .content.cloneNode(true);
        break;
      case State.circle:
        target = document
          .getElementsByTagName("template")[1]
          .content.cloneNode(true);
        break;
      case State.cross:
        target = document
          .getElementsByTagName("template")[2]
          .content.cloneNode(true);
        break;
      default:
        throw new Error("[INVALID STATE]");
        break;
    }

    const targetDOM = target.querySelector("div") as HTMLElement;
    // 賦予 data-number
    targetDOM.dataset.number = id.toString();
    // 掛hover樣式
    if (checkEmpty()) {
      targetDOM.classList.add("is-cross");
    } else if (myBoard[id] === State.empty && clickable) {
      const className = isCirlce ? "is-circle" : "is-cross";
      targetDOM.classList.add(className);
    }
    // 插入DOM元件
    boardDOM?.appendChild(target);
  });

  // 掛載點擊監聽
  if (clickable) {
    for (let i = 0; i < 9; i++) {
      const target = document.getElementsByClassName("board__block")[
        i
      ] as HTMLElement;
      target.onclick = () => {
        setState(target.dataset.number);
        // 換玩家
        isCirlce = !isCirlce;
        clickCount++;
      };
    }
  }
};

/**
 * 點擊事件
 *
 * @param {string | undefined} number - 點擊的 DOM data-number
 * @returns {null} 返回空值
 */
const setState = function (number: string | undefined) {
  // 若DOM元件不擁有 data-number
  if (number === undefined) return;

  const index = parseInt(number);
  // 若此格不為空
  if (myBoard[index] !== State.empty) return;

  // 賦值給此格
  myBoard[index] = isCirlce ? State.circle : State.cross;

  // 渲染遊戲，開啟點擊
  renderBoard(true);

  // 判斷是否填滿(平手)
  if (clickCount >= 8) {
    setGame(State.empty);
    return;
  }

  // 判斷是否連成線
  const hasLine = checkLine();
  if (hasLine === 1) {
    setGame(State.circle);
    return;
  }
  if (hasLine === -1) {
    setGame(State.cross);
    return;
  }
};

/**
 * 判斷遊戲狀態
 *
 * @param {number | null} state 勝利狀態
 * - [1]：圈圈勝利
 * - [-1]：叉叉勝利
 * - [0]：平手
 * - [null]：重置遊戲
 */
const setGame = function (state: number | null) {
  const target = document.getElementById("winner") as HTMLElement;
  if (state === 1) {
    // 圈圈勝利
    target.innerText = "Circle Wins!";
  } else if (state === -1) {
    // 叉叉勝利
    target.innerText = "Cross Wins!";
  } else if (state === 0) {
    // 平手
    target.innerText = "It's a Draw!";
  } else {
    // 重置遊戲
    target.innerText = "TIC TAC TOE";
    myBoard = <number[]>[];
    clickCount = 0;
    for (let i = 0; i < 9; i++) {
      myBoard.push(State.empty);
    }
  }
  // 渲染遊戲，禁用點擊
  renderBoard(false);
};

/**
 * 檢查是否有連成線(勝利條件)
 *
 * @returns {number} 有線成立的狀態
 * - [1]：圈圈的線
 * - [-1]：叉叉的線
 * - [0]：沒有線
 */
const checkLine = function (): number {
  for (let i = 0; i < 8; i++) {
    const [a, b, c] = lines[i];
    const sum = myBoard[a] + myBoard[b] + myBoard[c];
    // 圈圈的線
    if (sum === 3) return 1;

    // 叉叉的線
    if (sum === -3) return -1;
  }
  // 沒有線
  return 0;
};

/**
 * 檢查遊戲是否為空
 *
 * @returns {boolean} 遊戲是否為空
 */
const checkEmpty = function (): boolean {
  let isEmpty = true;
  myBoard.forEach((x) => {
    if (x !== State.empty) isEmpty = false;
  });
  return isEmpty;
};

/**
 * 重製/初始遊戲
 */
const initBoard = function () {
  // 重製遊戲狀態
  setGame(null);
  // 渲染遊戲，開啟點擊監聽
  renderBoard(true);
};

/**
 * 開啟文件監聽
 */
document.addEventListener("DOMContentLoaded", function (event) {
  initBoard();
  const resetBtn = document.getElementById("reset") as HTMLElement;
  resetBtn.onclick = () => {
    initBoard();
  };
});
