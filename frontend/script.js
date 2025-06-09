document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://127.0.0.1:8000'; // URL вашего FastAPI бэкенда

    const navMain = document.getElementById('nav-main');
    const navPosts = document.getElementById('nav-posts');
    const navUsers = document.getElementById('nav-users');

    const mainSection = document.getElementById('main-section');
    const postsSection = document.getElementById('posts-section');
    const usersSection = document.getElementById('users-section');

    const postsList = document.getElementById('posts-list');
    const usersList = document.getElementById('users-list');

    // Модальное окно пользователя
    const userModal = document.getElementById('user-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const modalUserId = document.getElementById('modal-user-id');
    const modalUserFio = document.getElementById('modal-user-fio');
    const modalUserEmail = document.getElementById('modal-user-email');
    const modalUserAddress = document.getElementById('modal-user-address');
    const userDetailsForm = document.getElementById('user-details-form');
    const editUserButton = document.getElementById('edit-user-button');
    const saveUserButton = document.getElementById('save-user-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');


    // Формы создания
    const showCreatePostFormButton = document.getElementById('show-create-post-form');
    const createPostFormContainer = document.getElementById('create-post-form-container');
    const postTitleInput = document.getElementById('post-title');
    const postContentInput = document.getElementById('post-content');
    const postOwnerIdInput = document.getElementById('post-owner-id');
    const submitCreatePostButton = document.getElementById('submit-create-post');
    const cancelCreatePostButton = document.getElementById('cancel-create-post');

    const showCreateUserFormButton = document.getElementById('show-create-user-form');
    const createUserFormContainer = document.getElementById('create-user-form-container');
    const userFioCreateInput = document.getElementById('user-fio-create');
    const userEmailCreateInput = document.getElementById('user-email-create');
    const userAddressCreateInput = document.getElementById('user-address-create');
    const submitCreateUserButton = document.getElementById('submit-create-user');
    const cancelCreateUserButton = document.getElementById('cancel-create-user');


    function setActiveNav(activeLink) {
        [navMain, navPosts, navUsers].forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    function showSection(sectionToShow) {
        [mainSection, postsSection, usersSection].forEach(section => section.style.display = 'none');
        sectionToShow.style.display = 'block';
    }

    async function fetchAndDisplayPosts() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const posts = await response.json();
            postsList.innerHTML = ''; // Очистить список
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('list-item');
                postElement.innerHTML = `
                    <div class="list-item-info">
                        <strong>Информация:</strong>
                        <span>${post.title}</span>
                        <p style="font-size:0.9em; color:#555;">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                        <small>ID поста: ${post.id}, ID Владельца: ${post.owner_id}</small>
                    </div>
                    <div class="post-item-actions">
                        <button data-id="${post.id}" class="delete-post-btn">Удалить</button>
                    </div>
                `;
                postsList.appendChild(postElement);
            });
            addDeletePostEventListeners();
        } catch (error) {
            console.error('Ошибка при загрузке постов:', error);
            postsList.innerHTML = '<p>Не удалось загрузить посты.</p>';
        }
    }

    async function fetchAndDisplayUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const users = await response.json();
            usersList.innerHTML = ''; // Очистить список
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.classList.add('list-item');
                userElement.innerHTML = `
                    <div class="list-item-info">
                        <strong>ФИО:</strong> <span class="user-item-fio" data-id="${user.id}">${user.fio}</span><br>
                        <strong>Email:</strong> <span>${user.email}</span>
                    </div>
                    <div class="user-item-actions">
                        <button data-id="${user.id}" class="delete-user-btn">Удалить</button>
                    </div>
                `;
                usersList.appendChild(userElement);
            });
            addUserClickListeners();
            addDeleteUserEventListeners();
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            usersList.innerHTML = '<p>Не удалось загрузить пользователей.</p>';
        }
    }

    function addUserClickListeners() {
        document.querySelectorAll('.user-item-fio').forEach(item => {
            item.addEventListener('click', async (event) => {
                const userId = event.target.dataset.id;
                await openUserModal(userId);
            });
        });
    }
    
    function setModalFieldsEditable(isEditable) {
        modalUserFio.readOnly = !isEditable;
        modalUserEmail.readOnly = !isEditable;
        modalUserAddress.readOnly = !isEditable;
        saveUserButton.style.display = isEditable ? 'inline-block' : 'none';
        editUserButton.style.display = isEditable ? 'none' : 'inline-block';
        cancelEditButton.style.display = isEditable ? 'inline-block' : 'none';
    }

    async function openUserModal(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const user = await response.json();
            
            modalUserId.value = user.id;
            modalUserFio.value = user.fio;
            modalUserEmail.value = user.email;
            modalUserAddress.value = user.address || '';
            
            setModalFieldsEditable(false); // По умолчанию поля нередактируемы
            userModal.style.display = 'flex';
        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
            alert('Не удалось загрузить данные пользователя.');
        }
    }
    
    editUserButton.addEventListener('click', () => {
        setModalFieldsEditable(true);
    });

    cancelEditButton.addEventListener('click', async () => {
        // Перезагружаем данные пользователя, чтобы отменить изменения
        const userId = modalUserId.value;
        if (userId) {
            await openUserModal(userId); // Это сбросит поля к исходным значениям и заблокирует их
        }
        setModalFieldsEditable(false);
    });

    closeModalButton.addEventListener('click', () => {
        userModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => { // Закрытие по клику вне модалки
        if (event.target === userModal) {
            userModal.style.display = 'none';
        }
    });

    userDetailsForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userId = modalUserId.value;
        const updatedUser = {
            fio: modalUserFio.value,
            email: modalUserEmail.value,
            address: modalUserAddress.value || null
        };

        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });
            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(`HTTP error! status: ${response.status}, ${errorData.detail}`);
            }
            alert('Данные пользователя обновлены!');
            userModal.style.display = 'none';
            fetchAndDisplayUsers(); // Обновить список пользователей
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            alert(`Не удалось обновить данные пользователя: ${error.message}`);
        }
    });

    // Обработчики для создания постов
    showCreatePostFormButton.addEventListener('click', () => {
        createPostFormContainer.style.display = 'block';
        showCreatePostFormButton.style.display = 'none';
    });
    cancelCreatePostButton.addEventListener('click', () => {
        createPostFormContainer.style.display = 'none';
        showCreatePostFormButton.style.display = 'inline-block';
        postTitleInput.value = '';
        postContentInput.value = '';
        postOwnerIdInput.value = '';
    });
    submitCreatePostButton.addEventListener('click', async () => {
        const title = postTitleInput.value.trim();
        const content = postContentInput.value.trim();
        const ownerId = parseInt(postOwnerIdInput.value.trim(), 10);

        if (!title || !content || isNaN(ownerId)) {
            alert('Пожалуйста, заполните все поля и укажите корректный ID пользователя.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/users/${ownerId}/posts/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(`HTTP error! status: ${response.status}, ${errorData.detail}`);
            }
            alert('Пост успешно создан!');
            postTitleInput.value = '';
            postContentInput.value = '';
            postOwnerIdInput.value = '';
            createPostFormContainer.style.display = 'none';
            showCreatePostFormButton.style.display = 'inline-block';
            fetchAndDisplayPosts();
        } catch (error) {
            console.error('Ошибка при создании поста:', error);
            alert(`Не удалось создать пост: ${error.message}`);
        }
    });

    // Обработчики для создания пользователей
    showCreateUserFormButton.addEventListener('click', () => {
        createUserFormContainer.style.display = 'block';
        showCreateUserFormButton.style.display = 'none';
    });
    cancelCreateUserButton.addEventListener('click', () => {
        createUserFormContainer.style.display = 'none';
        showCreateUserFormButton.style.display = 'inline-block';
        userFioCreateInput.value = '';
        userEmailCreateInput.value = '';
        userAddressCreateInput.value = '';
    });
    submitCreateUserButton.addEventListener('click', async () => {
        const fio = userFioCreateInput.value.trim();
        const email = userEmailCreateInput.value.trim();
        const address = userAddressCreateInput.value.trim() || null;

        if (!fio || !email) {
            alert('Пожалуйста, заполните ФИО и Email.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fio, email, address })
            });
             if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(`HTTP error! status: ${response.status}, ${errorData.detail}`);
            }
            alert('Пользователь успешно создан!');
            userFioCreateInput.value = '';
            userEmailCreateInput.value = '';
            userAddressCreateInput.value = '';
            createUserFormContainer.style.display = 'none';
            showCreateUserFormButton.style.display = 'inline-block';
            fetchAndDisplayUsers();
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            alert(`Не удалось создать пользователя: ${error.message}`);
        }
    });
    
    // Функции и обработчики для удаления
    function addDeletePostEventListeners() {
        document.querySelectorAll('.delete-post-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const postId = event.target.dataset.id;
                if (confirm(`Вы уверены, что хотите удалить пост ID ${postId}?`)) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, { method: 'DELETE' });
                        if (!response.ok) throw new Error('Не удалось удалить пост.');
                        alert('Пост удален.');
                        fetchAndDisplayPosts();
                    } catch (error) {
                        console.error('Ошибка при удалении поста:', error);
                        alert(error.message);
                    }
                }
            });
        });
    }

    function addDeleteUserEventListeners() {
        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const userId = event.target.dataset.id;
                if (confirm(`Вы уверены, что хотите удалить пользователя ID ${userId}? (Все его посты также будут удалены)`)) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/users/${userId}`, { method: 'DELETE' });
                        if (!response.ok) throw new Error('Не удалось удалить пользователя.');
                        alert('Пользователь удален.');
                        fetchAndDisplayUsers();
                        // Если открыта секция постов, тоже обновить, т.к. посты пользователя могли быть удалены
                        if (postsSection.style.display === 'block') {
                            fetchAndDisplayPosts();
                        }
                    } catch (error) {
                        console.error('Ошибка при удалении пользователя:', error);
                        alert(error.message);
                    }
                }
            });
        });
    }


    // Навигация
    navMain.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navMain);
        showSection(mainSection);
        // Здесь можно добавить логику для "Главной", если нужно (например, загрузка данных текущего пользователя)
        document.getElementById('main-fio').textContent = "Пожалуйста, выберите пользователя или войдите в систему.";
    });

    navPosts.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navPosts);
        showSection(postsSection);
        fetchAndDisplayPosts();
    });

    navUsers.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav(navUsers);
        showSection(usersSection);
        fetchAndDisplayUsers();
    });

    // Инициализация: показать главную страницу по умолчанию
    setActiveNav(navMain);
    showSection(mainSection);
    document.getElementById('main-fio').textContent = "Добро пожаловать!";

});
