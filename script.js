/**
 * CryptoLab - Образовательный портал по криптографии
 * Основной JavaScript файл
 */

// Основной объект приложения
const CryptoLab = {
  // Инициализация
  init() {
    console.log('🚀 CryptoLab инициализируется...');

    this.setupEventListeners();
    this.setupScrollIndicator();
    this.setupScrollToTop();
    this.setupCarousel();
    this.setupCharacterCounter();
    this.setupNavigation();
    this.setupSmoothScroll();
    this.setupExamples();
    this.setupDemo();

    // Инициализация информации об алгоритмах
    this.updateAlgorithmInfo();

    console.log('✅ CryptoLab готов к работе!');
  },

  // Настройка обработчиков событий
  setupEventListeners() {
    // Лаборатория
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const keyGenerateBtn = document.getElementById('keyGenerate');
    const algorithmSelect = document.getElementById('algorithmSelect');

    if (encryptBtn) encryptBtn.addEventListener('click', () => this.handleEncrypt());
    if (decryptBtn) decryptBtn.addEventListener('click', () => this.handleDecrypt());
    if (clearBtn) clearBtn.addEventListener('click', () => this.handleClear());
    if (copyBtn) copyBtn.addEventListener('click', () => this.handleCopy());
    if (keyGenerateBtn) keyGenerateBtn.addEventListener('click', () => this.generateKey());
    if (algorithmSelect) algorithmSelect.addEventListener('change', () => this.updateAlgorithmInfo());
  },

  // Навигация
  setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');

        // Обновляем aria-атрибут
        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
      });

      // Закрытие меню при клике на ссылку
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.querySelector('i').classList.add('fa-bars');
          navToggle.querySelector('i').classList.remove('fa-times');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Обновление активной ссылки при скролле
    window.addEventListener('scroll', () => this.updateActiveNavLink());
  },

  // Плавный скролл
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Пропускаем якорь без id
        if (href === '#') return;

        const targetElement = document.querySelector(href);
        if (!targetElement) return;

        e.preventDefault();

        // Плавная прокрутка
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Обновляем URL без перезагрузки
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      });
    });
  },

  // Обновление активной ссылки в навигации
  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  },

  // Индикатор прокрутки
  setupScrollIndicator() {
    const scrollProgress = document.getElementById('scrollProgress');

    if (!scrollProgress) return;

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgress.style.width = `${scrolled}%`;

      // Обновляем шапку при скролле
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  },

  // Кнопка "Наверх"
  setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  },

  // Счетчик символов
  setupCharacterCounter() {
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');

    if (!inputText || !charCount) return;

    const updateCounter = () => {
      const count = inputText.value.length;
      charCount.textContent = count;

      // Меняем цвет при большом количестве символов
      if (count > 1000) {
        charCount.style.color = 'var(--warning)';
      } else if (count > 500) {
        charCount.style.color = 'var(--info)';
      } else {
        charCount.style.color = '';
      }
    };

    inputText.addEventListener('input', updateCounter);
    updateCounter(); // Инициализация
  },

  // Карусель
  setupCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');

    if (!carouselTrack || !prevBtn || !nextBtn) return;

    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoSlideInterval;

    // Устанавливаем общее количество слайдов
    if (totalSlidesEl) {
      totalSlidesEl.textContent = totalSlides;
    }

    // Функция для перехода к слайду
    const goToSlide = (index) => {
      // Корректируем индекс для циклической прокрутки
      if (index >= totalSlides) index = 0;
      if (index < 0) index = totalSlides - 1;

      // Обновляем активный слайд
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
          slide.classList.add('active');
        }
      });

      // Обновляем индикаторы
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });

      // Обновляем счетчик
      if (currentSlideEl) {
        currentSlideEl.textContent = index + 1;
      }

      currentIndex = index;
    };

    // Кнопки навигации
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    });

    // Индикаторы
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
      });
    });

    // Автоматическая прокрутка
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 10000); // Каждые 10 секунд
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    // Останавливаем автопрокрутку при наведении
    const carousel = document.getElementById('carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
      });

      carousel.addEventListener('mouseleave', () => {
        startAutoSlide();
      });
    }

    // Навигация с клавиатуры
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
        resetAutoSlide();
      }
    });

    // Инициализация
    goToSlide(0);
    startAutoSlide();
  },

  // Быстрые примеры
  setupExamples() {
    const exampleBtns = document.querySelectorAll('.example-btn');

    exampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        const algo = btn.getAttribute('data-algo');

        const inputText = document.getElementById('inputText');
        const algorithmSelect = document.getElementById('algorithmSelect');

        if (inputText) {
          inputText.value = text;
          inputText.dispatchEvent(new Event('input')); // Обновляем счетчик
        }

        if (algorithmSelect && algo) {
          algorithmSelect.value = algo;
          this.updateAlgorithmInfo();
        }

        // Прокручиваем к лаборатории
        const labSection = document.getElementById('lab');
        if (labSection) {
          labSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Показываем уведомление
        this.showNotification(`Пример загружен: ${btn.querySelector('.example-text').textContent}`, 'info');
      });
    });
  },

  // Демо
  setupDemo() {
    const demoBtn = document.getElementById('demoBtn');

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        // Заполняем поля демо-данными
        const inputText = document.getElementById('inputText');
        const algorithmSelect = document.getElementById('algorithmSelect');
        const keyInput = document.getElementById('keyInput');

        if (inputText) inputText.value = 'Демонстрация работы криптографической лаборатории CryptoLab';
        if (algorithmSelect) algorithmSelect.value = 'vigenere';
        if (keyInput) keyInput.value = 'демо';

        // Обновляем счетчик и информацию
        if (inputText) inputText.dispatchEvent(new Event('input'));
        this.updateAlgorithmInfo();

        // Запускаем шифрование
        setTimeout(() => {
          this.handleEncrypt();
        }, 500);

        // Показываем уведомление
        this.showNotification('Демонстрация запущена!', 'success');
      });
    }
  },

  // Генерация ключа
  generateKey() {
    const keyInput = document.getElementById('keyInput');
    if (!keyInput) return;

    // Генерируем случайный ключ
    const chars = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';

    // Длина ключа от 8 до 16 символов
    const length = Math.floor(Math.random() * 9) + 8;

    for (let i = 0; i < length; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }

    keyInput.value = key;
    this.showNotification(`Сгенерирован новый ключ: ${key}`, 'info');
  },

  // Обновление информации об алгоритме
  updateAlgorithmInfo() {
    const algorithmSelect = document.getElementById('algorithmSelect');
    const algorithmInfo = document.getElementById('algorithmInfo');

    if (!algorithmSelect || !algorithmInfo) return;

    const algorithms = {
      caesar: {
        name: 'Шифр Цезаря',
        description: 'Один из древнейших методов шифрования, названный в честь Юлия Цезаря. Каждая буква в тексте заменяется буквой, находящейся на фиксированное число позиций дальше в алфавите. Простой в реализации, но уязвим к частотному анализу.'
      },
      vigenere: {
        name: 'Шифр Виженера',
        description: 'Полиалфавитный шифр, использующий ключевое слово для шифрования. Более безопасен, чем шифр Цезаря, так как использует разные сдвиги для разных позиций в тексте. Считался невзламываемым на протяжении трех столетий.'
      },
      xor: {
        name: 'XOR шифрование',
        description: 'Использует операцию исключающего ИЛИ (XOR) между текстом и ключом. Если ключ короче текста, он повторяется. Широко используется в компьютерных системах благодаря простоте и скорости, но требует случайного ключа для безопасности.'
      },
      base64: {
        name: 'Base64 кодирование',
        description: 'Схема кодирования двоичных данных в текстовый формат ASCII. Не является шифрованием в строгом смысле, так как не использует ключ и легко обратима. Используется для передачи данных через текстовые протоколы (email, HTTP).'
      },
      atbash: {
        name: 'Шифр Атбаш',
        description: 'Моноалфавитный шифр подстановки, в котором первая буква алфавита заменяется на последнюю, вторая — на предпоследнюю и так далее. Использовался в древних текстах, включая Библию.'
      }
    };

    const selected = algorithmSelect.value;
    const algo = algorithms[selected] || algorithms.caesar;

    algorithmInfo.innerHTML = `<strong>${algo.name}:</strong> ${algo.description}`;
  },

  // Шифрование
  handleEncrypt() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const algorithmSelect = document.getElementById('algorithmSelect');
    const keyInput = document.getElementById('keyInput');

    if (!inputText || !outputText || !algorithmSelect || !keyInput) return;

    const text = inputText.value.trim();
    const algorithm = algorithmSelect.value;
    const key = keyInput.value.trim();

    if (!text) {
      this.showNotification('Введите текст для шифрования', 'warning');
      inputText.focus();
      return;
    }

    try {
      const result = this.encrypt(text, algorithm, key);
      outputText.value = result;
      this.showNotification('Текст успешно зашифрован', 'success');
    } catch (error) {
      console.error('Ошибка шифрования:', error);
      this.showNotification(`Ошибка шифрования: ${error.message}`, 'error');
    }
  },

  // Дешифрование
  handleDecrypt() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const algorithmSelect = document.getElementById('algorithmSelect');
    const keyInput = document.getElementById('keyInput');

    if (!inputText || !outputText || !algorithmSelect || !keyInput) return;

    const text = inputText.value.trim();
    const algorithm = algorithmSelect.value;
    const key = keyInput.value.trim();

    if (!text) {
      this.showNotification('Введите текст для расшифрования', 'warning');
      inputText.focus();
      return;
    }

    try {
      const result = this.decrypt(text, algorithm, key);
      outputText.value = result;
      this.showNotification('Текст успешно расшифрован', 'success');
    } catch (error) {
      console.error('Ошибка дешифрования:', error);
      this.showNotification(`Ошибка расшифрования: ${error.message}`, 'error');
    }
  },

  // Очистка
  handleClear() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const keyInput = document.getElementById('keyInput');

    if (inputText) inputText.value = '';
    if (outputText) outputText.value = '';
    if (keyInput) keyInput.value = 'секрет';

    // Обновляем счетчик
    if (inputText) inputText.dispatchEvent(new Event('input'));

    this.showNotification('Все поля очищены', 'info');

    if (inputText) inputText.focus();
  },

  // Копирование
  handleCopy() {
    const outputText = document.getElementById('outputText');

    if (!outputText || !outputText.value.trim()) {
      this.showNotification('Нет данных для копирования', 'warning');
      return;
    }

    outputText.select();
    outputText.setSelectionRange(0, 99999); // Для мобильных

    try {
      navigator.clipboard.writeText(outputText.value).then(() => {
        this.showNotification('Текст скопирован в буфер обмена', 'success');

        // Визуальная обратная связь
        const copyBtn = document.getElementById('copyBtn');
        if (copyBtn) {
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = '<i class="fas fa-check"></i>';
          copyBtn.style.backgroundColor = 'var(--success)';

          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.backgroundColor = '';
          }, 2000);
        }
      }).catch(err => {
        // Fallback для старых браузеров
        document.execCommand('copy');
        this.showNotification('Текст скопирован в буфер обмена', 'success');
      });
    } catch (err) {
      this.showNotification('Не удалось скопировать текст', 'error');
    }
  },

  // Алгоритмы шифрования
  encrypt(text, algorithm, key) {
    switch (algorithm) {
      case 'caesar':
        return this.caesarCipher(text, key, true);
      case 'vigenere':
        return this.vigenereCipher(text, key, true);
      case 'xor':
        return this.xorCipher(text, key);
      case 'base64':
        return btoa(unescape(encodeURIComponent(text)));
      case 'atbash':
        return this.atbashCipher(text);
      default:
        throw new Error('Неизвестный алгоритм шифрования');
    }
  },

  decrypt(text, algorithm, key) {
    switch (algorithm) {
      case 'caesar':
        return this.caesarCipher(text, key, false);
      case 'vigenere':
        return this.vigenereCipher(text, key, false);
      case 'xor':
        return this.xorCipher(text, key); // XOR обратим
      case 'base64':
        try {
          return decodeURIComponent(escape(atob(text)));
        } catch (e) {
          throw new Error('Некорректные данные Base64');
        }
      case 'atbash':
        return this.atbashCipher(text); // Атбаш обратим сам себе
      default:
        throw new Error('Неизвестный алгоритм шифрования');
    }
  },

  // Шифр Цезаря
  caesarCipher(text, key, encrypt) {
    const shift = this.calculateShift(key);
    let result = '';

    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      const charCode = text.charCodeAt(i);

      // Русские буквы
      if (charCode >= 1040 && charCode <= 1071) { // А-Я
        const base = 1040;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(((charCode - base + offset + 32) % 32) + base);
      } else if (charCode >= 1072 && charCode <= 1103) { // а-я
        const base = 1072;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(((charCode - base + offset + 32) % 32) + base);
      }
      // Английские буквы
      else if (charCode >= 65 && charCode <= 90) { // A-Z
        const base = 65;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(((charCode - base + offset + 26) % 26) + base);
      } else if (charCode >= 97 && charCode <= 122) { // a-z
        const base = 97;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(((charCode - base + offset + 26) % 26) + base);
      }

      result += char;
    }

    return result;
  },

  // Шифр Виженера
  vigenereCipher(text, key, encrypt) {
    const cleanKey = key.toLowerCase().replace(/[^а-яa-z]/g, '');
    if (cleanKey.length === 0) return text;

    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      const charCode = text.charCodeAt(i);

      // Определяем алфавит
      let alphabetSize, base;
      if (charCode >= 1040 && charCode <= 1071) { // А-Я
        alphabetSize = 32;
        base = 1040;
      } else if (charCode >= 1072 && charCode <= 1103) { // а-я
        alphabetSize = 32;
        base = 1072;
      } else if (charCode >= 65 && charCode <= 90) { // A-Z
        alphabetSize = 26;
        base = 65;
      } else if (charCode >= 97 && charCode <= 122) { // a-z
        alphabetSize = 26;
        base = 97;
      } else {
        result += char;
        continue;
      }

      // Сдвиг из ключа
      const keyChar = cleanKey[keyIndex % cleanKey.length];
      const keyCharCode = keyChar.charCodeAt(0);
      const keyShift = keyCharCode >= 1072 ? keyCharCode - 1072 : keyCharCode - 97;

      // Применяем сдвиг
      const offset = encrypt ? keyShift : -keyShift;
      const newCharCode = ((charCode - base + offset + alphabetSize) % alphabetSize) + base;
      char = String.fromCharCode(newCharCode);

      result += char;
      keyIndex++;
    }

    return result;
  },

  // XOR шифрование
  xorCipher(text, key) {
    if (!key) return text;

    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }

    return result;
  },

  // Шифр Атбаш
  atbashCipher(text) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charCode = text.charCodeAt(i);

      // Русские буквы
      if (charCode >= 1040 && charCode <= 1071) { // А-Я
        result += String.fromCharCode(1071 - (charCode - 1040));
      } else if (charCode >= 1072 && charCode <= 1103) { // а-я
        result += String.fromCharCode(1103 - (charCode - 1072));
      }
      // Английские буквы
      else if (charCode >= 65 && charCode <= 90) { // A-Z
        result += String.fromCharCode(90 - (charCode - 65));
      } else if (charCode >= 97 && charCode <= 122) { // a-z
        result += String.fromCharCode(122 - (charCode - 97));
      }
      // Остальные символы
      else {
        result += char;
      }
    }

    return result;
  },

  // Вспомогательные функции
  calculateShift(key) {
    if (!key) return 3;

    let sum = 0;
    for (let i = 0; i < key.length; i++) {
      sum += key.charCodeAt(i);
    }

    return (sum % 25) + 1;
  },

  // Уведомления
  showNotification(message, type = 'info') {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => {
      notification.remove();
    });

    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Стили
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? '#10b981' :
        type === 'error' ? '#ef4444' :
          type === 'warning' ? '#f59e0b' :
            '#3b82f6',
      color: 'white',
      padding: '15px 20px',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '15px',
      minWidth: '300px',
      maxWidth: '400px',
      zIndex: '10000',
      transform: 'translateX(120%)',
      transition: 'transform 0.3s ease',
      animation: 'slideInRight 0.3s ease forwards'
    });

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Закрытие по клику
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(120%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    });

    // Автоматическое закрытие
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);

    // CSS для анимации
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(120%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
            `;
      document.head.appendChild(style);
    }
  }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  CryptoLab.init();
});

// Добавляем CSS для анимаций при скролле
const scrollAnimationStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .section {
        animation: fadeInUp 0.8s ease;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = scrollAnimationStyles;
document.head.appendChild(styleSheet);