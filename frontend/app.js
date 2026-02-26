//-----------------------------------------
// タブ切り替えタスク&タイマー
//-----------------------------------------
const navTasksBtn = document.getElementById("nav-tasks")
const navTimerBtn = document.getElementById("nav-timer")
const pageTimer = document.getElementById("page-timer")
const pageTasks = document.getElementById("page-tasks")

navTasksBtn.addEventListener("click", () => {
    pageTasks.classList.add("page--active")
    pageTimer.classList.remove("page--active")
    navTasksBtn.classList.add("nav__button--active")
    navTimerBtn.classList.remove("nav__button--active")
})
navTimerBtn.addEventListener("click", () => {
    pageTimer.classList.add("page--active")
    pageTasks.classList.remove("page--active")
    navTimerBtn.classList.add("nav__button--active")
    navTasksBtn.classList.remove("nav__button--active")
})

//------------------------
//------------------------
// タイマー定義
//------------------------
//------------------------


//------------------------
//要素取得
//------------------------
const timerDisplay = document.getElementById("timer-time") //時刻表示
const timerStatus = document.getElementById("timer-status")
const playPauseBtn = document.getElementById("playpause-button")
const resetBtn = document.getElementById("reset-button")
const timerSettingsDiv = document.getElementById("timer-settigs-div")
const workInput = document.getElementById("work-input")
const breakInput = document.getElementById("break-input")
//------------------------
// 状態
//------------------------
let isRunning = "stopped" // "running" | "stopped" | "paused"
let mode = "work" // "work" | "break"

//------------------------
//グローバル変数定義
//------------------------
let endTime = null
let pauseStartTime = null
let pauseFinishTime = null
/**@type {"running" | "stopped" | "paused"} */
let intervalId = null //setIntervalを行った際の処理ID
let minutes = null

//----------------------------------
// 初期設定
//----------------------------------
minutes = 25
timerDisplay.textContent = formatTime(minutes * 60)
workInput.value = 25
breakInput.value = 5

//----------------------------------
// ロジック関数定義
//----------------------------------
//時刻整形
function formatTime(totalSeconds) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
  const secs = String(totalSeconds % 60).padStart(2, "0")
  return mins + ":" + secs
}
//タイマー開始
function startTimer() {
    intervalId = setInterval(() => {
        const remaining = Math.floor((endTime - Date.now()) / 1000)
        if (remaining <= 0) {
            clearInterval(intervalId)
            // 作業時間が終わったとき
            if (mode == "work"){
                mode = "break"
                minutes = Number(breakInput.value)
            } 
            // 休憩時間が終わったとき
            else {
                mode = "work"
                minutes = Number(workInput.value)
            }
            updateStatus()
            endTime = Date.now() + minutes * 60 * 1000
            startTimer()
            return
        }
        timerDisplay.textContent = formatTime(remaining)
    }, 100)
}

//状態切り替え
function updateStatus() {
    if (isRunning === "paused") {
        timerStatus.textContent = "一時停止"
    } else if (mode == "work") {
        timerStatus.textContent = "作業中"
    } else {
        timerStatus.textContent = "休憩中"
    }
}

//ボタン切り替え(再生/一時停止)
function updateButton() {
  playPauseBtn.classList.remove("timer__button--play", "timer__button--pause")

  if (isRunning === "running") {
    playPauseBtn.classList.add("timer__button--pause")
  } else {
    playPauseBtn.classList.add("timer__button--play")
  }
}
//入力制御
function updateInputs() {
  const disabled = isRunning === "running" || isRunning === "paused"
  workInput.disabled = disabled
  breakInput.disabled = disabled
  if (disabled) {
    timerSettingsDiv.classList.add("timer__settings--disabled")
  } else {
    timerSettingsDiv.classList.remove("timer__settings--disabled")
  }
}


//-----------------------------------------
// スタートボタン
//-----------------------------------------
const playPause = () => {
    // 停止中の場合
    if (isRunning == "stopped") {
        //作動中フラグをオンにし終了時刻を取得
        isRunning = "running"
        endTime = Date.now() + minutes * 60 * 1000
        // 0.1秒ごとに残り時間を計算し画面に反映(setIntervalIdでブラウザに処理内容を登録)
        startTimer()
    }
    // 作動中の場合
    else if (isRunning == "running") {
        //作動中フラグをオフ
        isRunning = "paused"
        pauseStartTime = Date.now() // ポーズ開始時刻を取得
        clearInterval(intervalId)
    }
    // 一時停止中の時の場合
    else if (isRunning == "paused") {
        isRunning = "running"
        pauseFinishTime = Date.now()// ポーズ終了時刻を取得
        endTime = endTime + (pauseFinishTime - pauseStartTime)
        // 0.1秒ごとに残り時間を計算し画面に反映(setIntervalIdでブラウザに処理内容を登録)
        startTimer()
    }
    updateButton()
    updateInputs()
    updateStatus()
}
playPauseBtn.addEventListener("click",playPause)

//-----------------------------------------
// リセットボタン
//-----------------------------------------
const reset = () => {
    timerStatus.textContent = " "
    //作動中なら作動中フラグをオフにする
    isRunning = "stopped"
    mode = "work"
    minutes = Number(workInput.value)
    clearInterval(intervalId)
    timerDisplay.textContent = formatTime(minutes * 60)
    updateButton()
    updateInputs()
}
resetBtn.addEventListener("click",reset)

//-----------------------------------------
// タイマーセットボタン
//-----------------------------------------
const workInputSet = () =>{
    minutes = Number(workInput.value)
    timerDisplay.textContent = formatTime(minutes * 60)
}
workInput.addEventListener("input",workInputSet)

// Enter押したらonBlur
const blurOnEnter = (e) => {
  if (e.key === "Enter") {
    e.target.blur()
  }
}
workInput.addEventListener("keydown", blurOnEnter)
breakInput.addEventListener("keydown", blurOnEnter)
// クリックしたら全選択
const selectOnFocus = (e) => e.target.select()
workInput.addEventListener("focus", selectOnFocus)
breakInput.addEventListener("focus", selectOnFocus)

//------------------------
//------------------------
// タスク定義
//------------------------
//------------------------
const addInput = document.getElementById("add-input")
const todoList = document.getElementById("todo-list")

addInput.addEventListener("keydown",(e) =>{
    if(!addInput.value) return
    if(e.key === "Enter" ) {
        //リスト要素作成
        const li = document.createElement("li")
        li.className = "task-item"
        //✓ボックス
        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.className = "task-checkbox"
        checkbox.addEventListener("change", () => {
            li.classList.toggle("task-item--done", checkbox.checked)
        })
        // テキスト
        const span = document.createElement("span")
        span.textContent = addInput.value
        span.className = "task-text"
        // 削除ボタン
        const button = document.createElement("button")
        button.textContent = "×"
        button.className = "task-delete"
        button.addEventListener("click",() => {
            li.remove()
        })
        //タスク要素に紐づけ
        li.appendChild(checkbox)
        li.appendChild(span)
        li.appendChild(button)
        todoList.appendChild(li)
        addInput.value = ""
    }
})