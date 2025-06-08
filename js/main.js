window.onload = function () {
  window.scrollTo(0, 0);
};

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const navbar = document.querySelector(".navbar");
  const navbarCollapse = document.getElementById("navbarSupportedContent");
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
  const pdfError = document.getElementById("pdfError");

  const successMessage = document.getElementById("formSuccess");
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  const phoneToggleBtn = document.getElementById("phoneToggleBtn");
  const phoneDropdown = document.getElementById("phoneDropdown");

  let validationErrors = {
    name: false,
    email: false,
    phone: false,
    message: false,
    pdf: false
  };

  window.addEventListener("scroll", () => {
    scrollToTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  navbarCollapse.addEventListener("show.bs.collapse", () => {
    navbar.classList.add("show-bg");
  });

  navbarCollapse.addEventListener("hide.bs.collapse", () => {
    navbar.classList.remove("show-bg");
  });

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
      if (input) {
        const placeholder = input.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) input.placeholder = placeholder;
      }
    });
  }

  function updateErrorMessages(lang) {
    const isRTL = lang === 'ar';

    if (validationErrors.name) {
      nameError.innerHTML = isRTL ? "الاسم يجب أن يكون على الأقل 3 أحرف." : "Name must be at least 3 characters.";
    }
    if (validationErrors.email) {
      emailError.innerHTML = isRTL ? "يرجى إدخال بريد إلكتروني صالح." : "Please enter a valid email.";
    }
    if (validationErrors.phone) {
      phoneError.innerHTML = isRTL ? "يرجى إدخال رقم هاتف صالح." : "Please enter a valid phone number.";
    }
    if (validationErrors.message) {
      messageError.innerHTML = isRTL ? "يجب أن تكون الرسالة 10 أحرف على الأقل." : "Message must be at least 10 characters.";
    }
  }

  langSwitchBtn.addEventListener('click', () => {
    const currentLang = langSwitchBtn.getAttribute('data-lang');
    const newLang = currentLang === 'ar' ? 'en' : 'ar';

    translatableElements.forEach(el => {
      const icon = el.querySelector('i');
      const text = el.getAttribute(`data-${newLang}`);
      el.innerHTML = '';
      if (icon) {
        el.appendChild(icon);
        el.append(' ' + text);
      } else {
        el.innerHTML = text;
      }
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

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';
    const pdfFile = pdfInput?.files[0];

    if (name.length < 3) {
      validationErrors.name = true;
      nameError.innerHTML = isRTL ? "الاسم يجب أن يكون على الأقل 3 أحرف." : "Name must be at least 3 characters.";
      isValid = false;
    } else {
      validationErrors.name = false;
      nameError.innerHTML = "";
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      validationErrors.email = true;
      emailError.innerHTML = isRTL ? "يرجى إدخال بريد إلكتروني صالح." : "Please enter a valid email.";
      isValid = false;
    } else {
      validationErrors.email = false;
      emailError.innerHTML = "";
    }

    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(phone)) {
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

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

      if (validateAll()) {
        const formData = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          message: messageInput.value.trim(),
          pdfFileName: pdfInput?.files[0]?.name || "None"
        };
        let submissions = JSON.parse(localStorage.getItem("formSubmissions")) || [];
        submissions.push(formData);
        localStorage.setItem("formSubmissions", JSON.stringify(submissions));

        if (successMessage) {
          successMessage.innerHTML = isRTL
            ? "لقد تم ارسال الرسالة بنجاح"
            : "The message has been sent successfully.";
          successMessage.classList.remove("d-none");
        }

        form.reset();
        validationErrors = { name: false, email: false, phone: false, message: false, pdf: false };

        setTimeout(() => {
          if (successMessage) successMessage.classList.add("d-none");
        }, 3000);
      } else {
        successMessage?.classList.add("d-none");
      }
    });
  }

  AOS.init({
    offset: 120,
    duration: 1000,
    easing: 'ease-in-out',
  });
});
