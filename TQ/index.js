// Function to fetch quotes from the API
const fetchQuotes = async (page) => {
  const url = `https://famous-quotes4.p.rapidapi.com/random?category=all&count=20&page=${page}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'fb476ec925msh761f93e943f39d5p195806jsn169e38dcaee6',
      'x-rapidapi-host': 'famous-quotes4.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

// DOM elements
const quoteText = document.querySelector('.quote-text');
const authorName = document.querySelector('.author-name');
const quoteCount = document.querySelector('.quote-count');
const prevQuoteButton = document.querySelector('.prev-quote');
const nextQuoteButton = document.querySelector('.next-quote');

// Variables for pagination and lazy loading
let currentPage = 1;
const quotesPerPage = 10;
let quotes = [];
let isLoading = false;

// Function to render a quote
const renderQuote = (quote, index, totalQuotes) => {
  quoteText.textContent = quote.text;
  authorName.textContent = quote.author;
  quoteCount.textContent = `${index + 1} of ${totalQuotes}`;
};

// Function to load quotes and handle lazy loading
const loadQuotes = async () => {
  if (isLoading) return;
  isLoading = true;

  try {
    const data = await fetchQuotes(currentPage);
    quotes = [...quotes, ...data];
    renderQuotesOnPage();
    isLoading = false;
  } catch (error) {
    console.error('Error loading quotes:', error);
    isLoading = false;
  }
};

// Function to render quotes on the page
const renderQuotesOnPage = () => {
  const startIndex = (currentPage - 1) * quotesPerPage;
  const endIndex = startIndex + quotesPerPage;
  const quotesToRender = quotes.slice(startIndex, endIndex);

  quotesToRender.forEach((quote, index) => {
    renderQuote(quote, startIndex + index, quotes.length);
  });
};

// Implement infinite scrolling
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    currentPage++;
    loadQuotes();
  }
});

// Initial load of quotes
loadQuotes();

let currentQuoteIndex = 0;

// Event listeners for navigation buttons
prevQuoteButton.addEventListener('click', () => {
  currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
  renderQuote(quotes[currentQuoteIndex], currentQuoteIndex, quotes.length);
});

nextQuoteButton.addEventListener('click', () => {
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  renderQuote(quotes[currentQuoteIndex], currentQuoteIndex, quotes.length);
});