//要素取得
let timerDisplay = document.getElementById("timer-display") //表示時刻の要素
const playPauseBtn = document.getElementById("playpause-button")
const resetBtn = document.getElementById("reset-button")

//グローバル変数定義
let endTime = null
let pauseStartTime = null
let pauseFinishTime = null
/**@type {"running" | "stopped" | "paused"} */
let isRunning = "stopped" //タイマー実行フラグ
let intervalId = null //setIntervalを行った際の処理ID


//-----------------------------------------
// スタートボタン
//-----------------------------------------
const playPause = () => {

    if (isRunning == "stopped") {
        //作動中フラグをオンにし終了時刻を取得
        isRunning = "running"
        endTime = Date.now() + 25 * 60 * 1000
        // 0.1秒ごとに残り時間を計算し画面に反映(setIntervalIdでブラウザに処理内容を登録)
        intervalId = setInterval(() => {
            const remaining = Math.floor((endTime - Date.now()) / 1000)
            if (remaining <= 0) {
                timerDisplay.textContent="00:00"
                isRunning = "stopped"
                clearInterval(intervalId)
                return
            }
            const minutes = String(Math.floor(remaining / 60)).padStart(2, "0")
            const seconds = String(remaining % 60).padStart(2, "0")
            timerDisplay.textContent = minutes + ":" + seconds
        }, 1000);
    }

    else if (isRunning == "running") {
        //作動中フラグをオフ
        isRunning = "paused"
        pauseStartTime = Date.now() // ポーズ開始時刻を取得
        clearInterval(intervalId)
    }

    // 一時停止中の時の処理
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
                return
            }
            const minutes = String(Math.floor(remaining / 60)).padStart(2, "0")
            const seconds = String(remaining % 60).padStart(2, "0")
            timerDisplay.textContent = minutes + ":" + seconds
        }, 100);
    }
}
playPauseBtn.addEventListener("click",playPause)

//-----------------------------------------
// リセットボタン
//-----------------------------------------
const reset = () => {
    //作動中なら作動中フラグをオフにする
    isRunning = "stopped"
    clearInterval(intervalId)
    timerDisplay.textContent = "25:00"
}
resetBtn.addEventListener("click",reset)