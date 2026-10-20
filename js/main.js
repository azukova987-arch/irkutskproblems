// Тестовые обращения. Позже эти данные будут приходить с сервера.
const problems = [
    {
        id: 1,
        title: "Яма на проезжей части",
        category: "Дороги",
        description: "На дороге образовалась глубокая яма. Водителям приходится объезжать её, создавая помехи движению.",
        address: "ул. Ленина, рядом с остановкой",
        status: "На рассмотрении",
        icon: "↗",
        imageClass: "image-roads"
    },
    {
        id: 2,
        title: "Переполненные мусорные контейнеры",
        category: "Мусор",
        description: "Контейнеры переполнены, рядом лежат пакеты с мусором. Нужен вывоз отходов и уборка площадки.",
        address: "ул. Байкальская, жилой квартал",
        status: "На рассмотрении",
        icon: "♻",
        imageClass: "image-trash"
    },
    {
        id: 3,
        title: "Не работает уличный фонарь",
        category: "Освещение",
        description: "Вечером участок улицы остаётся тёмным. Пешеходам трудно безопасно проходить по тротуару.",
        address: "ул. Советская, возле дома 12",
        status: "На рассмотрении",
        icon: "☼",
        imageClass: "image-light"
    },
    {
        id: 4,
        title: "Повреждена остановка",
        category: "Благоустройство",
        description: "У остановочного павильона повреждена боковая панель. Ожидать транспорт стало менее удобно.",
        address: "ул. Партизанская, остановка",
        status: "На рассмотрении",
        icon: "⌂",
        imageClass: "image-park"
    },
    {
        id: 5,
        title: "Убрали мусор во дворе",
        category: "ЖКХ",
        description: "После обращения территорию двора очистили. Спасибо всем, кто обратил внимание на проблему.",
        address: "ул. Советская, двор дома 8",
        status: "Решена",
        icon: "✓",
        imageClass: "image-housing"
    }
];

// Находим элементы страницы, с которыми будет работать JavaScript.
const problemList = document.getElementById("problemList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const totalCount = document.getElementById("totalCount");
const openCount = document.getElementById("openCount");
const solvedCount = document.getElementById("solvedCount");
const resultsCaption = document.getElementById("resultsCaption");
const emptyMessage = document.getElementById("emptyMessage");
const reportForm = document.getElementById("reportForm");
const formMessage = document.getElementById("formMessage");
const problemDialog = document.getElementById("problemDialog");
const dialogContent = document.getElementById("dialogContent");

// Показывает список карточек на странице.
function showProblems(list) {
    problemList.innerHTML = "";

    list.forEach(function (problem) {
        const card = document.createElement("article");
        card.className = "problem-card";

        const statusClass = problem.status === "Решена" ? "status-solved" : "";

        const imageContent = problem.photoUrl
            ? `<img src="${problem.photoUrl}" alt="Фотография проблемы" style="width:100%;height:100%;max-height:190px;object-fit:cover;">`
            : `<span aria-hidden="true">${problem.icon}</span>`;

        card.innerHTML = `
            <div class="problem-image ${problem.imageClass}">
                ${imageContent}
            </div>
            <div class="problem-content">
                <div class="problem-meta">
                    <span class="category-tag">${problem.category}</span>
                    <span class="status-tag ${statusClass}">${problem.status}</span>
                </div>
                <h3>${escapeHTML(problem.title)}</h3>
                <p>${escapeHTML(problem.description)}</p>
                <span class="problem-address">⌖ ${escapeHTML(problem.address)}</span>
                <button class="details-button" type="button" data-problem-id="${problem.id}">
                    Подробнее →
                </button>
            </div>
        `;

        problemList.appendChild(card);
    });

    emptyMessage.hidden = list.length !== 0;
    resultsCaption.textContent = list.length + " публикаций";
}

// Защищает текст, который пользователь вводит в форму.
function escapeHTML(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Обновляет числа в блоке статистики.
function updateStatistics() {
    totalCount.textContent = problems.length;
    openCount.textContent = problems.filter(function (problem) {
        return problem.status !== "Решена";
    }).length;
    solvedCount.textContent = problems.filter(function (problem) {
        return problem.status === "Решена";
    }).length;
}

// Ищет обращения по тексту и выбранной категории.
function filterProblems() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredProblems = problems.filter(function (problem) {
        const matchesText =
            problem.title.toLowerCase().includes(searchText) ||
            problem.description.toLowerCase().includes(searchText) ||
            problem.address.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" || problem.category === selectedCategory;

        return matchesText && matchesCategory;
    });

    showProblems(filteredProblems);
}

// Открывает подробную информацию об одном обращении.
function openProblem(problemId) {
    const problem = problems.find(function (item) {
        return item.id === Number(problemId);
    });

    if (!problem) {
        return;
    }

    dialogContent.innerHTML = `
        <p class="eyebrow">${escapeHTML(problem.category)}</p>
        <h2>${escapeHTML(problem.title)}</h2>
        <p>${escapeHTML(problem.description)}</p>
        <p class="dialog-address">⌖ ${escapeHTML(problem.address)}</p>
        <p><strong>Статус:</strong> ${escapeHTML(problem.status)}</p>
    `;

    problemDialog.showModal();
}

// Поиск и фильтр срабатывают при изменении полей.
searchInput.addEventListener("input", filterProblems);
categoryFilter.addEventListener("change", filterProblems);

// Кнопки «Подробнее» обрабатываются через общий список карточек.
problemList.addEventListener("click", function (event) {
    const button = event.target.closest("[data-problem-id]");

    if (button) {
        openProblem(button.dataset.problemId);
    }
});

// Отметки на демонстрационной карте открывают соответствующие обращения.
document.querySelector(".demo-map").addEventListener("click", function (event) {
    const pin = event.target.closest("[data-problem-id]");

    if (pin) {
        openProblem(pin.dataset.problemId);
    }
});

// Закрывает окно с подробностями.
document.getElementById("dialogClose").addEventListener("click", function () {
    problemDialog.close();
});

// Обрабатывает форму нового обращения.
reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("problemTitle").value.trim();
    const category = document.getElementById("problemCategory").value;
    const address = document.getElementById("problemAddress").value.trim();
    const description = document.getElementById("problemDescription").value.trim();
    const photoInput = document.getElementById("problemPhoto");

    if (title.length < 5 || address.length < 4 || description.length < 15 || !category) {
        formMessage.textContent = "Проверьте поля: название от 5 символов, адрес от 4, описание от 15.";
        return;
    }

    const newProblem = {
        id: Date.now(),
        title: title,
        category: category,
        description: description,
        address: address,
        status: "На рассмотрении",
        icon: "•",
        imageClass: "image-park"
    };

    // Если пользователь выбрал фото, покажем его на карточке.
    if (photoInput.files.length > 0) {
        const photo = photoInput.files[0];

        if (!photo.type.startsWith("image/")) {
            formMessage.textContent = "Пожалуйста, выберите файл изображения.";
            return;
        }

        newProblem.photoUrl = URL.createObjectURL(photo);
    }

    problems.unshift(newProblem);
    updateStatistics();
    filterProblems();

    reportForm.reset();
    formMessage.textContent = "Обращение добавлено в демонстрационный список. После обновления страницы оно исчезнет.";

    document.getElementById("problems").scrollIntoView({ behavior: "smooth" });
});

// Мобильное меню.
document.getElementById("menuButton").addEventListener("click", function () {
    document.getElementById("mainNav").classList.toggle("open");
});

// Первоначальное отображение списка и статистики.
showProblems(problems);
updateStatistics();
