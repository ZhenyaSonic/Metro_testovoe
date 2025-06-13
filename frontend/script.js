document.addEventListener('DOMContentLoaded', () => {
    // API_BASE_URL пустой, так как все запросы идут на тот же хост, что и фронтенд
    const API_BASE_URL = ''; 
    const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIiB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiPjxwYXRoIGQ9Ik0xMiAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bTAgMmMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHoiLz48L3N2Zz4=';

    // --- DOM Elements ---
    const navs = {
        main: document.getElementById('nav-main'),
        posts: document.getElementById('nav-posts'),
        users: document.getElementById('nav-users'),
    };
    const authButtons = {
        login: document.getElementById('login-btn'),
        register: document.getElementById('register-btn'),
        logout: document.getElementById('logout-btn'),
    };
    const links = {
        login: document.getElementById('login-link'),
        register: document.getElementById('register-link'),
    };
    const sections = {
        main: document.getElementById('main-section'),
        posts: document.getElementById('posts-section'),
        users: document.getElementById('users-section'),
    };
    const mainPage = {
        header: document.getElementById('main-header'),
        profileView: document.getElementById('profile-view-container'),
        welcomeMessage: document.getElementById('welcome-message'),
        avatar: document.getElementById('main-avatar'),
        fio: document.getElementById('main-fio'),
        email: document.getElementById('main-email'),
        address: document.getElementById('main-address'),
    };
    const loginModal = {
        element: document.getElementById('login-modal'),
        closeBtn: document.getElementById('close-login-modal-button'),
        form: document.getElementById('login-form'),
        emailInput: document.getElementById('login-email'),
        passwordInput: document.getElementById('login-password'),
    };
    const registerForm = {
        container: document.getElementById('register-form-container'),
        showBtn: document.getElementById('show-register-form-btn'),
        submitBtn: document.getElementById('submit-register-user'),
        cancelBtn: document.getElementById('cancel-register-user'),
        fioInput: document.getElementById('user-fio-create'),
        emailInput: document.getElementById('user-email-create'),
        passwordInput: document.getElementById('user-password-create'),
        addressInput: document.getElementById('user-address-create'),
    };
    const postsList = document.getElementById('posts-list');
    const createPostForm = {
        container: document.getElementById('create-post-form-container'),
        showBtn: document.getElementById('show-create-post-form'),
        submitBtn: document.getElementById('submit-create-post'),
        cancelBtn: document.getElementById('cancel-create-post'),
        titleInput: document.getElementById('post-title'),
        contentInput: document.getElementById('post-content'),
    };
    const usersList = document.getElementById('users-list');

    // --- Global State ---
    let currentUser = null;

    // --- API & Auth Helpers ---
    const getToken = () => localStorage.getItem('accessToken');

    async function fetchWithAuth(url, options = {}) {
        const token = getToken();
        const headers = { ...options.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

        const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
        if (response.status === 401) {
            handleLogout();
            alert("Сессия истекла. Пожалуйста, войдите снова.");
            throw new Error("Unauthorized");
        }
        return response;
    }

    async function handleLogin(email, password) {
        console.log(`[LOGIN] Attempting to login with email: ${email}`);
        try {
            const formData = new URLSearchParams({ username: email, password: password });
            const response = await fetch(`${API_BASE_URL}/api/token`, { method: 'POST', body: formData });
            
            console.log(`[LOGIN] Response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[LOGIN] Login failed. Status: ${response.status}, Body: ${errorText}`);
                throw new Error('Неверный email или пароль.');
            }

            const data = await response.json();
            console.log("[LOGIN] Token received:", data.access_token);

            localStorage.setItem('accessToken', data.access_token);
            loginModal.element.style.display = 'none';
            loginModal.form.reset();
            
            console.log("[LOGIN] Token stored. Initializing app...");
            await initializeApp();
            console.log("[LOGIN] App re-initialized successfully.");

        } catch (error) {
            console.error('[LOGIN] Error during login process:', error);
            alert(error.message);
        }
    }

    function handleLogout() {
        localStorage.removeItem('accessToken');
        currentUser = null;
        updateUI();
        navigateTo('main');
    }

    // --- UI Update ---
    function updateUI() {
        const loggedIn = !!currentUser;
        authButtons.login.style.display = loggedIn ? 'none' : 'inline-block';
        authButtons.register.style.display = loggedIn ? 'none' : 'inline-block';
        authButtons.logout.style.display = loggedIn ? 'inline-block' : 'none';

        if (createPostForm.showBtn) {
            createPostForm.showBtn.style.display = loggedIn ? 'inline-block' : 'none';
        }

        mainPage.profileView.style.display = loggedIn ? 'flex' : 'none';
        mainPage.welcomeMessage.style.display = loggedIn ? 'none' : 'block';
        
        if (loggedIn) {
            mainPage.header.textContent = `Личный кабинет`;
            mainPage.fio.textContent = currentUser.fio;
            mainPage.email.textContent = currentUser.email;
            mainPage.address.textContent = currentUser.address || 'Не указан';
            mainPage.avatar.src = currentUser.avatar_url ? `${API_BASE_URL}${currentUser.avatar_url}` : DEFAULT_AVATAR;
        } else {
            mainPage.header.textContent = `Добро пожаловать!`;
        }
    }

    async function fetchAndDisplayPosts() {
        try {
            // Список постов может смотреть любой,
            const response = await fetch(`${API_BASE_URL}/api/posts/`);
            if (!response.ok) throw new Error('Не удалось загрузить посты.');
            const posts = await response.json();
            postsList.innerHTML = '';
            if (posts.length === 0) {
                postsList.innerHTML = '<p>Постов пока нет. Создайте первый!</p>';
            } else {
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('list-item');
                    postElement.innerHTML = `
                        <div class="list-item-info">
                            <strong>${post.title}</strong>
                            <p style="font-size:0.9em; color:#555; margin-top: 5px;">${post.content}</p>
                            <small>ID поста: ${post.id}, ID Владельца: ${post.owner_id}</small>
                        </div>
                        <div class="post-item-actions">
                            <!-- Кнопку удаления покажем, только если пост принадлежит текущему пользователю -->
                            ${currentUser && currentUser.id === post.owner_id ? `<button data-id="${post.id}" class="delete-post-btn">Удалить</button>` : ''}
                        </div>`;
                    postsList.appendChild(postElement);
                });
            }
        } catch (error) {
            console.error("Ошибка при загрузке постов:", error);
            postsList.innerHTML = '<p>Произошла ошибка при загрузке постов.</p>';
        }
    }

    // --- Main Logic ---
    async function fetchAndDisplayUsers() {
       try {
            const response = await fetch(`${API_BASE_URL}/api/users/`);
            if (!response.ok) throw new Error('Не удалось загрузить пользователей.');
            const users = await response.json();
            usersList.innerHTML = '';
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.classList.add('list-item');
                userElement.innerHTML = `
                    <div style="display:flex; align-items:center; gap: 15px;">
                        <img src="${user.avatar_url ? API_BASE_URL + user.avatar_url : DEFAULT_AVATAR}" alt="avatar" style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
                        <div class="list-item-info">
                            <strong>ФИО:</strong> <span class="user-item-fio" data-id="${user.id}" style="cursor:pointer; color:blue;">${user.fio}</span><br>
                            <strong>Email:</strong> <span>${user.email}</span>
                        </div>
                    </div>
                    <div class="user-item-actions">
                         <button data-id="${user.id}" class="delete-user-btn">Удалить</button>
                    </div>`;
                usersList.appendChild(userElement);
            });
       } catch (error) {
           console.error('Ошибка при загрузке пользователей:', error);
           usersList.innerHTML = '<p>Не удалось загрузить список пользователей.</p>';
       }
    }

    function showRegistration() {
        navigateTo('users');
        registerForm.container.style.display = 'block';
        registerForm.showBtn.style.display = 'none';
    }
    
    // --- Navigation ---
    function navigateTo(sectionName) {
        Object.values(navs).forEach(nav => nav.classList.remove('active'));
        navs[sectionName].classList.add('active');
        Object.values(sections).forEach(section => section.style.display = 'none');
        sections[sectionName].style.display = 'block';
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        authButtons.login.addEventListener('click', () => { loginModal.element.style.display = 'flex'; });
        authButtons.register.addEventListener('click', showRegistration);
        links.login.addEventListener('click', (e) => { e.preventDefault(); loginModal.element.style.display = 'flex'; });
        links.register.addEventListener('click', (e) => { e.preventDefault(); showRegistration(); });
        authButtons.logout.addEventListener('click', handleLogout);
        loginModal.closeBtn.addEventListener('click', () => { loginModal.element.style.display = 'none'; });
        loginModal.form.addEventListener('submit', (e) => { e.preventDefault(); handleLogin(loginModal.emailInput.value, loginModal.passwordInput.value); });

        navs.main.addEventListener('click', (e) => { e.preventDefault(); navigateTo('main'); });
        navs.users.addEventListener('click', (e) => { e.preventDefault(); navigateTo('users'); fetchAndDisplayUsers(); });
        navs.posts.addEventListener('click', (e) => { e.preventDefault(); navigateTo('posts'); fetchAndDisplayPosts(); });
        
        registerForm.showBtn.addEventListener('click', () => {
            registerForm.container.style.display = 'block';
            registerForm.showBtn.style.display = 'none';
        });
        registerForm.cancelBtn.addEventListener('click', () => {
            registerForm.container.style.display = 'none';
            registerForm.showBtn.style.display = 'inline-block';
            registerForm.fioInput.value = ''; registerForm.emailInput.value = ''; registerForm.passwordInput.value = ''; registerForm.addressInput.value = '';
        });
        registerForm.submitBtn.addEventListener('click', async () => {
            const userData = {
                fio: registerForm.fioInput.value.trim(),
                email: registerForm.emailInput.value.trim(),
                password: registerForm.passwordInput.value.trim(),
                address: registerForm.addressInput.value.trim() || null
            };
            if (!userData.fio || !userData.email || !userData.password) {
                alert('Пожалуйста, заполните ФИО, Email и Пароль.');
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                 if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.detail); }
                alert('Пользователь успешно создан! Теперь вы можете войти.');
                registerForm.cancelBtn.click();
                fetchAndDisplayUsers();
            } catch (error) {
                console.error('Ошибка при создании пользователя:', error);
                alert(`Не удалось создать пользователя: ${error.message}`);
            }
        });
        createPostForm.showBtn.addEventListener('click', () => {
            createPostForm.container.style.display = 'block';
            createPostForm.showBtn.style.display = 'none';
        });
        createPostForm.cancelBtn.addEventListener('click', () => {
            createPostForm.container.style.display = 'none';
            createPostForm.showBtn.style.display = 'inline-block';
            createPostForm.titleInput.value = '';
            createPostForm.contentInput.value = '';
        });
        createPostForm.submitBtn.addEventListener('click', async () => {
            if (!currentUser) {
                alert('Для создания поста необходимо войти в систему.');
                return;
            }
            const postData = {
                title: createPostForm.titleInput.value.trim(),
                content: createPostForm.contentInput.value.trim(),
            };
            if (!postData.title || !postData.content) {
                alert('Пожалуйста, заполните заголовок и содержание поста.');
                return;
            }
            try {
                // Используем fetchWithAuth, так как создание поста требует авторизации
                // ID пользователя берем из currentUser
                const response = await fetchWithAuth(`/api/users/${currentUser.id}/posts/`, {
                    method: 'POST',
                    body: JSON.stringify(postData)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail);
                }
                alert('Пост успешно создан!');
                createPostForm.cancelBtn.click(); // Скрываем и очищаем форму
                fetchAndDisplayPosts(); // Обновляем список постов
            } catch (error) {
                console.error("Ошибка при создании поста:", error);
                alert(`Не удалось создать пост: ${error.message}`);
            }
        });
    }

    // --- App Initialization ---
    async function initializeApp() {
        const token = getToken();
        if (token) {
            try {
                const response = await fetchWithAuth('/api/users/me');
                 if (!response.ok) throw new Error(`Failed to fetch user. Status: ${response.status}`);
                currentUser = await response.json();
            } catch (error) {
                console.error("Token validation failed:", error);
                currentUser = null;
            }
        } else {
            currentUser = null;
        }
        updateUI();
        navigateTo('main');
    }

    setupEventListeners();
    initializeApp();
});
