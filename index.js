// ==========================================
// 1. 操作するHTML部品を取得
// ==========================================
const modal = document.getElementById("game-modal");
const frame = document.getElementById("game-frame");
const closeBtn = document.getElementById("close-btn");
const gameList = document.getElementById("game-list");

// ==========================================
// 2. ゲーム画面を開く・閉じる機能
// ==========================================
function openGame(url) {
  frame.src = url;
  modal.style.display = "flex";
}

function closeGame() {
  modal.style.display = "none";
  frame.src = ""; // ゲーム停止
}

closeBtn.addEventListener("click", closeGame);

// ==========================================
// 3. ゲームカードを組み立てる工場（画像対応版）
// ==========================================
function createGameCard(title, url, iconUrl) {
  const card = document.createElement("div");
  card.className = "card";

  // 同じ名前の.pngがあれば画像を表示、なければゲームの絵文字にする！
  const thumbContent = iconUrl
    ? `<img src="${iconUrl}" alt="${title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">`
    : `<div class="thumb" style="font-size: 3rem; margin-bottom: 0.5rem;">🎮</div>`;

  card.innerHTML = `
    ${thumbContent}
    <h3>${title}</h3>
    <span class="play-btn">PLAY</span>
  `;

  // クリックされたらゲームを開く
  card.addEventListener("click", () => {
    openGame(url);
  });

  gameList.appendChild(card);
}

// ==========================================
// 4. GitHubからHTMLと、おそろいのPNGを自動マッチング！
// ==========================================
async function loadGamesFromGitHub() {
  const apiUrl = "https://api.github.com/repos/s2026170-sys/mygames/contents";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`GitHub通信エラー (ステータス: ${response.status})`);
    }

    const files = await response.json();

    if (!Array.isArray(files)) {
      throw new Error("ファイル一覧の取得に失敗しました。");
    }

    // 「.html」で終わり、index.html 以外のファイルを抽出
    const gameFiles = files.filter(file => 
      file.name.endsWith(".html") && file.name.toLowerCase() !== "index.html"
    );

    if (gameFiles.length === 0) {
      gameList.innerHTML = "<p style='color: white;'>ゲームが見つかりませんでした。</p>";
      return;
    }

    // 各ゲームに対して、同じ名前の .png を探してカードを作る
    gameFiles.forEach(file => {
      // 例: "TSURUMI.html" から名前の「TSURUMI」だけを抜き出す
      const baseName = file.name.replace(/\.html$/i, "");
      const gameTitle = baseName.toUpperCase();
      const gameUrl = `./${file.name}`;

      // 「TSURUMI.png」というファイルがリストの中にあるか探す（大文字小文字は無視）
      const matchingPng = files.find(f => 
        f.name.toLowerCase() === `${baseName.toLowerCase()}.png`
      );

      // 見つかったらその画像パス、無ければ null（絵文字になる）
      const iconUrl = matchingPng ? `./${matchingPng.name}` : null;

      createGameCard(gameTitle, gameUrl, iconUrl);
    });

  } catch (error) {
    console.error(error);
    gameList.innerHTML = `<p style="color: #ef4444; font-weight: bold;">⚠️ エラー: ${error.message}</p>`;
  }
}

// 起動時に自動実行
loadGamesFromGitHub();
