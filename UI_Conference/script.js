let posters = [];
let selectedPoster = null;

const filterValues = {
  title: ['AGU: Earth Science', 'AGU: Ocean Models', 'AGU: Climate Trends'],
  subject: ['Geophysics', 'Atmosphere', 'Hydrology'],
  presenter: ['Dr. Alex Rivera', 'Prof. Dana Kim'],
  lab: ['GeoData Lab', 'Climate Systems Lab'],
  year: ['2023', '2024'],
  tag: ['Remote Sensing', 'Forecast']
};

const activeFilters = {};

function fetchData() {
  fetch("posters.json")
    .then(response => response.json())
    .then(data => {
      posters = data;
      updateUI();
    })
    .catch(error => {
      console.error("Error loading posters.json:", error);
      document.getElementById('posterGrid').innerHTML = "<p>Failed to load poster data.</p>";
    });
}

function setFilter(type, value) {
  activeFilters[type] = value;
  updateUI();
}

function resetFilters() {
  Object.keys(activeFilters).forEach(key => delete activeFilters[key]);
  document.getElementById('optionButtons').innerHTML = `<em>No filter category selected.</em>`;
  document.querySelector('#filterOptions h4').textContent = `Select Filter Option:`;
  selectedPoster = null;
  updateUI();
}

function updateUI() {
  const grid = document.getElementById('posterGrid');
  const filterDisplay = document.getElementById('activeFilters');
  const preview = document.getElementById('posterPreview');

  const keys = Object.keys(activeFilters);
  filterDisplay.innerHTML = keys.length === 0
    ? "<strong>Active Filters:</strong> None"
    : `<strong>Active Filters:</strong> ${keys.map(k => `${k}: ${activeFilters[k]}`).join(', ')}`;

  const filtered = posters.filter(p =>
    Object.entries(activeFilters).every(([k, v]) => p[k] === v)
  );

  grid.innerHTML = '';
  filtered.forEach(p => {
    const div = document.createElement('div');
    div.className = 'poster';
    div.innerHTML = `
      <img src="${p.image}" alt="Poster Thumbnail"> 
      <div class="poster-title">${p.title}</div>
      <div class="poster-subject">${p.subject}</div>
      <div class="poster-presenter">${p.presenter}</div>
    `;
    div.addEventListener('click', () => showPoster(p));
    grid.appendChild(div);
  });

  if (!selectedPoster) {
    preview.innerHTML = `<p>Select a poster to see details here.</p>`;
  }
}

function showOptions(type) {
  const options = filterValues[type] || [];
  const container = document.getElementById('optionButtons');
  container.innerHTML = options.map(opt =>
    `<button onclick="setFilter('${type}', '${opt}')">${opt}</button>`
  ).join('');
  document.querySelector('#filterOptions h4').textContent = `Select Filter Option: ${type.charAt(0).toUpperCase() + type.slice(1)}`;
}

function showPoster(poster) {
  selectedPoster = poster;
  const preview = document.getElementById('posterPreview');
  preview.innerHTML = `
	  <img src="${poster.image}" alt="Poster Image" class="img-fluid mb-3 rounded shadow-sm" />

	  <p><strong class="label">Title:</strong> <span class="value">${poster.title}</span></p>
	  <p><strong class="label">Subject:</strong> <span class="value">${poster.subject}</span></p>
	  <p><strong class="label">Presenter:</strong> <span class="value">${poster.presenter}</span></p>
	  <p><strong class="label">Lab:</strong> <span class="value">${poster.lab}</span></p>
	  <p><strong class="label">Year:</strong> <span class="value">${poster.year}</span></p>
	  <p><strong class="label">Presentation Time:</strong> <span class="value">${poster.time}</span></p>

	  <p class="desc mt-3">${poster.description}</p>

	  <div class="mt-3">
		<strong class="label">Tags:</strong>
		<span class="tag">${poster.tag}</span>
	  </div>

	  <div class="d-grid gap-2 mt-4">
		  <button class="btn btn-primary" onclick="navigateToDetails(${poster.id})">View Full Poster</button>
		  <button class="btn btn-primary" onclick="navigateToStory(${poster.id})">Inquiry Story</button>
	  </div>

	`;

  if (window.ue && ue.interface && ue.interface.receivePoster) {
    ue.interface.receivePoster(JSON.stringify(poster));
  }
}

function navigateToDetails(id) {
  window.location.href = `PosterDetails.html?id=${id}`;
}

function navigateToStory(id) {
  window.location.href = `PosterStory.html?id=${id}`;
}

document.querySelectorAll('.category-buttons button[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-filter');
    showOptions(type);
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  resetFilters();
});

fetchData(); // Load data from JSON on page load
