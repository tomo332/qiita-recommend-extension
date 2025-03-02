document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("article-container");

  const API_URL = "https://qiita.com/api/v2/items?page=1&per_page=50&query=stocks:>50";

  //Qiita APIから記事を取得
  const fetchArticles = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  }

  //ランダムに4つの記事を取得
  const getArticles = async () => {
    const articles = await fetchArticles();
    const randomArticles = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * articles.length);
      randomArticles.push(articles[randomIndex]);
    }
    return randomArticles;
  }

  //記事を表示
  const renderArticles = async () => {
    // 今日の日付を取得
    const today = new Date().toISOString().split('T')[0];
    //　ローカルストレージに保存された日付取得
    const storedDate = localStorage.getItem('storedDate');
    let articles;
    // 今日の日付と保存された日付が同じ場合はローカルストレージから記事を取得
    if (storedDate === today) {
      articles = JSON.parse(localStorage.getItem('articles'));
    } else {
      // 異なる場合はQiitaAPIから記事を取得
      articles = await getArticles();
      localStorage.setItem('articles', JSON.stringify(articles));
      localStorage.setItem('storedDate', today);
    }
    articles.forEach(article => {
      const articleElement = document.createElement("div");
      articleElement.classList.add("article");
      articleElement.innerHTML = `
        <h3 class="article-title">${article.title}</h3>
        <p> いいね数: ${article.likes_count}</p> <p>ストック数: ${article.stocks_count}</p>
        <a href="${article.url}" target="_blank" class="article-link" data-id="${article.id}">記事を読む</a>
      `;

      // ローカルストレージから既読記事を取得
      const readArticles = JSON.parse(localStorage.getItem('readArticles')) || [];
      // 既読記事の色を変える
      if (readArticles.includes(article.id)) {
        articleElement.style.backgroundColor = "#d3d3d3";
      }

      container.appendChild(articleElement);
    });

    // 記事リンクのクリックイベントを設定
    // 記事をクリックしたらローカルストレージに保存
    document.querySelectorAll('.article-link').forEach(link => {
      link.addEventListener('click', () => {
        const readArticles = JSON.parse(localStorage.getItem('readArticles')) || [];
        readArticles.push(link.dataset.id);
        localStorage.setItem('readArticles', JSON.stringify(readArticles));
      });
    });
  }
  renderArticles();

});