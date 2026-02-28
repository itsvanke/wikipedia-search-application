const searchInputEl = document.getElementById("searchInput");
const searchResultsEl = document.getElementById("searchResults");
const spinnerEl = document.getElementById("spinner");

/* --------------------------
   Debounce Utility
--------------------------- */
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

/* --------------------------
   Create Result Card
--------------------------- */
function createAndAppendSearchResult(result) {
  const { link, title, description } = result;

  const resultItemEl = document.createElement("div");
  resultItemEl.className = "result-item fade-in";

  resultItemEl.innerHTML = `
    <h5>
      <a href="${link}" target="_blank" rel="noopener noreferrer">
        ${title}
      </a>
    </h5>
    <a href="${link}" target="_blank" class="result-url">
      ${link}
    </a>
    <p>${description || "No description available."}</p>
  `;

  searchResultsEl.appendChild(resultItemEl);
}

/* --------------------------
   Display Results
--------------------------- */
function displayResults(results) {
  spinnerEl.classList.add("d-none");
  searchResultsEl.innerHTML = "";

  if (results.length === 0) {
    searchResultsEl.innerHTML = `
      <p class="text-center text-muted mt-4">
        No results found.
      </p>
    `;
    return;
  }

  results.forEach(createAndAppendSearchResult);
}

/* --------------------------
   Fetch Data
--------------------------- */
async function fetchResults(query) {
  if (!query) return;

  spinnerEl.classList.remove("d-none");
  searchResultsEl.innerHTML = "";

  try {
    const response = await fetch(
      `https://apis.ccbp.in/wiki-search?search=${query}`
    );

    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    displayResults(data.search_results);
  } catch (error) {
    spinnerEl.classList.add("d-none");
    searchResultsEl.innerHTML = `
      <p class="text-danger text-center mt-4">
        Something went wrong. Try again.
      </p>
    `;
  }
}

/* --------------------------
   Event Listener (Debounced)
--------------------------- */
const debouncedSearch = debounce((event) => {
  const value = event.target.value.trim();
  fetchResults(value);
}, 500);

searchInputEl.addEventListener("input", debouncedSearch);