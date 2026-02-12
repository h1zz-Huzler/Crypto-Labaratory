/**
 * CryptoLab - Образовательный портал по криптографии
 * Полная версия JavaScript файла
 * Версия: 3.5
 * Дата: 2026
 */


const CryptoLab = {

  init() {
    console.log('гоооол');

    this.setupEventListeners();
    this.setupScrollIndicator();
    this.setupScrollToTop();

    this.setupCharacterCounter();
    this.setupNavigation();
    this.setupSmoothScroll();
    this.setupExamples();
    this.setupDemo();
    this.setupHistorySection();
    this.setupLikeSystem();
    this.setupChecklist();

    // Инициализация информации об алгоритмах
    this.updateAlgorithmInfo();

    console.log('всё ок');
  },

  setupEventListeners() {
    // Лаборатория
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

  //НАВИГАЦИЯ
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

  //ПЛАВНЫЙ СКРОЛЛ
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

  // ИНДИКАТОР ПРОКРУТКИ
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

  // КНОПКА "НАВЕРХ"
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

  //  СЧЕТЧИК СИМВОЛОВ
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

  // ИСТОРИЧЕСКАЯ СПРАВКА
  setupHistorySection() {
    this.setupTimelineAnimation();

  },

  // АНИМАЦИЯ ТАЙМЛАЙНА
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


    // Стартуем с 0 лайков
    let totalLikes = 666;
    let userLiked = localStorage.getItem(USER_STORAGE_KEY) === 'true';

    const init = () => {
      updateLikeCount(totalLikes);
      updateLikeButtonState(userLiked);
      updateUsersList();
      // Убрана автоматическая анимация сердечка при загрузке
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

  // ЧЕК-ЛИСТ БЕЗОПАСНОСТИ
  setupChecklist() {
    const checkboxes = document.querySelectorAll(
      '.checklist-item input[type="checkbox"]',
    );
    const progressEl = document.getElementById('checklistProgress');
    const resetBtn = document.getElementById('checklistResetBtn');

    if (!checkboxes.length || !progressEl) return;

    const CHECKLIST_STORAGE_KEY = 'cryptolab_checklist';

    // Загружаем сохранённое состояние
    const savedState = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (savedState) {
      try {
        const checkedStates = JSON.parse(savedState);
        checkboxes.forEach((checkbox, index) => {
          if (checkedStates[index]) {
            checkbox.checked = true;
          }
        });
      } catch (e) {
        console.log('Ошибка загрузки состояния чек-листа');
      }
    }

    const updateProgress = () => {
      const checkedCount = document.querySelectorAll(
        '.checklist-item input[type="checkbox"]:checked',
      ).length;
      const total = checkboxes.length;
      progressEl.textContent = `${checkedCount}/${total} выполнено`;

      // Сохраняем состояние
      const states = Array.from(checkboxes).map((cb) => cb.checked);
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(states));

      // Поздравление при полном выполнении
      if (checkedCount === total && total > 0 && checkedCount > 0) {
        this.showNotification(
          '🎉 Отлично! Вы выполнили все пункты безопасности!',
          'success',
        );
      }
    };

    // Добавляем обработчики
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', updateProgress);
    });

    // Сброс чек-листа
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        checkboxes.forEach((cb) => {
          cb.checked = false;
        });
        updateProgress();
        this.showNotification('Чек-лист сброшен', 'info');
      });
    }

    // Инициализация
    updateProgress();
  },

  // ===== БЫСТРЫЕ ПРИМЕРЫ =====
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

  // ===== ДЕМО-РЕЖИМ =====
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

  // ОБНОВЛЕНИЕ ИНФОРМАЦИИ ОБ АЛГОРИТМЕ
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


  caesarCipher(text, key, encrypt) {
    const shift = this.calculateShift(key);
    let result = '';

    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      const charCode = text.charCodeAt(i);

      // Русские буквы
      if (charCode >= 1040 && charCode <= 1071) {
        // А-Я
        const base = 1040;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(
          ((charCode - base + offset + 32) % 32) + base,
        );
      } else if (charCode >= 1072 && charCode <= 1103) {
        // а-я
        const base = 1072;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(
          ((charCode - base + offset + 32) % 32) + base,
        );
      }
      // Английские буквы
      else if (charCode >= 65 && charCode <= 90) {
        // A-Z
        const base = 65;
        const offset = encrypt ? shift : -shift;
        char = String.fromCharCode(
          ((charCode - base + offset + 26) % 26) + base,
        );
      } else if (charCode >= 97 && charCode <= 122) {
        // a-z
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

  //  ШИФР ВИЖЕНЕРА
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
        // А-Я
        alphabetSize = 32;
        base = 1040;
      } else if (charCode >= 1072 && charCode <= 1103) {
        // а-я
        alphabetSize = 32;
        base = 1072;
      } else if (charCode >= 65 && charCode <= 90) {
        // A-Z
        alphabetSize = 26;
        base = 65;
      } else if (charCode >= 97 && charCode <= 122) {
        // a-z
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

  //XOR ШИФРОВАНИЕ
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

  //  ШИФР АТБАШ
  atbashCipher(text) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charCode = text.charCodeAt(i);

      // Русские буквы
      if (charCode >= 1040 && charCode <= 1071) {
        // А-Я
        result += String.fromCharCode(1071 - (charCode - 1040));
      } else if (charCode >= 1072 && charCode <= 1103) {
        // а-я
        result += String.fromCharCode(1103 - (charCode - 1072));
      }
      // Английские буквы
      else if (charCode >= 65 && charCode <= 90) {
        // A-Z
        result += String.fromCharCode(90 - (charCode - 65));
      } else if (charCode >= 97 && charCode <= 122) {
        // a-z
        result += String.fromCharCode(122 - (charCode - 97));
      }
      // Остальные символы
      else {
        result += char;
      }
    }

    return result;
  },

  //ВЫЧИСЛЕНИЕ СДВИГА ДЛЯ ЦЕЗАРЯ
  calculateShift(key) {
    if (!key) return 3;

    let sum = 0;
    for (let i = 0; i < key.length; i++) {
      sum += key.charCodeAt(i);
    }

    return (sum % 25) + 1;
  },

  //  УВЕДОМЛЕНИЯ
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

//ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', () => {
  CryptoLab.init();
});
class SecurityChecklist {
  constructor() {
    this.checkboxes = document.querySelectorAll('.checklist-checkbox');
    this.progressSpan = document.getElementById('checklistProgress');
    this.resetBtn = document.getElementById('checklistResetBtn');
    this.storageKey = 'cryptographyLab_checklist';

    if (this.checkboxes.length === 0) return;

    this.init();
  }

  init() {
    // Загружаем сохраненное состояние
    this.loadState();

    // Добавляем обработчики событий
    this.addEventListeners();

    // Обновляем прогресс
    this.updateProgress();
  }

  loadState() {
    try {
      const savedState = localStorage.getItem(this.storageKey);

      if (savedState) {
        const states = JSON.parse(savedState);

        this.checkboxes.forEach((checkbox, index) => {
          if (states[index]) {
            checkbox.checked = true;
          }
        });
      }
    } catch (e) {
      console.error('Ошибка загрузки состояния чек-листа:', e);
    }
  }

  saveState() {
    const states = {};

    this.checkboxes.forEach((checkbox, index) => {
      states[index] = checkbox.checked;
    });

    localStorage.setItem(this.storageKey, JSON.stringify(states));
  }

  updateProgress() {
    const checkedCount = Array.from(this.checkboxes).filter(
      (cb) => cb.checked,
    ).length;
    const totalCount = this.checkboxes.length;

    if (this.progressSpan) {
      this.progressSpan.textContent = `${checkedCount}/${totalCount} выполнено`;

      // Добавляем анимацию при достижении 100%
      if (checkedCount === totalCount) {
        this.progressSpan.style.color = '#10b981';
        this.progressSpan.style.fontWeight = '700';
        this.showAchievement('🎉 Отлично! Все пункты выполнены!');
      } else {
        this.progressSpan.style.color = 'rgba(255,255,255,0.7)';
        this.progressSpan.style.fontWeight = '500';
      }
    }
  }

  showAchievement(message) {
    // Создаем или обновляем уведомление о достижении
    let achievement = document.querySelector('.checklist-achievement');

    if (!achievement) {
      achievement = document.createElement('div');
      achievement.className = 'checklist-achievement';
      achievement.style.cssText = `
        margin-top: 15px;
        padding: 10px 20px;
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid #10b981;
        border-radius: 30px;
        color: white;
        font-weight: 600;
        text-align: center;
        animation: fadeInUp 0.5s ease;
      `;

      const footer = document.querySelector('.checklist-footer');
      if (footer) {
        footer.parentNode.insertBefore(achievement, footer.nextSibling);
      }
    }

    achievement.textContent = message;

    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
      if (achievement) {
        achievement.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => achievement.remove(), 500);
      }
    }, 3000);
  }

  resetChecklist() {
    this.checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    this.saveState();
    this.updateProgress();

    // Удаляем сообщение о достижении
    const achievement = document.querySelector('.checklist-achievement');
    if (achievement) {
      achievement.remove();
    }

    // Показываем уведомление о сбросе
    this.showNotification('Чек-лист сброшен', 'info');
  }

  showNotification(message, type = 'info') {
    // Проверяем, существует ли функция showNotification
    if (typeof window.showNotification === 'function') {
      window.showNotification(message, type);
    } else {
      // Создаем временное уведомление
      const notification = document.createElement('div');
      notification.className = `custom-notification notification-${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
          <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }

  addEventListeners() {
    // Обработчики для чекбоксов
    this.checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        this.saveState();
        this.updateProgress();
      });
    });

    // Обработчик для кнопки сброса
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetChecklist());
    }

    // Сохраняем состояние перед закрытием страницы
    window.addEventListener('beforeunload', () => this.saveState());
  }
}

// Добавляем CSS-анимацию для fadeOut
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
  }
  
  .checklist-achievement {
    transition: all 0.3s ease;
  }
  
  .checklist-progress {
    transition: color 0.3s ease, font-weight 0.3s ease;
  }
`;
document.head.appendChild(style);

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  window.securityChecklist = new SecurityChecklist();
});
//ДОБАВЛЕНИЕ CSS-АНИМАЦИЙ
const animationStyles = `
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
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
