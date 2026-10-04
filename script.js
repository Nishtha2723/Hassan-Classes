const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.nav a').forEach(link =>
    link.addEventListener('click', () => nav.classList.remove('open'))
  );
}

// ---------------- ADMISSION ENQUIRY ----------------
const admissionForm = document.getElementById('admissionForm');

if (admissionForm) {
  admissionForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const course = document.getElementById('course').value;
    const message = document.getElementById('message').value.trim();

    const submitButton = admissionForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Saving enquiry...';

    try {
      // First save the enquiry in MongoDB
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, course, message })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to save enquiry.');
      }

      // After database save, open WhatsApp as before
      const text =
        `Hello Hassan Sir's Tuitions,%0A%0A` +
        `I would like to enquire about admission.%0A%0A` +
        `Student Name: ${encodeURIComponent(name)}%0A` +
        `Phone: ${encodeURIComponent(phone)}%0A` +
        `Class/Course: ${encodeURIComponent(course)}%0A` +
        `Message: ${encodeURIComponent(message || 'No additional message')}`;

      window.open(`https://wa.me/919664207344?text=${text}`, '_blank');

      admissionForm.reset();
      alert('Your enquiry has been saved successfully. WhatsApp will now open.');
    } catch (error) {
      console.error(error);
      alert('Your enquiry could not be saved. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

// ---------------- FEEDBACK ----------------
const feedbackForm = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const feedbackStatus = document.getElementById('feedbackStatus');

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[ch]));
}

function renderFeedback(items) {
  if (!feedbackList) return;

  feedbackList.innerHTML = '';

  if (!items.length) {
    feedbackList.innerHTML =
      '<div class="feedback-card">' +
      '<h3>Be the first to share your feedback</h3>' +
      '<div class="meta">Students & parents</div>' +
      '<div class="stars">★★★★★</div>' +
      '<p>Your submitted feedback will appear here.</p>' +
      '</div>';
    return;
  }

  items.forEach(item => {
    const rating = Number(item.rating);
    const card = document.createElement('div');
    card.className = 'feedback-card';
    card.innerHTML =
      `<h3>${escapeHtml(item.name)}</h3>` +
      `<div class="meta">${escapeHtml(item.cls)}</div>` +
      `<div class="stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>` +
      `<p>${escapeHtml(item.message)}</p>`;
    feedbackList.appendChild(card);
  });
}

async function loadFeedback() {
  if (!feedbackList) return;

  try {
    const response = await fetch('/api/feedback');
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Could not load feedback.');
    }

    renderFeedback(result.feedback || []);
  } catch (error) {
    console.error(error);
    feedbackList.innerHTML =
      '<div class="feedback-card"><h3>Feedback is temporarily unavailable.</h3>' +
      '<p>Please try again later.</p></div>';
  }
}

if (feedbackForm) {
  feedbackForm.addEventListener('submit', async e => {
    e.preventDefault();

    const item = {
      name: document.getElementById('feedbackName').value.trim(),
      cls: document.getElementById('feedbackClass').value.trim(),
      rating: document.getElementById('feedbackRating').value,
      message: document.getElementById('feedbackMessage').value.trim()
    };

    const submitButton = feedbackForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    if (feedbackStatus) feedbackStatus.textContent = '';

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not save feedback.');
      }

      feedbackForm.reset();
      if (feedbackStatus) {
        feedbackStatus.textContent = 'Thank you! Your feedback has been saved successfully.';
      }

      await loadFeedback();
    } catch (error) {
      console.error(error);
      if (feedbackStatus) {
        feedbackStatus.textContent = 'Could not save feedback. Please try again.';
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

loadFeedback();
