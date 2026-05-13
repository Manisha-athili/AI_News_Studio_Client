

export const NewsArticles = async (title, setArticles, setSelected, setGenerated) => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const url = `${baseUrl}/api/news?topic=${encodeURIComponent(title)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch the articles");

        const data = await res.json();
        setArticles(data.slice(0, 5));
        setSelected([]);
        setGenerated(null);

    } catch (error) {
        console.log(error, "failed to fetch articles");
        alert(error, "failed to fetch articles")
    }

}

export const generateArticles = async (selectedArticles, setGenerated) => {

    try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const res = await fetch(`${baseUrl}/api/ai/`,
            {
                method: "POST",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify({ selectedArticles, title })
            }
        );

        if (!res.ok) throw new Error("Failed to Generate AI Articles");

        const result = await res.json();
        setGenerated(result);
    } catch (error) {
        console.error("Generate error:", error);
        alert("Failed to generate ideas");
    }
}