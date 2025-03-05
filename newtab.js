document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("article-container");
  const API_URL = "https://qiita.com/api/v2/items?page=1&per_page=50&query=stocks:>50";

  // Qiita APIから記事を取得
  const fetchArticles = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  };

  // ランダムに4つの記事を取得
  const getArticles = async () => {
    const articles = await fetchArticles();
    const randomArticles = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * articles.length);
      randomArticles.push(articles[randomIndex]);
    }
    return randomArticles;
  };

  // 記事を表示
  const renderArticles = async () => {
    container.innerHTML = ""; // 表示前にクリア
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('storedDate');
    let articles;
    if (storedDate === today) {
      articles = JSON.parse(localStorage.getItem('articles'));
    } else {
      articles = await getArticles();
      localStorage.setItem('articles', JSON.stringify(articles));
      localStorage.setItem('storedDate', today);
      // 既読記事情報のリセット
      localStorage.removeItem('readArticles');
    }

    articles.forEach(article => {
      const articleElement = document.createElement("div");
      articleElement.classList.add("article");
      articleElement.innerHTML = `
        <h3 class="article-title">${article.title}</h3>
        <p>いいね数: ${article.likes_count}</p>
        <p>ストック数: ${article.stocks_count}</p>
        <a href="${article.url}" target="_blank" class="article-link" data-id="${article.id}">
          記事を読む
        </a>
      `;
      // 既読記事の背景色（readArticlesはリセット済むので再現されない）
      const readArticles = JSON.parse(localStorage.getItem('readArticles')) || [];
      if (readArticles.includes(article.id)) {
        articleElement.style.backgroundColor = "#d3d3d3";
      }
      container.appendChild(articleElement);
    });

    // 記事リンククリック時：既読記事として記録
    document.querySelectorAll('.article-link').forEach(link => {
      link.addEventListener('click', () => {
        const readArticles = JSON.parse(localStorage.getItem('readArticles')) || [];
        if (!readArticles.includes(link.dataset.id)) {
          readArticles.push(link.dataset.id);
          localStorage.setItem('readArticles', JSON.stringify(readArticles));
        }
      });
    });
  };

  // 日本時間の24時に再取得するためのスケジュール処理
  const scheduleDailyUpdate = () => {
    // 日本時間での現在日時を取得
    const now = new Date();
    const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const jstMidnight = new Date(jstNow.getFullYear(), jstNow.getMonth(), jstNow.getDate() + 1);
    const timeUntilMidnight = jstMidnight.getTime() - jstNow.getTime();

    setTimeout(async () => {
      await renderArticles();
      scheduleDailyUpdate();
    }, timeUntilMidnight);
  };

  renderArticles();
  scheduleDailyUpdate();
});