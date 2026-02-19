let startBtn = document.getElementById("start")
const start = () => {
    endTime = Date.now() + 25 * 60 * 1000//ミリ秒
    setInterval(() => {
        const remaining = endTime - Date.now()
        
    }, 1000);

} 
startBtn.addEventListener("click",start)