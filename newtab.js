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
    const articles = await getArticles();
    articles.forEach(article => {
      const articleElement = document.createElement("div");
      articleElement.classList.add("article");
      articleElement.innerHTML = `
        <h3 class="article-title">${article.title}</h3>
        <p> いいね数: ${article.likes_count}</p> | <p>ストック数: ${article.stocks_count}</p>
        <a href="${article.url}" target="_blank" class="article-link" data-id="${article.id}">記事を読む</a>
      `;
      container.appendChild(articleElement);
    })
  }

});