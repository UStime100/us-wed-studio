const FORM_URL = "https://script.google.com/macros/s/AKfycbzw6eWfEjln6M_om0VSy9QxekLcaQCIg_u2WdkgWc3WcUCaNmxn-RgYA2VTeBIFTfVM/exec";

const mainText = document.getElementById('main-text');
const reserveBtn = document.getElementById('reserve-btn');
const popup = document.getElementById('popup');
const popupClose = document.getElementById('popup-close');

// 滑鼠光影效果
document.addEventListener('mousemove', e => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  mainText.style.textShadow = `${x*20}px ${y*20}px 30px #00f`;
});

// 預約按鈕
reserveBtn.addEventListener('click', async () => {
  const ig = prompt("請輸入你的 IG 帳號："); // 客戶輸入 IG
  if(!ig) return;

  const confirmReserve = confirm("是否要預約？");
  if(confirmReserve){
    // 將客戶資料送到 Google Sheet
    try {
      await fetch(FORM_URL, {
        method: 'POST',
        body: JSON.stringify({ ig: ig }),
        headers: { 'Content-Type': 'application/json' }
      });

      // 顯示預約成功訊息
      popup.classList.remove('hidden');

      // 在網頁上生成可點擊 IG 連結
      const igLink = document.createElement('a');
      igLink.href = `https://www.instagram.com/${ig}/`;
      igLink.target = "_blank";
      igLink.textContent = `客戶 IG: ${ig}`;
      igLink.style.display = "block";
      igLink.style.marginTop = "10px";
      popup.appendChild(igLink);

    } catch(err){
      alert("送出資料失敗，請稍後再試");
      console.error(err);
    }
  }
});

// 關閉視窗
popupClose.addEventListener('click', () => {
  popup.classList.add('hidden');
});

