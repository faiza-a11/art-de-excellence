// ============ MOBILE NAV TOGGLE ============
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

mainNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
  });
});

// ============ SCROLL SPY (active nav link) ============
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

sections.forEach(section => spyObserver.observe(section));

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ============ CONTACT FORM: FILE UPLOAD, VALIDATION, SUBMIT ============
const form = document.getElementById('briefingForm');

if (form) {
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  const fileInput = document.getElementById('fileUpload');
  const dropzone = document.getElementById('dropzone');
  const fileListEl = document.getElementById('fileList');

  const MAX_FILE_MB = 50;
  let selectedFiles = [];

  // -------- Drag & drop visuals --------
  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', (e) => {
    addFiles(Array.from(e.dataTransfer.files));
  });

  fileInput.addEventListener('change', () => {
    addFiles(Array.from(fileInput.files));
  });

  function addFiles(newFiles) {
    newFiles.forEach(file => {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        formStatus.textContent = `"${file.name}" exceeds the ${MAX_FILE_MB}MB limit and was not added.`;
        formStatus.className = 'form-status error';
        return;
      }
      selectedFiles.push(file);
    });
    renderFileList();
  }

  function renderFileList() {
    fileListEl.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const li = document.createElement('li');
      const sizeKB = (file.size / 1024).toFixed(0);
      li.innerHTML = `<span>${file.name} (${sizeKB} KB)</span>`;
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        selectedFiles.splice(index, 1);
        renderFileList();
      });
      li.appendChild(removeBtn);
      fileListEl.appendChild(li);
    });
  }

  // -------- Validation --------
  function setFieldValid(field) { field.classList.remove('invalid'); }
  function setFieldInvalid(field) { field.classList.add('invalid'); }

  function validate() {
    let isValid = true;
    const fields = form.querySelectorAll('.form-field[data-field]');

    fields.forEach(field => {
      const name = field.dataset.field;
      const input = field.querySelector('input, select, textarea');
      let fieldValid = true;

      if (name === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        fieldValid = emailPattern.test(input.value.trim());
      } else {
        fieldValid = input.value.trim().length > 0;
      }

      fieldValid ? setFieldValid(field) : setFieldInvalid(field);
      if (!fieldValid) isValid = false;
    });

    return isValid;
  }

  form.querySelectorAll('.form-field[data-field] input, .form-field[data-field] select, .form-field[data-field] textarea')
    .forEach(input => {
      input.addEventListener('input', () => setFieldValid(input.closest('.form-field')));
      input.addEventListener('change', () => setFieldValid(input.closest('.form-field')));
    });

  // -------- Submit --------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    if (!validate()) {
      formStatus.textContent = 'Please fill in all required fields correctly.';
      formStatus.className = 'form-status error';
      return;
    }

    const payload = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      company: document.getElementById('company').value.trim(),
      volume: document.getElementById('volume').value.trim(),
      timeline: document.getElementById('timeline').value,
      requirements: document.getElementById('requirements').value.trim(),
      fileCount: selectedFiles.length
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Transmitting...';

    try {
      // ---- Replace this block with your real backend/API/email-service call ----
      // const formData = new FormData();
      // Object.entries(payload).forEach(([key, val]) => formData.append(key, val));
      // selectedFiles.forEach(file => formData.append('files', file));
      // const res = await fetch('https://your-api.com/briefing', { method: 'POST', body: formData });
      // if (!res.ok) throw new Error('Request failed');

      await new Promise(resolve => setTimeout(resolve, 900)); // simulated network delay

      formStatus.textContent = 'Thank you — your project brief has been received. Our team will respond within 24 hours.';
      formStatus.className = 'form-status success';
      form.reset();
      selectedFiles = [];
      renderFileList();
      form.querySelectorAll('.form-field').forEach(f => f.classList.remove('invalid'));

    } catch (err) {
      formStatus.textContent = 'Something went wrong sending your brief. Please try again or contact us directly.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Transmit Project Brief <span class="arrow">&#9993;</span>';
    }
  });
}