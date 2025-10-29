const bookBtn = document.getElementById("bookBtn");
const popup = document.getElementById("popup");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

bookBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});

confirmBtn.addEventListener("click", async () => {
  popup.classList.add("hidden");

  const data = {
    timestamp: new Date().toLocaleString(),
    ig: "客戶IG帳號",
    message: "已送出預約請求"
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwjf4-CTtihcw71zK3vtGhwYok71b9hBYYWLs1A-hX0d160mH6RBaTNiK7klsdDt7kX/exec", {
      method: "POST",
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert("預約成功！請至 IG 私訊查看確認表單。");
    } else {
      alert("送出資料失敗，請稍後再試。");
    }
  } catch (error) {
    console.error("錯誤：", error);
    alert("系統錯誤，請稍後再試。");
  }
});
