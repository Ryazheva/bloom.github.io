// Получаем ссылку на элемент HTML, где будет отображаться общая сумма корзины
const cartTotalElement = document.getElementById('cart-total');

// Получаем ссылку на элемент HTML, где будут отображаться товары в корзине
const cartItemsElement = document.getElementById('cart-items');

// Загружаем данные корзины из локального хранилища (localStorage).
// Если в localStorage нет данных о корзине, создаем пустой массив.
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Инициализируем переменную для хранения общей суммы корзины.
let cartTotal = 0;

// -----------------------------------------------------------------------------

// Функция для сохранения данных корзины в локальное хранилище (localStorage).
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// -----------------------------------------------------------------------------

// Функция для добавления товара в корзину.
function addToCart(button) {
  // Получаем ID товара из атрибута data-product-id кнопки, на которую нажали.
  const productId = button.dataset.productId;

  // Получаем название товара из атрибута data-product-name кнопки.
  const productName = button.dataset.productName;

  // Получаем URL изображения товара из атрибута data-product-img кнопки.
  const productImg = button.dataset.productImg;

  // Находим ближайший родительский элемент с классом 'box'. Это контейнер товара.
  const box = button.closest('.box');

  // Находим элемент, содержащий цену товара, внутри контейнера товара.
  const priceElement = box.querySelector('.price');

  // Получаем текстовое содержимое элемента с ценой.
  const priceText = priceElement.textContent;

  // Используем регулярное выражение для извлечения числового значения цены из текста.
  const priceMatch = priceText.match(/(\d+)/);

  // Проверяем, удалось ли извлечь цену.
  if (priceMatch) {
    // Преобразуем извлеченную цену из строки в число с плавающей точкой (float).
    const price = parseFloat(priceMatch[1]);

    // Проверяем, является ли цена числом (не NaN - Not a Number).
    if (!isNaN(price)) {
      // Ищем в корзине товар с таким же ID, как у добавляемого товара.
      const existingItem = cart.find(item => item.id === productId);

      // Если товар уже есть в корзине...
      if (existingItem) {
        // ...увеличиваем его количество на 1.
        existingItem.quantity++;
      } else {
        // ...иначе добавляем новый товар в корзину.
        cart.push({
          id: productId,     
          name: productName,   
          img: productImg,       
          price: price,       
          quantity: 1          
        });
      }

      // Сохраняем обновленную корзину в localStorage.
      saveCart();

      // Обновляем общую сумму корзины.
      updateCartTotal();

      // Выводим сообщение в консоль (для отладки).
      console.log("Товар добавлен в корзину:", productId);
    } else {
      // Выводим сообщение об ошибке в консоль, если цена не является числом.
      console.error("Неверная цена:", priceElement.textContent);
    }
  } else {
    // Выводим сообщение об ошибке в консоль, если не удалось извлечь цену из текста.
    console.error("Не удалось извлечь цену из:", priceText);
  }
}

// -----------------------------------------------------------------------------

// Функция для удаления товара из корзины.
function removeFromCart(productId) {
  // Фильтруем массив cart, оставляя только те элементы, у которых ID не совпадает с productId.
  cart = cart.filter(item => item.id !== productId);

  // Сохраняем обновленную корзину в localStorage.
  saveCart();

  // Обновляем отображение товаров в корзине (перерисовываем корзину).
  displayCartItems();

  // Обновляем общую сумму корзины.
  updateCartTotal();
}

// -----------------------------------------------------------------------------

// Функция для обновления общей суммы корзины.
function updateCartTotal() {

  // Для каждого товара (item) в корзине мы умножаем цену (item.price) на количество (item.quantity) и добавляем к общей сумме (total).
  cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Проверяем, существует ли элемент cartTotalElement (элемент, где отображается общая сумма).
  if (cartTotalElement) {
    // Если элемент существует, обновляем его текстовое содержимое общей суммой корзины.
    cartTotalElement.textContent = cartTotal;
  } else {
    // Если элемент не существует, выводим сообщение об ошибке в консоль.
    console.error("Элемент с id 'cart-total' не найден.");
  }
}

// -----------------------------------------------------------------------------

// Функция для отображения товаров в корзине на странице корзины.
function displayCartItems() {
  if (!cartItemsElement) {
    console.error("Элемент с id 'cart-items' не найден.");
    return;
  }

  // Очищаем содержимое элемента cartItemsElement (удаляем все существующие товары).
  cartItemsElement.innerHTML = '';

  // Если корзина пуста
  if (cart.length === 0) {
    cartItemsElement.textContent = "Корзина пуста.";

    // Обновляем общую сумму, даже если корзина пуста, чтобы отобразить 0.
    updateCartTotal();
    return;
  }

  // Перебираем все товары в корзине.
  cart.forEach(item => {
    // Создаем новый элемент div для каждого товара.
    const cartItemDiv = document.createElement('div');

    // Добавляем класс 'cart-item' к элементу div (для стилизации).
    cartItemDiv.classList.add('cart-item');

    // Определяем URL изображения. 
    const imageUrl = item.img || 'images/default_image.png'; 

    // Формируем HTML-код для отображения товара в корзине.
    cartItemDiv.innerHTML = `
      <img src="${imageUrl}" alt="${item.name}" width="50">
      <span>${item.name} (${item.quantity} шт.)</span>
      <span>${item.price * item.quantity} руб.</span>
      <button onclick="removeFromCart('${item.id}')">Удалить</button>
    `;

    // Добавляем созданный элемент div с информацией о товаре в элемент cartItemsElement.
    cartItemsElement.appendChild(cartItemDiv);
  });

  // Обновляем общую сумму корзины.
  updateCartTotal();
}

// -----------------------------------------------------------------------------

// Этот код выполняется, когда страница полностью загружена (включая все ресурсы, такие как изображения).
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, существует ли элемент cartItemsElement.
  if (cartItemsElement) {
    // Если элемент существует (то есть мы находимся на странице корзины), отображаем товары в корзине.
    displayCartItems();
  }

  // Обновляем общую сумму корзины в любом случае (независимо от того, находимся мы на странице корзины или нет).
  updateCartTotal();
});