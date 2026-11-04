// 1. 操作したいHTML部品を捕まえる
const modal = document.getElementById("game-modal");
const frame = document.getElementById("game-frame");
const closeBtn = document.getElementById("close-btn");

// 2. 「ゲームを開く」命令
function openGame(url) {
  frame.src = url;               // 枠の中にゲームのURLを入れる
  modal.style.display = "flex";  // 隠していた枠を画面に出す！
}

// 3. 「ゲームを閉じる」命令
function closeGame() {
  modal.style.display = "none";  // 枠をまた隠す
  frame.src = "";                // ゲームの音や動きを完全に消去する
}

// 4. 閉じるボタンが押されたら closeGame を動かす
closeBtn.addEventListener("click", closeGame);
// === 1. あなたのGitHub情報を設定 ===
const GITHUB_USER = "あなたのGitHubユーザー名"; // 例: "tarou"
const REPO_NAME   = "my-games";               // あなたのリポジトリ名

// === 2. GitHubからゲーム一覧を自動取得する非同期関数 ===
async function loadGamesFromGitHub() {
  // GitHubのAPI窓口に「gamesフォルダの中身をくれ」とアクセスするURL
  const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/games`;

  try {
    // データをインターネット経由で取ってくる（通信待ちをする await）
    const response = await fetch(apiUrl);
    const files = await response.json();

    // 取得したファイルたちを1つずつチェックするループ
    files.forEach(file => {
      // ファイル名が「.html」で終わるものだけをゲームとして扱う！
      if (file.name.endsWith(".html")) {

        // 「coin.html」から「.html」を削って「coin」というゲーム名にする
        const gameTitle = file.name.replace(".html", "").toUpperCase();
        
        // ゲームの実際のURL（GitHub Pages上の場所）
        const gameUrl = `https://${GITHUB_USER}.github.io/${REPO_NAME}/games/${file.name}`;

        // カードを自動で作る！
        createGameCard(gameTitle, gameUrl);
      }
    });

  } catch (error) {
    console.error("ゲームの読み込みに失敗しました:", error);
  }
}

// === 3. カードを画面に組み立てる工場 ===
function createGameCard(title, url) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="thumb">🎮</div>
    <h3>${title}</h3>
    <span class="play-btn">PLAY</span>
  `;

  // クリックされたら、そのURLをモーダルで開く！
  card.addEventListener("click", () => {
    openGame(url);
  });

  // 画面の game-list の中にカードを追加
  gameList.appendChild(card);
}

// === 4. サイトを開いた瞬間に自動実行！ ===
loadGamesFromGitHub();
