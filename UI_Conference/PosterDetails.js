const id = new URLSearchParams(window.location.search).get('id');

fetch('posters.json')
  .then(res => res.json())
  .then(data => {
    const poster = data.find(p => p.id == id);
    if (!poster) {
      document.body.innerHTML = '<div class="container p-5 text-center"><h4 class="text-danger">Poster not found.</h4><a href="index.html" class="btn btn-secondary mt-3">Back to Home</a></div>';
      return;
    }

    document.getElementById('posterImage').src = poster.image;
    document.getElementById('title').textContent = poster.title;
    document.getElementById('presenter').textContent = poster.presenter;
    document.getElementById('subject').textContent = poster.subject;
    document.getElementById('lab').textContent = poster.lab;
    document.getElementById('year').textContent = poster.year;
    document.getElementById('time').textContent = poster.time;
    document.getElementById('description').textContent = poster.description;
    document.getElementById('tag').textContent = poster.tag;
  })
  .catch(err => {
    document.body.innerHTML = '<div class="container p-5 text-center"><h4 class="text-danger">Failed to load poster details.</h4><a href="index.html" class="btn btn-secondary mt-3">Back to Home</a></div>';
    console.error(err);
  });
