class CryptoLab {
  constructor() {
    this.inputText = document.getElementById('inputText');
    this.outputText = document.getElementById('outputText');
    this.algorithmSelect = document.getElementById('algorithmSelect');
    this.keyInput = document.getElementById('keyInput');
    this.charCount = document.getElementById('charCount');

    this.init();
    this.initChecklist();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollEffects();
    this.setupMobileNav();
    this.updateCharCount();
    this.updateAlgorithmInfo();
  }

  setupEventListeners() {
    // Основные кнопки
    document
      .getElementById('encryptBtn')
      ?.addEventListener('click', () => this.encrypt());
    document
      .getElementById('decryptBtn')
      ?.addEventListener('click', () => this.decrypt());
    document
      .getElementById('clearBtn')
      ?.addEventListener('click', () => this.clear());
    document
      .getElementById('copyBtn')
      ?.addEventListener('click', () => this.copy());
    document
      .getElementById('generateKeyBtn')
      ?.addEventListener('click', () => this.generateKey());

    // Счётчик символов
    this.inputText?.addEventListener('input', () => this.updateCharCount());

    // Смена алгоритма
    this.algorithmSelect?.addEventListener('change', () =>
      this.updateAlgorithmInfo(),
    );
  }

  setupScrollEffects() {
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
      // Шапка
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      // Прогресс
      if (scrollProgress) {
        const windowHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
      }

      // Кнопка наверх
      if (scrollTop) {
        if (window.scrollY > 500) {
          scrollTop.classList.add('visible');
        } else {
          scrollTop.classList.remove('visible');
        }
      }

      // Активная ссылка в меню
      this.updateActiveNavLink();
    });
  }

  setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-bars');
          icon.classList.toggle('fa-times');
        }
      });

      // Закрываем меню при клике на ссылку
      document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          const icon = navToggle.querySelector('i');
          if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
          }
        });
      });
    }
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.clientHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  updateCharCount() {
    if (this.charCount && this.inputText) {
      this.charCount.textContent = this.inputText.value.length;
    }
  }

  updateAlgorithmInfo() {
    const infoElement = document
      .getElementById('algorithmInfo')
      ?.querySelector('p');
    if (!infoElement || !this.algorithmSelect) return;

    const algorithms = {
      caesar:
        'Шифр Цезаря — каждый символ заменяется символом, находящимся на постоянное число позиций левее или правее в алфавите. Простейший шифр сдвига.',
      vigenere:
        'Шифр Виженера — полиалфавитный шифр, использующий ключевое слово. Разные символы шифруются разными сдвигами.',
      xor: 'XOR шифрование — побитовая операция исключающего ИЛИ между текстом и ключом. Обратимая операция.',
      base64:
        'Base64 — кодирование двоичных данных в текстовый формат. Не является шифрованием, но часто используется для передачи данных.',
      atbash:
        'Шифр Атбаш — моноалфавитный шифр, где первая буква заменяется последней, вторая — предпоследней и так далее.',
    };

    infoElement.textContent =
      algorithms[this.algorithmSelect.value] || algorithms.caesar;
  }

  generateKey() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    const length = Math.floor(Math.random() * 10) + 8;

    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (this.keyInput) {
      this.keyInput.value = key;
    }

    this.showNotification('Новый ключ сгенерирован', 'success');
  }

  encrypt() {
    if (!this.validateInputs()) return;

    try {
      const result = this.processText(true);
      if (this.outputText) {
        this.outputText.value = result;
        this.showNotification('Текст зашифрован', 'success');
      }
    } catch (error) {
      this.showNotification('Ошибка шифрования', 'error');
    }
  }

  decrypt() {
    if (!this.validateInputs()) return;

    try {
      const result = this.processText(false);
      if (this.outputText) {
        this.outputText.value = result;
        this.showNotification('Текст расшифрован', 'success');
      }
    } catch (error) {
      this.showNotification('Ошибка расшифрования', 'error');
    }
  }

  validateInputs() {
    if (!this.inputText?.value.trim()) {
      this.showNotification('Введите текст', 'warning');
      return false;
    }

    const algorithm = this.algorithmSelect?.value;
    const key = this.keyInput?.value.trim();

    if ((algorithm === 'vigenere' || algorithm === 'xor') && !key) {
      this.showNotification('Введите ключ', 'warning');
      return false;
    }

    return true;
  }

  processText(encrypt) {
    const text = this.inputText.value;
    const algorithm = this.algorithmSelect.value;
    const key = this.keyInput?.value || '';

    switch (algorithm) {
      case 'caesar':
        return this.caesarCipher(text, this.calculateShift(key), encrypt);
      case 'vigenere':
        return this.vigenereCipher(text, key, encrypt);
      case 'xor':
        return this.xorCipher(text, key);
      case 'base64':
        return encrypt
          ? btoa(unescape(encodeURIComponent(text)))
          : decodeURIComponent(escape(atob(text)));
      case 'atbash':
        return this.atbashCipher(text);
      default:
        return text;
    }
  }

  caesarCipher(text, shift, encrypt) {
    const actualShift = encrypt ? shift : -shift;
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);

      // Русские буквы
      if (code >= 1040 && code <= 1071) {
        // А-Я
        let newCode =
          ((((code - 1040 + actualShift + 32) % 32) + 32) % 32) + 1040;
        result += String.fromCharCode(newCode);
      } else if (code >= 1072 && code <= 1103) {
        // а-я
        let newCode =
          ((((code - 1072 + actualShift + 32) % 32) + 32) % 32) + 1072;
        result += String.fromCharCode(newCode);
      }
      // Английские буквы
      else if (code >= 65 && code <= 90) {
        // A-Z
        let newCode = ((((code - 65 + actualShift + 26) % 26) + 26) % 26) + 65;
        result += String.fromCharCode(newCode);
      } else if (code >= 97 && code <= 122) {
        // a-z
        let newCode = ((((code - 97 + actualShift + 26) % 26) + 26) % 26) + 97;
        result += String.fromCharCode(newCode);
      } else {
        result += char;
      }
    }

    return result;
  }

  vigenereCipher(text, key, encrypt) {
    const cleanKey = key.toLowerCase().replace(/[^a-zа-яё]/gi, '');
    if (!cleanKey) return text;

    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);

      // Определяем алфавит
      let alphabetSize, base;
      if (code >= 1040 && code <= 1071) {
        // А-Я
        alphabetSize = 32;
        base = 1040;
      } else if (code >= 1072 && code <= 1103) {
        // а-я
        alphabetSize = 32;
        base = 1072;
      } else if (code >= 65 && code <= 90) {
        // A-Z
        alphabetSize = 26;
        base = 65;
      } else if (code >= 97 && code <= 122) {
        // a-z
        alphabetSize = 26;
        base = 97;
      } else {
        result += char;
        continue;
      }

      // Получаем сдвиг из ключа
      const keyChar = cleanKey[keyIndex % cleanKey.length];
      const keyCode = keyChar.charCodeAt(0);
      const keyShift = keyCode >= 97 ? keyCode - 97 : keyCode - 1072;

      const shift = encrypt ? keyShift : -keyShift;
      const newCode =
        ((((code - base + shift + alphabetSize) % alphabetSize) +
          alphabetSize) %
          alphabetSize) +
        base;

      result += String.fromCharCode(newCode);
      keyIndex++;
    }

    return result;
  }

  xorCipher(text, key) {
    if (!key) return text;

    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyCode = key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode ^ keyCode);
    }

    return result;
  }

  atbashCipher(text) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);

      if (code >= 1040 && code <= 1071) {
        // А-Я
        result += String.fromCharCode(1071 - (code - 1040));
      } else if (code >= 1072 && code <= 1103) {
        // а-я
        result += String.fromCharCode(1103 - (code - 1072));
      } else if (code >= 65 && code <= 90) {
        // A-Z
        result += String.fromCharCode(90 - (code - 65));
      } else if (code >= 97 && code <= 122) {
        // a-z
        result += String.fromCharCode(122 - (code - 97));
      } else {
        result += char;
      }
    }

    return result;
  }

  calculateShift(key) {
    if (!key) return 3;

    let sum = 0;
    for (let i = 0; i < key.length; i++) {
      sum += key.charCodeAt(i);
    }

    return (sum % 25) + 1;
  }

  clear() {
    if (this.inputText) this.inputText.value = '';
    if (this.outputText) this.outputText.value = '';
    if (this.keyInput) this.keyInput.value = 'секрет';
    this.updateCharCount();
    this.showNotification('Поля очищены', 'info');
  }

  copy() {
    if (!this.outputText?.value) {
      this.showNotification('Нет данных для копирования', 'warning');
      return;
    }

    this.outputText.select();
    document.execCommand('copy');
    this.showNotification('Скопировано в буфер обмена', 'success');
  }

  // Инициализация чек-листа
  initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const progressEl = document.getElementById('checklistProgress');
    const resetBtn = document.getElementById('checklistResetBtn');

    if (!checkboxes.length || !progressEl) return;

    // Загрузка сохранённого состояния
    const savedState = localStorage.getItem('cryptolab_checklist');
    if (savedState) {
      const states = JSON.parse(savedState);
      checkboxes.forEach((checkbox, index) => {
        if (states[index]) {
          checkbox.checked = true;
        }
      });
    }

    // Обновление прогресса
    const updateProgress = () => {
      const checkedCount = document.querySelectorAll(
        '.checklist-checkbox:checked',
      ).length;
      progressEl.textContent = `${checkedCount}/${checkboxes.length} выполнено`;

      // Сохраняем состояние
      const states = Array.from(checkboxes).map((cb) => cb.checked);
      localStorage.setItem('cryptolab_checklist', JSON.stringify(states));

      // Поздравление при 100%
      if (checkedCount === checkboxes.length) {
        this.showNotification('🎉 Отлично! Все пункты выполнены!', 'success');
      }
    };

    // Добавляем обработчики
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', updateProgress);
    });

    // Кнопка сброса
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        checkboxes.forEach((cb) => (cb.checked = false));
        updateProgress();
        this.showNotification('Чек-лист сброшен', 'info');
      });
    }

    // Первоначальное обновление
    updateProgress();
  }

  showNotification(message, type = 'info') {
    // Удаляем предыдущие уведомления
    document.querySelectorAll('.notification').forEach((n) => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  getIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };
    return icons[type] || icons.info;
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  new CryptoLab();
});
