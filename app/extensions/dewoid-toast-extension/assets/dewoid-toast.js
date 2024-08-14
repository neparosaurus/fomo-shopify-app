const dewoidToast = function(options) {
    const orders = options.orders;
    let currentOrderIndex = 0;

    const scriptLoadDelay = performance.now();
    const initialDelay = options.initialDelay * 1000;
    const totalInitialDelay = initialDelay < scriptLoadDelay ? 0 : scriptLoadDelay - initialDelay;
    const delay = options.delay * 1000;
    const displayDuration = options.duration * 1000;
    const fontFamily = options.fontFamily;
    const loop = options.loopOrders;
    const shuffle = options.shuffleOrders;
    const hideTime = options.hideTimeInOrders;
    const showThumbnail = options.showThumbnail;
    const thumbnailPosition = options.thumbnailPosition;
    const thumbnailSize = options.thumbnailSize;

    let toastTimeout;
    let remainingTime = displayDuration;
    let pauseStartTime;

    if (orders.length === 0) {
        return;
    }

    function loadFont(fontFamily) {
        if (fontFamily === 'default') return;

        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    if (options.fontFamily !== 'default') {
        loadFont(options.fontFamily);
    }

    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';

    const toastContent = document.createElement('div');
    toastContent.className = 'toast-content';

    const toastMessage = document.createElement('div');
    toastMessage.className = 'toast-message';

    toastContent.appendChild(toastMessage);
    toastContainer.appendChild(toastContent);
    document.body.appendChild(toastContainer);

    const style = document.createElement('style');

    style.innerHTML = `
    .toast-container {
      ${options.fontFamily !== 'default' ? `font-family: '${options.fontFamily}', sans-serif;` : ''}
      ${options.position.includes('top') ? `top: 20px;` : 'bottom: 20px;'}
      ${options.position.includes('left') ? `left: 0;` : 'right: 0;'}
      background-color: ${options.backgroundColor};
      border-radius: ${options.cornerStyle === 'rounded' ? '5px' : '0'};
      transition: opacity 0.5s, visibility 0.5s, ${options.position.includes('left') ? 'left' : 'right'} 0.5s;
    }

    .toast-message,
    .toast-message span,
    .toast-message a {
      color: ${options.textColor} !important;
    }
    
    .toast-message img {
      ${options.thumbnailPosition === 'left' ? 'margin-left: -4px; margin-right: 4px;' : 'margin-right: -4px; margin-left: 4px;'}
      height: ${thumbnailSize}px;
    }

    .toast-container.toast-show {
      ${options.position.includes('left') ? 'left' : 'right'}: 20px;
    }
  `;
    document.head.appendChild(style);

    function showToast() {
        if (shuffle) {
            currentOrderIndex = getRandomInt(0, orders.length - 1);
        } else if (currentOrderIndex >= orders.length) {
            currentOrderIndex = 0;

            if (!loop) {
                return;
            }
        }

        const { customerName, location, productTitle, productHandle, productImage, createdAtAgo } = orders[currentOrderIndex];
        toastMessage.innerHTML = ``;
        if (showThumbnail && productImage && thumbnailPosition === 'left') {
            toastMessage.innerHTML += `<img src="${productImage}&height=84" alt="${productTitle}" />`;
        }
        toastMessage.innerHTML += `<span>${customerName}</span>`;
        if (location) {
            toastMessage.innerHTML += ` from <span>${location}</span>`;
        }
        hideTime ? toastMessage.innerHTML += ` bought` : toastMessage.innerHTML += ` ${createdAtAgo}`;
        toastMessage.innerHTML += ` <a href="/products/${productHandle}" target="_blank">${productTitle}</a>`;
        if (showThumbnail && productImage && thumbnailPosition === 'right') {
            toastMessage.innerHTML += `<img src="${productImage}&height=84" alt="${productTitle}" />`;
        }
        toastContainer.classList.add('toast-show');

        // Start the timeout for hiding the toast
        pauseStartTime = performance.now();
        toastTimeout = setTimeout(hideToast, remainingTime);
        currentOrderIndex++;
    }

    function hideToast() {
        toastContainer.classList.remove('toast-show');
        setTimeout(showToast, delay);
    }

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);

        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }

    setTimeout(showToast, totalInitialDelay);

    toastContainer.addEventListener('mouseenter', () => {
        clearTimeout(toastTimeout);
        const elapsedTime = performance.now() - pauseStartTime;
        remainingTime -= elapsedTime;
    });

    toastContainer.addEventListener('mouseleave', () => {
        pauseStartTime = performance.now();
        toastTimeout = setTimeout(hideToast, remainingTime);
    });
};

async function dewoidToastInit() {
    const url = `https://toast.dewoid.com/public/data.json?store=${window.dewoidToast.host}&csrf=${window.dewoidToast.csrf}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        dewoidToast(data);
    } catch (error) {
        console.error(error.message);
    }
}

dewoidToastInit();