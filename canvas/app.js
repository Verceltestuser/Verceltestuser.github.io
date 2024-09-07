const colorOption = Array.from( 
    document.getElementsByClassName("color-option")
);
const brushsize = document.querySelector('p')
const modeBtn = document.getElementById("mode-btn")
const destroyBtn = document.getElementById("destroy-btn")
const eraser = document.getElementById("eraser-btn")
const canvas = document.getElementById("canvas")
const colori = document.getElementById("color")
const fileInput = document.getElementById("file")
const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text")
const shapeBtn = document.getElementById('mode-btn-2')
const textSize = document.getElementById('text-size')
const lineWidth = document.getElementById("line-width")
 const darkModeBtn =document.getElementById('dark-mode-toggle')
const ctx = canvas.getContext("2d")
canvas.width = 800;
canvas.height = 800;
ctx.lineWidth = lineWidth.value
ctx.lineCap = "round";
let isPainting = false;
let isFilling = false;
let isShaping = false;
let isDark = false;


canvas.addEventListener("mousemove", (e)=>{
    if(isPainting){
        ctx.lineTo(e.offsetX, e.offsetY)
        if (isShaping){
            ctx.fill();
        }else{
            ctx.stroke();
        }
        return;
    }
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY)
})

canvas.addEventListener("mousedown",()=>{
    isPainting = true;
})

canvas.addEventListener("mouseup",()=>{
    isPainting = false;
})

canvas.addEventListener("mouseleave",()=>{
    isPainting = false;
})

canvas.addEventListener("dblclick",(e)=>{
    const text = textInput.value
    if (text !== ""){
            ctx.save();
            ctx.lineWidth = 1
            ctx.font = `${textSize.value}px sans-serif`
            ctx.fillText(text, e.offsetX, e.offsetY)
            ctx.restore();
    }
})

lineWidth.addEventListener("change", (e)=>{
    ctx.lineWidth = e.target.value;
    brushsize.innerText = e.target.value
})
colori.addEventListener("change",(e)=>{
    ctx.strokeStyle = e.target.value
    ctx.fillStyle = e.target.value
})
colorOption.forEach(color => color.addEventListener("click",(e)=>{
    ctx.strokeStyle = e.target.dataset.color
    ctx.fillStyle = e.target.dataset.color
    colori.value = e.target.dataset.color
}))

modeBtn.addEventListener("click", ()=>{
    if(isFilling){
        isFilling = false
        modeBtn.innerText = "🩸 Fill"
    }else{
        isFilling = true
        modeBtn.innerText = "✏️ Draw"
    }
})
canvas.addEventListener("click", ()=>{
    if (isFilling){
        ctx.fillRect(0,0,800,800)
    }
})
destroyBtn.addEventListener("click", ()=>{
    const res = confirm("ARE YOU SURE???")
    if(res){
        ctx.fillStyle = "white"
        ctx.fillRect(0,0,800,800)
    }
})
eraser.addEventListener('click', ()=>{
    ctx.strokeStyle = "white"
    isShaping = false
    isFilling = false
    modeBtn.innerText = "🩸 Fill"
    shapeBtn.innerText = "🔴 Shape Mode"
})

fileInput.addEventListener("change", (e)=>{
    const file = e.target.files[0]
    const url = URL.createObjectURL(file)
    const image  = new Image()
    image.src = url;
    image.onload = ()=>{
        ctx.drawImage(image,0,0,800,800)
        fileInput.value = null;
    }
})

saveBtn.addEventListener("click", ()=>{
    const linkURL = canvas.toDataURL();
    const a = document.createElement("a")
    a.href = linkURL
    a.download = "myAwsomeWork.png"
    a.click();
})


shapeBtn.addEventListener("click", ()=>{
    if(isShaping){
        isShaping = false
        shapeBtn.innerText = "🔴 Shape Mode"
    }else{
        isShaping = true
        shapeBtn.innerText = "✍🏻 Draw Mode"
    }
})

darkModeBtn.addEventListener("click", ()=>{
    document.body.classList.toggle('dark-mode')
    if (isDark){
        isDark = false
        darkModeBtn.innerText = "🌙 Dark Mode"
    }else{
        isDark = true
        darkModeBtn.innerText = "☀️ Light Mode"
    }
})