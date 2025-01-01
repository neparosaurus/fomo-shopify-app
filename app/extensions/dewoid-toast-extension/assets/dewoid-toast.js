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
    const textContentLayout = options.textContent;
    const designTemplateId = options.designTemplateId;
    const showThumbnail = options.showThumbnail;
    const thumbnailPosition = options.thumbnailPosition;
    const verticalAlignment = options.verticalAlignment;
    const cornerRadius = options.cornerRadius;
    const rtl = options.rtl;

    let toastTimeout;
    let remainingTime = displayDuration;
    let toastStartTime;
    let shownIndexes = [];

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

    if (fontFamily !== 'default') {
        loadFont(fontFamily);
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
    :root {
      --bg-color-1: #222;
      --text-color-1: #fff;
      --close-color-1: #fff;
      
      --bg-color-2: #222;
      --bg-color-2-darker: #111;
      --bg-color-2-brighter: #333;
      --text-color-2: #fff;
      --text-color-2-darker: #ccc;
      --close-color-2: #fff;
      
      --bg-color-3: #222;
      --bg-color-3-border: #111;
      --text-color-3: #fff;
      --text-color-3-darker: #ccc;
      --close-color-3: #ccc;
      
      --bg-color-4: #222;
      --text-color-4: #fff;
      --text-color-4-darker: #999;
      --text-color-4-bg: #444;
      --close-color-4: #fff;
    }

    .toast-container {
      ${options.fontFamily !== 'default' ? `font-family: '${options.fontFamily}', sans-serif;` : ''}
      ${options.position.includes('top') ? `top: 20px;` : 'bottom: 20px;'}
      ${options.position.includes('left') ? `left: 0;` : 'right: 0;'}
      transition: opacity 0.5s, visibility 0.5s, ${options.position.includes('left') ? 'left' : 'right'} 0.5s;
    }

    .toast-container.toast-show {
      ${options.position.includes('left') ? 'left' : 'right'}: 20px;
    }
  `;
    document.head.appendChild(style);

    function showToast() {
        if (shuffle) {
            let previousOrderIndex = currentOrderIndex - 1;
            currentOrderIndex = getRandomInt(0, orders.length);

            if (shownIndexes.length === orders.length) {
                shownIndexes = [];

                if (!loop) {
                    return;
                }
            }

            while (orders.length > 1 && (previousOrderIndex === currentOrderIndex || shownIndexes.includes(currentOrderIndex))) {
                currentOrderIndex = getRandomInt(0, orders.length);
            }

            shownIndexes.push(currentOrderIndex);
        } else if (currentOrderIndex >= orders.length) {
            currentOrderIndex = 0;

            if (!loop) {
                return;
            }
        }

        const { customerName, location, productTitle, productHandle, productImage, createdAtAgo } = orders[currentOrderIndex] || {};
        let toastMessage = replacePlaceholders(textContentLayout, {
            customerName,
            location,
            productTitle,
            productHandle,
            createdAtAgo
        });
        const imageHeight = designTemplateId === 1 ? "120" : "84";
        const showThumbnailClass = showThumbnail ? ' toast-show-thumb' : '';
        const thumbnailPositionClass = thumbnailPosition === "start" ? ' toast-order-2' : '';
        const verticalAlignmentClass = verticalAlignment === "top" ? ' toast-align-top' : '';
        const cornerRadiusClass = cornerRadius === 0 ? ' toast-flat' : '';
        const rtlClass = rtl ? ' toast-rtl' : '';
        const styleClass = ` style-${designTemplateId}`;

        let toastHtml = `
            <div class=
                toast-content
                ${showThumbnail ? 'toast-show-thumb' : ''}
                ${thumbnailPosition === "start" ? 'toast-order-2' : ''}
                ${cornerRadius === 0 ? 'toast-flat' : ''}
                ${verticalAlignment === "top" ? 'toast-align-top' : ''}
                ${rtl ? 'toast-rtl' : ''}
                style-${designTemplateId}
            >
                <div class="toast-message">${toastMessage}</div>
                ${productImage ? `<div class="toast-image">
                    <img src="${productImage}&height=${designTemplateId === 1 ? "120" : "84"}" alt="${productTitle || 'Product Image'}">
                </div>` : ''}
                <div class="toast-close"></div>
            </div>`;

        toastContainer.innerHTML = toastHtml;
        toastContainer.classList.add('toast-show');

        toastStartTime = performance.now();
        remainingTime = displayDuration;

        toastTimeout = setTimeout(hideToast, remainingTime);
        currentOrderIndex++;
    }

    function replacePlaceholders(template, data) {
        return template
            .replace('{{ customer }}', data.customerName ? `<span>${data.customerName}</span>` : '')
            .replace('{{ location }}', data.location ? `<span>${data.location}</span>` : '')
            .replace('{{ product }}', data.productTitle && data.productHandle ?
                `<a href="/products/${data.productHandle}" target="_blank">${data.productTitle}</a>` : '')
            .replace('{{ createdAt }}', data.createdAtAgo ? `${data.createdAtAgo}` : '');
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
        const elapsedTime = performance.now() - toastStartTime;
        remainingTime -= elapsedTime;
    });

    toastContainer.addEventListener('mouseleave', () => {
        toastStartTime = performance.now();
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