const scriptURL = "https://script.google.com/macros/s/AKfycbwoJ-IvLLRGa-2TQbutTMEl6VvpYPEyhKbW0H3wJmR3iPeS6BCxIZWo6U1SlpblJWr-/exec";

// 表單提交事件
const form = document.getElementById("bookingForm");
form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    email: form.email.value,
    time: form.time.value,
    note: form.note.value,
    ig: form.ig.value
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    if(res.status === "success"){
      // 客戶預約完成才顯示訊息
      alert("感謝你的信任，我們會盡所能幫你打造24小時賺錢的夥伴。\n注意事項：您可以到 IG 等待，我會傳表單詢問您關於客製化網站的需求。");

      // 自動開啟客戶 IG
      const igLink = `https://www.instagram.com/${form.ig.value.replace("@","")}/`;
      window.open(igLink, "_blank");

      form.reset();
    } else {
      alert("發生錯誤，請稍後再試。");
    }
  })
  .catch(err => {
    console.error("Error:", err);
    alert("網路或程式發生問題，請聯絡管理員。");
  });
});

// 鼠標手電筒光影跟隨
document.addEventListener("mousemove", e => {
  const x = e.clientX;
  const y = e.clientY;
  document.body.style.setProperty('--mouse-x', `${x}px`);
  document.body.style.setProperty('--mouse-y', `${y}px`);
});

// US.time 滑鼠發光漸層效果
const title = document.querySelector(".main-title");
title.addEventListener("mouseenter", () => {
  title.classList.add("hovered");
});
title.addEventListener("mouseleave", () => {
  title.classList.remove("hovered");
});
