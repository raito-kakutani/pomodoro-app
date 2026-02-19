let startBtn = document.getElementById("start")
let timerDisplay = document.getElementById("timer")

const start = () => {
    setInterval(() => {
        const remaining = Math.floor((endTime - Date.now()) / 1000)
        const minutes = String(Math.floor(remaining / 60)).padStart(2, "0")
        const seconds = String(remaining % 60).padStart(2, "0")
        timerDisplay.textContent = minutes + ":" + seconds
    }, 1000);
}
startBtn.addEventListener("click",start)