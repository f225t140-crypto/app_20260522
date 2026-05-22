let appData = {
    budget: 0,
    spent: 0,
    savings: 0 // 画面には出さない裏の貯金
};

let currentInputAmount = 0;
let currentSelectedCategory = '';

// 起動時にデータを読み込む
window.onload = function() {
    const savedData = localStorage.getItem('hobbyTreeData');
    if (savedData) appData = JSON.parse(savedData);
    updateUI();
};

// 画面を更新する関数（木の実の計算もここ）
function updateUI() {
    const remaining = appData.budget - appData.spent;
    
    // 予算表示
    const remainingDisplay = document.getElementById('remainingBudgetDisplay');
    remainingDisplay.innerText = `¥${remaining.toLocaleString()}`;
    remainingDisplay.className = `status-amount ${remaining < 0 ? 'minus' : ''}`;
    document.getElementById('totalBudgetDisplay').innerText = `（今月の予算：¥${appData.budget.toLocaleString()}）`;
    document.getElementById('inputAmountDisplay').innerText = `入力中: ¥${currentInputAmount.toLocaleString()}`;

    // 🍎の描画（1,000円ごとに1つ）
    const fruitsContainer = document.getElementById('fruitsContainer');
    fruitsContainer.innerHTML = '';
    let fruitCount = Math.floor(Math.max(0, appData.savings) / 1000);
    if (fruitCount > 30) fruitCount = 30; // 画面崩れ防止で上限30個

    for (let i = 0; i < fruitCount; i++) {
        const fruitEl = document.createElement('span');
        fruitEl.className = 'fruit';
        fruitEl.innerText = '🍎';
        // 葉っぱの中にランダム配置
        fruitEl.style.left = `${Math.random() * 70 + 5}%`;
        fruitEl.style.top = `${Math.random() * 70 + 5}%`;
        fruitsContainer.appendChild(fruitEl);
    }

    // ボタンの活性化
    document.getElementById('submitBtn').disabled = !(currentInputAmount > 0 && currentSelectedCategory);
}

// 金額とカテゴリの選択
function selectAmount(amount) { currentInputAmount += amount; updateUI(); }
function selectCategory(category, element) {
    currentSelectedCategory = category;
    document.querySelectorAll('.btn-category').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
    updateUI();
}

// 使ったお金を記録
function submitExpense() {
    appData.spent += currentInputAmount;
    localStorage.setItem('hobbyTreeData', JSON.stringify(appData));
    
    currentInputAmount = 0;
    currentSelectedCategory = '';
    document.querySelectorAll('.btn-category').forEach(btn => btn.classList.remove('selected'));
    
    updateUI();
}

// 給料日リセットと予算設定
function toggleBudgetSetup() {
    document.getElementById('budgetSetupBox').classList.toggle('open');
}

function processSalaryDay() {
    const newBudget = parseInt(document.getElementById('newBudgetInput').value);
    if (isNaN(newBudget) || newBudget < 0) return alert('正しい金額を入れてください');

    const remaining = appData.budget - appData.spent;
    appData.savings += remaining; // 余りを貯金箱へ（マイナスなら引かれる）
    if (appData.savings < 0) appData.savings = 0;

    appData.budget = newBudget;
    appData.spent = 0;
    
    localStorage.setItem('hobbyTreeData', JSON.stringify(appData));
    updateUI();
    toggleBudgetSetup();
    
    alert(remaining >= 0 ? `余った ¥${remaining} が木の実になりました！🍎` : `予算オーバー分が貯金から引かれました🪓`);
}

// 木を切り倒す（結果発表）
function chopTree() {
    if (appData.savings <= 0) return alert('まだ実がなっていません！');
    if (!confirm('本当に木を切り倒しますか？')) return;

    const treeVisual = document.getElementById('treeVisual');
    treeVisual.classList.add('chopping');

    setTimeout(() => {
        treeVisual.classList.remove('chopping');
        alert(`🪓 ドンッ！！！\n\n💰 貯金総額: ¥${appData.savings.toLocaleString()}\n\n好きに使いましょう！✨`);
        appData.savings = 0;
        localStorage.setItem('hobbyTreeData', JSON.stringify(appData));
        updateUI();
    }, 1000);
}
