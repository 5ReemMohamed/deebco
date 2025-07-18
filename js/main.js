window.onload = function () {
  window.scrollTo(0, 0);
};

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  emailjs.init('u4p-pG092VMtXv1nO');

  const navbar = document.querySelector(".navbar");
   const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.getElementById('navbarSupportedContent');
  const langSwitchBtn = document.getElementById('langSwitch');
  const translatableElements = document.querySelectorAll('[data-en][data-ar]');
  const form = document.getElementById("contactForm");

  const nameInput = document.getElementById("UserName");
  const emailInput = document.getElementById("UserEmail");
  const phoneInput = document.getElementById("UserPhone");
  const messageInput = document.getElementById("message");
  const pdfInput = document.getElementById("pdfFile");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const messageError = document.getElementById("messageError");

  const successMessage = document.getElementById("formSuccess");
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  const phoneToggleBtn = document.getElementById("phoneToggleBtn");
  const loadingMessage = document.getElementById("formLoading");
  const phoneDropdown = document.getElementById("phoneDropdown");

  let validationErrors = { name: false, email: false, phone: false, message: false };

  window.addEventListener("scroll", () => {
    scrollToTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  scrollToTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  navbarCollapse?.addEventListener("show.bs.collapse", () => navbar.classList.add("show-bg"));
  navbarCollapse?.addEventListener("hide.bs.collapse", () => navbar.classList.remove("show-bg"));
 if (navLinks && navbarCollapse) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const isNavbarVisible = window.getComputedStyle(navbarCollapse).display !== 'none';

        if (isNavbarVisible && window.innerWidth < 992) {
          const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
          if (collapseInstance) {
            collapseInstance.hide(); 
          }
        }
      });
    });
  }
  phoneToggleBtn?.addEventListener("click", () => {
    phoneDropdown.style.display = phoneDropdown.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!phoneToggleBtn?.contains(e.target) && !phoneDropdown?.contains(e.target)) {
      phoneDropdown.style.display = "none";
    }
  });

  function updatePlaceholders(lang) {
    [nameInput, emailInput, phoneInput, messageInput, pdfInput].forEach(input => {
      const placeholder = input?.getAttribute(`data-${lang}-placeholder`);
      if (placeholder) input.placeholder = placeholder;
    });
  }

  function updateErrorMessages(lang) {
    const isRTL = lang === 'ar';
    if (validationErrors.name) nameError.innerHTML = isRTL ? "الاسم يجب أن يكون على الأقل 3 أحرف." : "Name must be at least 3 characters.";
    if (validationErrors.email) emailError.innerHTML = isRTL ? "يرجى إدخال بريد إلكتروني صالح." : "Please enter a valid email.";
    if (validationErrors.phone) phoneError.innerHTML = isRTL ? "يرجى إدخال رقم هاتف صالح." : "Please enter a valid phone number.";
    if (validationErrors.message) messageError.innerHTML = isRTL ? "يجب أن تكون الرسالة 10 أحرف على الأقل." : "Message must be at least 10 characters.";
  }

  langSwitchBtn?.addEventListener('click', () => {
    const currentLang = langSwitchBtn.getAttribute('data-lang');
    const newLang = currentLang === 'ar' ? 'en' : 'ar';

    translatableElements.forEach(el => {
      const icon = el.querySelector('i');
      const text = el.getAttribute(`data-${newLang}`);
      el.innerHTML = '';
      if (icon) el.appendChild(icon), el.append(' ' + text);
      else el.innerHTML = text;
    });

    document.documentElement.setAttribute('lang', newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.style.textAlign = newLang === 'ar' ? 'right' : 'left';
    langSwitchBtn.setAttribute('data-lang', newLang);

    updatePlaceholders(newLang);
    updateErrorMessages(newLang);
  });

  function validateAll() {
    let isValid = true;
    const dir = document.documentElement.getAttribute('dir');
    const isRTL = dir === 'rtl';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    if (name.length < 3) {
      validationErrors.name = true;
      nameError.innerHTML = isRTL ? "الاسم يجب أن يكون على الأقل 3 أحرف." : "Name must be at least 3 characters.";
      isValid = false;
    } else {
      validationErrors.name = false;
      nameError.innerHTML = "";
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      validationErrors.email = true;
      emailError.innerHTML = isRTL ? "يرجى إدخال بريد إلكتروني صالح." : "Please enter a valid email.";
      isValid = false;
    } else {
      validationErrors.email = false;
      emailError.innerHTML = "";
    }

    if (!/^[0-9]{8,15}$/.test(phone)) {
      validationErrors.phone = true;
      phoneError.innerHTML = isRTL ? "يرجى إدخال رقم هاتف صالح." : "Please enter a valid phone number.";
      isValid = false;
    } else {
      validationErrors.phone = false;
      phoneError.innerHTML = "";
    }

    if (message.length < 10) {
      validationErrors.message = true;
      messageError.innerHTML = isRTL ? "يجب أن تكون الرسالة 10 أحرف على الأقل." : "Message must be at least 10 characters.";
      isValid = false;
    } else {
      validationErrors.message = false;
      messageError.innerHTML = "";
    }

    return isValid;
  }

  [nameInput, emailInput, phoneInput, messageInput, pdfInput].forEach(input => {
    input?.addEventListener("input", validateAll);
    input?.addEventListener("change", validateAll);
  });

  form?.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateAll()) {
      successMessage?.classList.add("d-none");
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();
    const pdfFile = pdfInput?.files[0] || null;
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

    console.log("Form submitted from:", navigator.userAgent);
    console.log("PDF file:", pdfFile);
    console.log("Values:", { name, email, phone, message });

    if (pdfFile && pdfFile.size > 5 * 1024 * 1024) {
      alert(isRTL ? "حجم الملف كبير جدًا. الحد الأقصى 5." : "File is too large. Max 5MB.");
      return;
    }

    loadingMessage?.classList.remove("d-none");
    successMessage?.classList.add("d-none");

    let driveFileUrl = "";
    if (pdfFile) {
      try {
        const base64PDF = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(pdfFile);
        });

        const response = await fetch("https://script.google.com/macros/s/AKfycbx7g9ccBtk6vaY_VpiZ2rwbrqJ9qmGtWceLo8edJx4oHBPaBDAvMLC95KPPimfZMW7O/exec", {
          method: "POST",
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            file: base64PDF,
            fileName: pdfFile.name,
            mimeType: pdfFile.type
          })
        });

        const result = await response.json();
        if (result.success && result.fileUrl) {
          driveFileUrl = result.fileUrl;
        } else {
          throw new Error(result.error || "Unknown upload error");
        }
      } catch (err) {
        console.error("Drive Upload Error:", err);
        alert("Failed to upload file to Google Drive.");
        loadingMessage?.classList.add("d-none");
        return;
      }
    }

    try {
      const emailParams = {
        from_name: String(name),
        reply_to: String(email),
        phone: String(phone),
        file_url: driveFileUrl,
        message: String(message)
      };

      await emailjs.send('service_b49n80l', 'template_2zsbqir', emailParams)
        .catch(err => {
          console.error("EmailJS Error:", err);
          alert(isRTL ? "فشل إرسال البريد الإلكتروني." : "Failed to send email.");
          throw err;
        });

      const sheetURL = "https://script.google.com/macros/s/AKfycbyzImUDjTLQ5R857Eg2S-GO6g3FXR4MmqO0UiLaEWVJxvB6wjC4xi5M6hnO9-jMM-6k/exec";
      const sheetData = new FormData();
      sheetData.append("UserName", name);
      sheetData.append("UserEmail", email);
      sheetData.append("UserPhone", phone);
      sheetData.append("message", message);
      if (pdfFile) sheetData.append("pdfFile", pdfFile.name);

      await fetch(sheetURL, { method: "POST", body: sheetData });

      loadingMessage?.classList.add("d-none");
      successMessage.innerHTML = isRTL ? "تم إرسال البيانات بنجاح." : "Data sent successfully.";
      successMessage.classList.remove("d-none");
      form.reset();
      validationErrors = { name: false, email: false, phone: false, message: false };
      setTimeout(() => successMessage.classList.add("d-none"), 5000);

    } catch (error) {
      console.error("Submission Error:", error);
      loadingMessage?.classList.add("d-none");
      alert(isRTL ? "حدث خطأ أثناء إرسال البيانات." : "Error submitting form.");
    }
  });

  AOS.init({ offset: 120, duration: 1000, easing: 'ease-in-out' });
});
