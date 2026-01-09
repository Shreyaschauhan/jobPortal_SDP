import fetch from "node-fetch";

export const getTechNews = async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${process.env.NEWS_API_KEY}`
    );

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        articles: [],
      });
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      articles: data.articles || [],
    });
  } catch (error) {
    console.error("🔥 News API Error:", error);
    res.status(500).json({
      success: false,
      articles: [],
    });
  }
};
