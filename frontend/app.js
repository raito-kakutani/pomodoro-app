//------------------------
//要素取得
//------------------------
let timerDisplay = document.getElementById("timer-display") //表示時刻の要素
const playPauseBtn = document.getElementById("playpause-button")
const resetBtn = document.getElementById("reset-button")
//------------------------
// 状態
//------------------------
let isRunning = "stopped" //タイマー実行フラグ

//------------------------
//グローバル変数定義]
//------------------------
let endTime = null
let pauseStartTime = null
let pauseFinishTime = null
/**@type {"running" | "stopped" | "paused"} */
let intervalId = null //setIntervalを行った際の処理ID
let minutes = null

//----------------------------------
// ロジック関数定義
//----------------------------------
function formatTime(totalSeconds) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
  const secs = String(totalSeconds % 60).padStart(2, "0")
  return mins + ":" + secs
}

function updateButton() {
  playPauseBtn.classList.remove("timer__play-button", "timer__pause-button")
  console.log("クラスリスト",playPauseBtn.classList)
  console.log("isRunning",isRunning)

  if (isRunning === "running") {
    playPauseBtn.classList.add("timer__pause-button")
  } else {
    playPauseBtn.classList.add("timer__play-button")
  }
}


//----------------------------------
// 初期設定
//----------------------------------
minutes = 25
timerDisplay.textContent = formatTime(minutes * 60)
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
        intervalId = setInterval(() => {
            const remaining = Math.floor((endTime - Date.now()) / 1000)
            if (remaining <= 0) {
                timerDisplay.textContent="00:00"
                isRunning = "stopped"
                clearInterval(intervalId)
                updateButton()
                return
            }
            timerDisplay.textContent = formatTime(remaining)
        }, 100);
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
        intervalId = setInterval(() => {
            const remaining = Math.floor((endTime - Date.now()) / 1000)
            if (remaining <= 0) {
                timerDisplay.textContent="00:00"
                isRunning = "stopped"
                clearInterval(intervalId)
                updateButton()
                return
            } 
            timerDisplay.textContent = formatTime(remaining)
        }, 100);
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
    clearInterval(intervalId)
    timerDisplay.textContent = formatTime(minutes * 60)
    updateButton()
}
resetBtn.addEventListener("click",reset)