import { loadProductsToUI, initializeSearch,loadGlobalHeaderFooter } from "./utilities/helpers.js";
import { PLP_PATH } from "./utilities/constants.js";
import { fetchProductsList } from "./utilities/services.js";
loadGlobalHeaderFooter();
const productsListEle = document.querySelector('ul.codebook-products-list');
const booksCountEle = document.getElementById('books-count');
const loaderElement = document.querySelector(".loading-container");
const showFiltersBtn = document.getElementById("show-filters");
const closeFiltersBtn = document.getElementById("close-filters");
const filtersContainer = document.querySelector(".codebook-filters-container");
const sortByPriceElements = document.querySelectorAll('input[type="radio"][name="sortByPrice"]');
const filterByRatingElements = document.querySelectorAll('input[type="radio"][name="filterByRating"]');
const filterByCategoryElements = document.querySelectorAll('input[type="checkbox"][name="filterByCategory"]');
const clearFiltersBtn = document.querySelector(".clear-filters");
const searchInputEle = document.getElementById("search-input");
let PRODUCTS_DATA = [];
let filterCategories = [];
let sortType = null;
let minRating = 1;
let isSearchResultsDisplayed = false;
filterByCategoryElements.forEach(ele => {
  ele.addEventListener("change", function () {
    if (this.checked) {
      filterCategories.push(this.value);
    }
    else {
      filterCategories = filterCategories.filter(category => category !== this.value);
    }
    applyFilters();
  });
})
filterByRatingElements.forEach(ele => {
  ele.addEventListener("change", function () {
    minRating = Number(this.value);
    applyFilters();
  });
})
sortByPriceElements.forEach(ele => {
  ele.addEventListener('change', function () {
    sortType = this.value;
    applyFilters();
  })
})
showFiltersBtn.addEventListener("click", function () {
  filtersContainer.classList.remove("d-none");
})
closeFiltersBtn.addEventListener("click", function () {
  filtersContainer.classList.add("d-none");
})
searchInputEle.addEventListener("input", function (e) {
  if (!this.value && isSearchResultsDisplayed) {
    updateUI(PRODUCTS_DATA);
    isSearchResultsDisplayed = false;
    updateQueryParams('');
  }
})
clearFiltersBtn.addEventListener("click", resetFilters);
function updateSearchResults(searchText) {
  const searchResults = PRODUCTS_DATA.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));
  if (searchResults.length) {
    booksCountEle.innerText = `Search Results (${searchResults.length})`;
    loadProductsToUI(searchResults, productsListEle);
    isSearchResultsDisplayed = true
    updateQueryParams(searchText);
  }
  else {
    booksCountEle.innerText = `No Results found for ${searchText} showing all results`
    isSearchResultsDisplayed = false;
    loadProductsToUI(PRODUCTS_DATA, productsListEle);
    updateQueryParams('');
  }
}
function updateQueryParams(query) {
  let newUrl = `/${PLP_PATH}`;
  if (query) {
    newUrl = `/${PLP_PATH}?q=${query}`;
  }
  window.history.replaceState({}, "", newUrl);
}
function sortProductsByPrice(sortType, collection) {
  const sortedData = JSON.parse(JSON.stringify(collection)).sort((a, b) => {
    if (sortType === "asc") {
      return a.price - b.price;
    }
    return b.price - a.price;
  })
  return sortedData;
}
function applyFilters() {
  let results = PRODUCTS_DATA;
  if (sortType) {
    results = sortProductsByPrice(sortType, results);
  }
  if (minRating > 1) {
    results = filterProductsByRating(minRating, results);
  }
  if (filterCategories.length > 0) {
    results = filterProductsByCategory(filterCategories, results);
  }
  updateUI(results);
}
function filterProductsByRating(rating, collection) {
  const filteredData = collection.filter(product => {
    return product.rating >= rating;
  })
  return filteredData;
}
function filterProductsByCategory(categories, collection) {
  let filteredProducts = collection;
  categories.forEach(category => {
    filteredProducts = filteredProducts.filter(product => product[category] === true);
  })
  return filteredProducts;
}
function updateUI(data) {
  booksCountEle.innerText = '';
  if (data && data.length > 0) {
    booksCountEle.innerText = `All eBooks (${data.length})`;
    loadProductsToUI(data, productsListEle);
  }
}
function resetFilters() {
  filterCategories = [];
  minRating = 1;
  sortType = null;
  updateUI(PRODUCTS_DATA);
}
async function fetchProducts() {
  try {
    loaderElement.classList.remove('d-none');
    const data = await fetchProductsList();
    PRODUCTS_DATA = data;
    const searchText = new URLSearchParams(window.location.search).get("q");
    if (searchText) {
      searchInputEle.value = searchText;
      updateSearchResults(searchText)
    }
    else {
      updateUI(data);
    }
  }
  catch (e) {
    booksCountEle.innerText = "Unable to fetch products please try again...";
    booksCountEle.style.color = 'red';
  }
  finally {
    loaderElement.classList.add('d-none');
  }
}
(function init() {
 
  fetchProducts();
  initializeSearch(false, updateSearchResults);
}())