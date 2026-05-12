import { useState } from 'react';
import { NewsArticles, generateArticles } from "./Api.js";

function App() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleSearch = async () => {
    if (!title.trim()) {
      return alert("Please enter a topic");
    }

    setLoading(true);
    await NewsArticles(title, setArticles, setSelected, setGenerated);
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(articleId => articleId !== id)
        : [...prev, id]
    );
  };

  // Prepare selected articles for generation
  const selectedArticlesData = articles
    .filter(art => selected.includes(art.id))
    .map(art => ({
      id: art.id,
      title: art.title,
      description: art.description ?? art.snippet ?? "",
    }));

  const handleGenerate = async () => {
    if (selected.length === 0) {
      return alert("Please select at least one article");
    }

    setGenerating(true);
    await generateArticles(selectedArticlesData, setGenerated);
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Article Generator
          </h1>
          <p className="text-gray-600">Search news → Select articles → Generate AI content</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-10 max-w-2xl mx-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter topic (e.g. Artificial Intelligence)"
            className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-70"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Articles List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
               Available Articles
              <span className="text-sm font-normal text-gray-500">({articles.length})</span>
            </h2>

            {articles.length === 0 ? (
              <p className="text-gray-500 py-12 text-center">
                Search for a topic to see articles
              </p>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className={`p-4 border rounded-xl transition-all cursor-pointer hover:shadow-md ${
                      selected.includes(article.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => toggleSelect(article.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(article.id)}
                        onChange={() => toggleSelect(article.id)}
                        className="mt-1 w-5 h-5 accent-blue-600"
                      />
                      <div>
                        <h3 className="font-medium leading-tight text-gray-900">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                          {article.description || article.snippet || 'No description available'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected & Generate Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4"> Selected Articles</h2>

              {selected.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">No articles selected yet</p>
              ) : (
                <div className="space-y-3">
                  {articles
                    .filter(a => selected.includes(a.id))
                    .map(article => (
                      <div key={article.id} className="bg-gray-50 px-4 py-3 rounded-lg text-sm">
                        {article.title}
                      </div>
                    ))}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={selected.length === 0 || generating}
                className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating AI Content...' : `Generate AI Article (${selected.length})`}
              </button>
            </div>

            {/* Generated Output */}
            {generated && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 text-green-700"> AI Generated Result</h2>
                <div className="prose max-w-none">
                  {typeof generated === 'string' ? (
                    <p className="whitespace-pre-wrap text-gray-700">{generated}</p>
                  ) : (
                    <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl overflow-auto text-sm">
                      {JSON.stringify(generated, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;