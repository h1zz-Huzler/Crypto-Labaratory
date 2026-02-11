

const CryptoLab = {
  init() {
    console.log('инициализация кала');

    this.setupEventListeners();
    this.setupScrollIndicator();
    this.setupScrollToTop();
    this.setupCarousel();
    this.setupCharacterCounter();
    this.setupNavigation();
    this.setupSmoothScroll();
    this.setupExamples();
    this.setupDemo();
    this.setupHistorySection();
    this.setupLikeSystem();

    this.updateAlgorithmInfo();

    console.log('всё ок');
  },

  setupEventListeners() {
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const keyGenerateBtn = document.getElementById('keyGenerate');
    const algorithmSelect = document.getElementById('algorithmSelect');

    if (encryptBtn)
      encryptBtn.addEventListener('click', () => this.handleEncrypt());
    if (decryptBtn)
      decryptBtn.addEventListener('click', () => this.handleDecrypt());
    if (clearBtn) clearBtn.addEventListener('click', () => this.handleClear());
    if (copyBtn) copyBtn.addEventListener('click', () => this.handleCopy());
    if (downloadBtn)
      downloadBtn.addEventListener('click', () => this.handleDownload());
    if (keyGenerateBtn)
      keyGenerateBtn.addEventListener('click', () => this.generateKey());
    if (algorithmSelect)
      algorithmSelect.addEventListener('change', () =>
        this.updateAlgorithmInfo(),
      );
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

        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
      });

      document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.querySelector('i').classList.add('fa-bars');
          navToggle.querySelector('i').classList.remove('fa-times');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    window.addEventListener('scroll', () => this.updateActiveNavLink());
  },

  // Плавный скролл
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const targetElement = document.querySelector(href);
        if (!targetElement) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        if (history.pushState) {
          history.pushState(null, null, href);
        }
      });
    });
  },

  // Обновление активной ссылки
  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
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
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgress.style.width = `${scrolled}%`;

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
        behavior: 'smooth',
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

      if (count > 1000) {
        charCount.style.color = 'var(--warning)';
      } else if (count > 500) {
        charCount.style.color = 'var(--info)';
      } else {
        charCount.style.color = '';
      }
    };

    inputText.addEventListener('input', updateCounter);
    updateCounter();
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

    if (totalSlidesEl) {
      totalSlidesEl.textContent = totalSlides;
    }

    const goToSlide = (index) => {
      if (index >= totalSlides) index = 0;
      if (index < 0) index = totalSlides - 1;

      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
          slide.classList.add('active');
        }
      });

      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });

      if (currentSlideEl) {
        currentSlideEl.textContent = index + 1;
      }

      currentIndex = index;
    };

    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    });

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
      });
    });

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 12000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    const carousel = document.getElementById('carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
      });

      carousel.addEventListener('mouseleave', () => {
        startAutoSlide();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
        resetAutoSlide();
      }
    });

    goToSlide(0);
    startAutoSlide();
  },

  // Историческая справка
  setupHistorySection() {
    this.setupTimelineAnimation();
  },

  // Анимация таймлайна
  setupTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    timelineItems.forEach((item) => {
      observer.observe(item);
    });
  },

  // Система лайков - ЧЕСТНАЯ ВЕРСИЯ
  setupLikeSystem() {
    const likeButton = document.getElementById('likeButton');
    const likeIcon = document.getElementById('likeIcon');
    const likeCount = document.getElementById('likeCount');
    const likeButtonText = document.getElementById('likeButtonText');
    const likeAchievement = document.getElementById('likeAchievement');
    const likeUsers = document.getElementById('likeUsers');
    const particleContainer = document.getElementById('particleContainer');

    if (!likeButton || !likeIcon || !likeCount) return;

    const STORAGE_KEY = 'cryptolab_likes';
    const USER_STORAGE_KEY = 'cryptolab_user_liked';

    // УБИРАЕМ ВСЕ ИМИТАЦИИ - ВСЕ ПОЛЬЗОВАТЕЛИ НЕ ЛАЙКАЛИ
    const users = [
      { name: 'Алексей', avatar: 'А', liked: false },
      { name: 'Мария', avatar: 'М', liked: false },
      { name: 'Дмитрий', avatar: 'Д', liked: false },
      { name: 'Елена', avatar: 'Е', liked: false },
      { name: 'Сергей', avatar: 'С', liked: false },
    ];

    // НАЧИНАЕМ С 0, А НЕ С 128
    let totalLikes = localStorage.getItem(STORAGE_KEY)
      ? parseInt(localStorage.getItem(STORAGE_KEY))
      : 0;
    let userLiked = localStorage.getItem(USER_STORAGE_KEY) === 'true';

    const init = () => {
      updateLikeCount(totalLikes);
      updateLikeButtonState(userLiked);
      updateUsersList();
      // УБИРАЕМ АВТОМАТИЧЕСКУЮ АНИМАЦИЮ СЕРДЕЧКА
    };

    const updateLikeCount = (count) => {
      likeCount.textContent = count.toLocaleString();
      likeCount.classList.add('pop');
      setTimeout(() => {
        likeCount.classList.remove('pop');
      }, 300);
      localStorage.setItem(STORAGE_KEY, count.toString());
    };

    const updateLikeButtonState = (liked) => {
      if (liked) {
        likeButton.classList.add('liked');
        likeButtonText.textContent = 'Вам нравится';
        likeIcon.classList.add('active');
      } else {
        likeButton.classList.remove('liked');
        likeButtonText.textContent = 'Нравится';
        likeIcon.classList.remove('active');
      }
      localStorage.setItem(USER_STORAGE_KEY, liked.toString());
    };

    const createParticles = (count) => {
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'like-particle';

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 30;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.background = `hsl(${Math.random() * 20 + 340}, 70%, 60%)`;

        particleContainer.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 1000);
      }
    };

    const updateUsersList = () => {
      if (!likeUsers) return;

      const displayUsers = [];


      // ДОБАВЛЯЕМ ТОЛЬКО ТЕХ, У КОГО liked: true
      users.forEach((user) => {
        if (user.liked) {
          displayUsers.push(user);
        }
      });

      let usersHTML = `<div class="like-users-list">`;

      displayUsers.slice(0, 5).forEach((user) => {
        usersHTML += `
                <div class="like-user-avatar" title="${user.name}">
                    ${user.avatar}
                </div>
            `;
      });

      usersHTML += `
            </div>
            <div class="like-total">
                <i class="fas fa-heart" style="color: #ef4444;"></i>
                ${totalLikes.toLocaleString()} всего
            </div>
        `;

      likeUsers.innerHTML = usersHTML;
    };

    const showAchievement = (message) => {
      likeAchievement.textContent = message;
      likeAchievement.style.opacity = '1';

      setTimeout(() => {
        likeAchievement.style.opacity = '0';
      }, 3000);
    };

    likeButton.addEventListener('click', (e) => {
      e.preventDefault();

      if (!userLiked) {
        totalLikes++;
        userLiked = true;

        createParticles(12);

        const achievements = [
          '🎉 Спасибо за поддержку!',
          '❤️ Вы сделали этот проект лучше!',
          '🌟 Спасибо, что вы с нами!',
          '💝 Ваш лайк вдохновляет на новые идеи!',
          '✨ Спасибо за ваш лайк!',
        ];
        const randomAchievement =
          achievements[Math.floor(Math.random() * achievements.length)];
        showAchievement(randomAchievement);

        updateLikeCount(totalLikes);
        updateLikeButtonState(true);
        updateUsersList();

        this.showNotification('❤️ Спасибо за ваш лайк!', 'success');
      } else {
        totalLikes--;
        userLiked = false;

        updateLikeCount(totalLikes);
        updateLikeButtonState(false);
        updateUsersList();

        this.showNotification('💔 Лайк удален', 'info');
      }
    });

    likeIcon.addEventListener('click', () => {
      likeIcon.classList.add('active');
      setTimeout(() => {
        likeIcon.classList.remove('active');
      }, 500);
    });

    init();
  },

  // Быстрые примеры
  setupExamples() {
    const exampleBtns = document.querySelectorAll('.example-btn');

    exampleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        const algo = btn.getAttribute('data-algo');

        const inputText = document.getElementById('inputText');
        const algorithmSelect = document.getElementById('algorithmSelect');

        if (inputText) {
          inputText.value = text;
          inputText.dispatchEvent(new Event('input'));
        }

        if (algorithmSelect && algo) {
          algorithmSelect.value = algo;
          this.updateAlgorithmInfo();
        }

        const labSection = document.getElementById('lab');
        if (labSection) {
          labSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        this.showNotification(
          `Пример загружен: ${btn.querySelector('.example-text').textContent}`,
          'info',
        );
      });
    });
  },

  // Демо
  setupDemo() {
    const demoBtn = document.getElementById('demoBtn');

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        const inputText = document.getElementById('inputText');
        const algorithmSelect = document.getElementById('algorithmSelect');
        const keyInput = document.getElementById('keyInput');

        if (inputText)
          inputText.value =
            'Демонстрация работы криптографической лаборатории CryptoLab';
        if (algorithmSelect) algorithmSelect.value = 'vigenere';
        if (keyInput) keyInput.value = 'демо';

        if (inputText) inputText.dispatchEvent(new Event('input'));
        this.updateAlgorithmInfo();

        setTimeout(() => {
          this.handleEncrypt();
        }, 500);

        this.showNotification('Демонстрация запущена!', 'success');
      });
    }
  },

  // Генерация ключа
  generateKey() {
    const keyInput = document.getElementById('keyInput');
    if (!keyInput) return;

    const chars =
      'абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
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
        description:
          'Один из древнейших методов шифрования, названный в честь Юлия Цезаря. Каждая буква в тексте заменяется буквой, находящейся на фиксированное число позиций дальше в алфавите.',
      },
      vigenere: {
        name: 'Шифр Виженера',
        description:
          'Полиалфавитный шифр, использующий ключевое слово для шифрования. Более безопасен, чем шифр Цезаря, так как использует разные сдвиги для разных позиций в тексте.',
      },
      xor: {
        name: 'XOR шифрование',
        description:
          'Использует операцию исключающего ИЛИ (XOR) между текстом и ключом. Если ключ короче текста, он повторяется. Широко используется в компьютерных системах благодаря простоте и скорости.',
      },
      base64: {
        name: 'Base64 кодирование',
        description:
          'Схема кодирования двоичных данных в текстовый формат ASCII. Не является шифрованием в строгом смысле, так как не использует ключ и легко обратима.',
      },
      atbash: {
        name: 'Шифр Атбаш',
        description:
          'Моноалфавитный шифр подстановки, в котором первая буква алфавита заменяется на последнюю, вторая — на предпоследнюю и так далее.',
      },
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
    outputText.setSelectionRange(0, 99999);

    try {
      navigator.clipboard
        .writeText(outputText.value)
        .then(() => {
          this.showNotification('Текст скопирован в буфер обмена', 'success');

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
        })
        .catch((err) => {
          document.execCommand('copy');
          this.showNotification('Текст скопирован в буфер обмена', 'success');
        });
    } catch (err) {
      this.showNotification('Не удалось скопировать текст', 'error');
    }
  },

  // Скачивание результата
  handleDownload() {
    const outputText = document.getElementById('outputText');

    if (!outputText || !outputText.value.trim()) {
      this.showNotification('Нет данных для скачивания', 'warning');
      return;
    }

    const blob = new Blob([outputText.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cryptolab-result-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    this.showNotification('Результат скачан', 'success');
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
        return this.xorCipher(text, key);
      case 'base64':
        try {
          return decodeURIComponent(escape(atob(text)));
        } catch (e) {
          throw new Error('Некорректные данные Base64');
        }
      case 'atbash':
        return this.atbashCipher(text);
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

      if (charCode >= 1040 && charCode <= 1071) {
        const base = 1040;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(
          ((charCode - base + offset + 32) % 32) + base,
        );
      } else if (charCode >= 1072 && charCode <= 1103) {
        const base = 1072;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(
          ((charCode - base + offset + 32) % 32) + base,
        );
      } else if (charCode >= 65 && charCode <= 90) {
        const base = 65;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(
          ((charCode - base + offset + 26) % 26) + base,
        );
      } else if (charCode >= 97 && charCode <= 122) {
        const base = 97;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(
          ((charCode - base + offset + 26) % 26) + base,
        );
      } else {
        result += char;
        continue;
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

      let alphabetSize, base;
      if (charCode >= 1040 && charCode <= 1071) {
        alphabetSize = 32;
        base = 1040;
      } else if (charCode >= 1072 && charCode <= 1103) {
        alphabetSize = 32;
        base = 1072;
      } else if (charCode >= 65 && charCode <= 90) {
        alphabetSize = 26;
        base = 65;
      } else if (charCode >= 97 && charCode <= 122) {
        alphabetSize = 26;
        base = 97;
      } else {
        result += char;
        continue;
      }

      const keyChar = cleanKey[keyIndex % cleanKey.length];
      const keyCharCode = keyChar.charCodeAt(0);
      const keyShift =
        keyCharCode >= 1072 ? keyCharCode - 1072 : keyCharCode - 97;

      const offset = encrypt ? keyShift : -keyShift;
      const newCharCode =
        ((charCode - base + offset + alphabetSize) % alphabetSize) + base;
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

      if (charCode >= 1040 && charCode <= 1071) {
        result += String.fromCharCode(1071 - (charCode - 1040));
      } else if (charCode >= 1072 && charCode <= 1103) {
        result += String.fromCharCode(1103 - (charCode - 1072));
      } else if (charCode >= 65 && charCode <= 90) {
        result += String.fromCharCode(90 - (charCode - 65));
      } else if (charCode >= 97 && charCode <= 122) {
        result += String.fromCharCode(122 - (charCode - 97));
      } else {
        result += char;
      }
    }

    return result;
  },

  // Вычисление сдвига для шифра Цезаря
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
    const existingNotifications = document.querySelectorAll(
      '.custom-notification',
    );
    existingNotifications.forEach((notification) => {
      notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
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

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    });

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  },
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  CryptoLab.init();
});А
