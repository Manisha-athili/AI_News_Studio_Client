

export const NewsArticles = async (title, setArticles, setSelected, setGenerated) => {
   try {
    const url = `https://ai-news-studio-server.onrender.com/api/news/?topic=${encodeURIComponent(title)}` || `http://localhost:4000/news/?title=${encodeURIComponent(title)}`;
    const res = await fetch(url);

    if(!res.ok) throw new Error("Failed to fetch the articles");

    const data = await res.json();
    setArticles(data.slice(0,5));
    setSelected([]);
    setGenerated(null) ;
    
   } catch (error) {
    console.log(error,"failed to fetch articles");
    alert(error,"failed to fetch articles")
   }
    
}

export const generateArticles = async(selectedArticles,setGenerated)=>{
   
    try {
        const url = `https://ai-news-studio-server.onrender.com/api/ai/`
        const res = await fetch(url,
            {
                method : "POSt",
                headers : {"content-Type": "application/json"},
                body : JSON.stringify({ selectedArticles, title })
            }
        );

        if(!res.ok) throw new Error("Failed to Generate AI Articles");
        
        const result = JSON.parse(res);
        setGenerated(result);
    } catch (error) {
        console.error("Generate error:", error);
        alert("Failed to generate ideas");
    }
}