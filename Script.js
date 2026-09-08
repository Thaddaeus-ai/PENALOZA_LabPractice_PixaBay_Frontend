const resultsGrid = document.getElementById('resultsGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');

async function fetchData(query, type) {
    loadingIndicator.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    resultsGrid.innerHTML = '';

    const encodedQuery = encodeURIComponent(query);
        let url = `https://pixabay.com/api/`;
    if (type === 'video') {
        url += `videos/`;
    }

    url += `?key=${CONFIG.API_KEY}&q=${encodedQuery}&per_page=12`;
    if (type === 'photo') {
        url += `&image_type=photo`;
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Network response was not ok');
            
        const data = await response.json();
        
        if (data.hits.length === 0) {
            errorMessage.textContent = "No results found. Try a different term.";
            errorMessage.classList.remove('hidden');
        } else {
            renderResults(data.hits, type);
        }
    } catch (error) {
        errorMessage.textContent = "Failed to fetch data. Check your API key or connection.";
        errorMessage.classList.remove('hidden');
        console.error(error);
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

function renderResults(hits, type) {
    hits.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item';

    if (type === 'video') {
    div.innerHTML = `
                <video controls src="${item.videos.tiny.url}"></video>
                <p>By: ${item.user}</p>
            `;
    } else {
        div.innerHTML = `
        <img src="${item.webformatURL}" alt="${item.tags}">
        <p>By: ${item.user}</p>
            `;
        }
    resultsGrid.appendChild(div);
    });

}

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    const type = document.getElementById('mediaType').value;
    if (query) fetchData(query, type);
});