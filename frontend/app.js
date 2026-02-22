//------------------------
//要素取得
//------------------------
let timerDisplay = document.getElementById("timer-display") //時刻表示
const playPauseBtn = document.getElementById("playpause-button")
const resetBtn = document.getElementById("reset-button")
const workInput = document.getElementById("work-input")
const breakInput = document.getElementById("break-input")
const setBtn = document.getElementById("set-button")
//------------------------
// 状態
//------------------------
let isRunning = "stopped" //タイマー実行フラグ
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
function formatTime(totalSeconds) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
  const secs = String(totalSeconds % 60).padStart(2, "0")
  return mins + ":" + secs
}

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
            endTime = Date.now() + minutes * 60 * 1000
            startTimer()
            return
        }
        timerDisplay.textContent = formatTime(remaining)
    }, 100)
}

function updateButton() {
  playPauseBtn.classList.remove("timer__button--play", "timer__button--pause")

  if (isRunning === "running") {
    playPauseBtn.classList.add("timer__button--pause")
  } else {
    playPauseBtn.classList.add("timer__button--play")
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
}
playPauseBtn.addEventListener("click",playPause)

//-----------------------------------------
// リセットボタン
//-----------------------------------------
const reset = () => {
    //作動中なら作動中フラグをオフにする
    isRunning = "stopped"
    mode = "work"
    minutes = Number(workInput.value)
    clearInterval(intervalId)
    timerDisplay.textContent = formatTime(minutes * 60)
    updateButton()
}
resetBtn.addEventListener("click",reset)

//-----------------------------------------
// タイマーセットボタン
//-----------------------------------------
const workInputSet = () =>{
    minutes = Number(workInput.value)
    timerDisplay.textContent = formatTime(Number(workInput.value) * 60)
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