const defaultData = {
  budget: 10000,
  spent: 0,
  goalName: "焼肉",
  goalTarget: 15000,
  goalSaved: 0,
  history: []
};

let data = loadData();

const budgetText = document.getElementById("budgetText");
const spentText = document.getElementById("spentText");
const remainText = document.getElementById("remainText");
const avatar = document.getElementById("avatar");
const avatarMessage = document.getElementById("avatarMessage");

const budgetInput = document.getElementById("budgetInput");
const goalNameInput = document.getElementById("goalNameInput");
const goalTargetInput = document.getElementById("goalTargetInput");
const saveSettingBtn = document.getElementById("saveSettingBtn");

const spentInput = document.getElementById("spentInput");
const categoryInput = document.getElementById("categoryInput");
const addSpentBtn = document.getElementById("addSpentBtn");

const goalTitle = document.getElementById("goalTitle");
const goalProgress = document.getElementById("goalProgress");
const goalSavedText = document.getElementById("goalSavedText");
const goalTargetText = document.getElementById("goalTargetText");

const monthEndBtn = document.getElementById("monthEndBtn");
const monthEndResult = document.getElementById("monthEndResult");
const historyList = document.getElementById("historyList");
const resetBtn = document.getElementById("resetBtn");

saveSettingBtn.addEventListener("click", () => {
  const budgetValue = Number(budgetInput.value);
  const goalNameValue = goalNameInput.value.trim();
  const goalTargetValue = Number(goalTargetInput.value);

  if (budgetValue > 0) data.budget = budgetValue;
  if (goalNameValue) data.goalName = goalNameValue;
  if (goalTargetValue > 0) data.goalTarget = goalTargetValue;

  saveData();
  render();
});

addSpentBtn.addEventListener("click", () => {
  const amount = Number(spentInput.value);
  const category = categoryInput.value;

  if (!amount || amount <= 0) {
    alert("使った金額を入力してください");
    return;
  }

  data.spent += amount;
  data.history.unshift({
    amount,
    category,
    date: new Date().toLocaleDateString("ja-JP")
  });

  spentInput.value = "";
  saveData();
  render();
});

monthEndBtn.addEventListener("click", () => {
  const remain = data.budget - data.spent;

  if (remain > 0) {
    data.goalSaved += remain;
    monthEndResult.textContent = `${remain.toLocaleString()}円をごほうび貯金に追加しました。`;
  } else if (remain < 0) {
    const over = Math.abs(remain);
    data.goalSaved = Math.max(0, data.goalSaved - over);
    monthEndResult.textContent = `${over.toLocaleString()}円オーバーしたので、ごほうび貯金から調整しました。`;
  } else {
    monthEndResult.textContent = "今月はぴったり使い切りました。";
  }

  data.spent = 0;
  data.history = [];

  saveData();
  render();
});

resetBtn.addEventListener("click", () => {
  const ok = confirm("すべてのデータをリセットしますか？");
  if (!ok) return;

  data = { ...defaultData, history: [] };
  saveData();
  render();
});

function render() {
  const remain = data.budget - data.spent;

  budgetText.textContent = `${data.budget.toLocaleString()}円`;
  spentText.textContent = `${data.spent.toLocaleString()}円`;
  remainText.textContent = `${remain.toLocaleString()}円`;

  budgetInput.value = data.budget;
  goalNameInput.value = data.goalName;
  goalTargetInput.value = data.goalTarget;

  goalTitle.textContent = `${data.goalName}貯金`;
  goalSavedText.textContent = `${data.goalSaved.toLocaleString()}円`;
  goalTargetText.textContent = `${data.goalTarget.toLocaleString()}円`;

  const progress = data.goalTarget > 0
    ? Math.min((data.goalSaved / data.goalTarget) * 100, 100)
    : 0;

  goalProgress.style.width = `${progress}%`;

  updateAvatar();

  historyList.innerHTML = "";
  data.history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date}：${item.category}に${item.amount.toLocaleString()}円`;
    historyList.appendChild(li);
  });
}

function updateAvatar() {
  const ratio = data.budget > 0 ? data.spent / data.budget : 0;

  avatar.className = "avatar";

  if (ratio < 0.4) {
    avatar.textContent = "🦊";
    avatarMessage.textContent = "ゆっくり過ごしているようです";
  } else if (ratio < 0.8) {
    avatar.textContent = "🦊";
    avatar.classList.add("fun");
    avatarMessage.textContent = "趣味を満喫しているようです";
  } else if (ratio <= 1) {
    avatar.textContent = "🦊";
    avatar.classList.add("warning");
    avatarMessage.textContent = "少し飛ばし気味かもしれません";
  } else {
    avatar.textContent = "🦊";
    avatar.classList.add("tired");
    avatarMessage.textContent = "今月は全力で楽しんだようです";
  }
}

function saveData() {
  localStorage.setItem("gohoubiWalletData", JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem("gohoubiWalletData");
  if (!saved) return { ...defaultData, history: [] };

  try {
    return JSON.parse(saved);
  } catch {
    return { ...defaultData, history: [] };
  }
}

render();
