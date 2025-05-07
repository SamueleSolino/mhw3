const showMoreButton = document.querySelector('.vedi-di-piu');
const showLessButton = document.querySelector('.vedi-di-meno');

showMoreButton.addEventListener('click', onClickSeeMore);
showLessButton.addEventListener('click', onClickSeeLess);

function onClickSeeMore(event){
    const button = event.currentTarget;
    const container = button.parentNode; 
    const hiddenCards = container.querySelectorAll('.product-card.hidden');
    
    for (const card of hiddenCards) {
        card.classList.remove('hidden');
    }
    
    button.classList.add('hidden');
    showLessButton.classList.remove('hidden');
}

function onClickSeeLess(event){
    const button = event.currentTarget;
    const container = button.parentNode;
    const allCards = container.querySelectorAll('.product-card');
    
    for (let i = 5; i < allCards.length; i++) {
        allCards[i].classList.add('hidden');
    }
    
    button.classList.add('hidden'); 
    showMoreButton.classList.remove('hidden');
}


const bannerImages = [
    'offertadelgiorno.jpg', 
    'seconda.jpg',
    'immagine.jpg',
    'configuratore.jpg',
    'ldlcpc.jpg'
];

const bannerMenuItems = document.querySelectorAll('#banner-menu li');
const bannerImage = document.querySelector('.banner-content img');
const bannerDotsContainer = document.querySelector('.banner-dots-container');
let currentImageIndex = 2;

function createBannerDots() {
    bannerImages.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('banner-dot');
        if (index === currentImageIndex) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => changeBannerImage(index));
        bannerDotsContainer.appendChild(dot);
    });
}

createBannerDots();

bannerMenuItems.forEach((item, index) => {
    item.addEventListener('click', () => changeBannerImage(index));
});

function changeBannerImage(index) {
    if (index >= 0 && index < bannerImages.length) {
        currentImageIndex = index;
        
        bannerImage.style.opacity = '0';
        
        setTimeout(() => {
            bannerImage.src = bannerImages[index];
            bannerImage.style.opacity = '1';
        }, 300);
        
        bannerMenuItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        const dots = bannerDotsContainer.querySelectorAll('.banner-dot');
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

let touchStartX = 0;
let touchEndX = 0;

bannerImage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

bannerImage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
   
    if (swipeDistance < -swipeThreshold) {
        let nextIndex = currentImageIndex + 1;
        if (nextIndex >= bannerImages.length) {
            nextIndex = 0;
        }
        changeBannerImage(nextIndex);
    }
    
    if (swipeDistance > swipeThreshold) {
        let prevIndex = currentImageIndex - 1;
        if (prevIndex < 0) {
            prevIndex = bannerImages.length - 1;
        }
        changeBannerImage(prevIndex);
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
        this.cartBadge = document.querySelector('.cart-badge');
        this.cartDropdown = document.querySelector('.cart-dropdown');
        this.cartItemsContainer = document.querySelector('.cart-items-container');
        this.cartTotalPrice = document.querySelector('.cart-total-price');
        this.cartIcon = document.querySelector('.cart-icon');
        
        this.initEventListeners();
        const addToCartButtons = document.querySelectorAll('.btn-primary');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => this.addToCart(event));
        });
    }
    
    initEventListeners() {
        this.cartIcon.addEventListener('click', (event) => {
            event.preventDefault();
            this.cartDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (event) => {
            if (!this.cartIcon.contains(event.target) && !this.cartDropdown.contains(event.target)) {
                this.cartDropdown.classList.add('hidden');
            }
        });
        
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length > 0) {
                    alert('Grazie per il tuo acquisto!');
                    this.items = [];
                    this.updateCart();
                } else {
                    alert('Il tuo carrello è vuoto!');
                }
            });
        }
    }
    
    addToCart(event) {
        const productCard = event.target.closest('.product-card');
        if (!productCard) return;
        
        const productTitle = productCard.querySelector('h3').textContent;
        const productPriceText = productCard.querySelector('.product-price').textContent;
        const productPrice = parseFloat(productPriceText.replace('€', '').replace(',', '.'));
        
        const existingItemIndex = this.items.findIndex(item => item.title === productTitle);
        
        if (existingItemIndex !== -1) {
            this.items[existingItemIndex].quantity++;
        } else {
            this.items.push({
                title: productTitle,
                price: productPrice,
                quantity: 1
            });
        }
        this.updateCart();
        
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Aggiunto!';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 800);
    }
    
    updateCart() {
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        this.cartBadge.textContent = totalItems;
        
        if (totalItems > 0) {
            this.cartBadge.classList.remove('hidden');
        } else {
            this.cartBadge.classList.add('hidden');
        }
        this.cartItemsContainer.innerHTML = '';
        
        if (this.items.length === 0) {
            const emptyCartMessage = document.createElement('p');
            emptyCartMessage.textContent = 'Il carrello è vuoto';
            emptyCartMessage.style.textAlign = 'center';
            emptyCartMessage.style.padding = '10px';
            this.cartItemsContainer.appendChild(emptyCartMessage);
        } else {
            this.items.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                        <button class="remove-btn" data-index="${index}">×</button>
                    </div>
                `;
                
                this.cartItemsContainer.appendChild(cartItem);
            });
            const decreaseButtons = this.cartItemsContainer.querySelectorAll('.quantity-btn.decrease');
            const increaseButtons = this.cartItemsContainer.querySelectorAll('.quantity-btn.increase');
            const removeButtons = this.cartItemsContainer.querySelectorAll('.remove-btn');
            
            decreaseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.dataset.index);
                    this.decreaseQuantity(index);
                });
            });
            
            increaseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.dataset.index);
                    this.increaseQuantity(index);
                });
            });
            
            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.dataset.index);
                    this.removeItem(index);
                });
            });
        }
        
        const totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        this.cartTotalPrice.textContent = `€${totalPrice.toFixed(2)}`;
    }
    
    increaseQuantity(index) {
        if (this.items[index]) {
            this.items[index].quantity++;
            this.updateCart();
        }
    }
    
    decreaseQuantity(index) {
        if (this.items[index]) {
            if (this.items[index].quantity > 1) {
                this.items[index].quantity--;
            } else {
                this.removeItem(index);
            }
            this.updateCart();
        }
    }
    
    removeItem(index) {
        this.items.splice(index, 1);
        this.updateCart();
    }
}
const cart = new ShoppingCart();

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');

mobileMenuToggle.addEventListener('click', function() {
    mainNav.classList.toggle('active');
    
    if (this.textContent === '≡') {
        this.textContent = '✕';
    } else {
        this.textContent = '≡';
    }
});

document.addEventListener('click', function(event) {
    const isClickInsideMenu = mainNav.contains(event.target);
    const isClickOnToggle = mobileMenuToggle.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        mobileMenuToggle.textContent = '≡';
    }
});

const chatbotWidget = document.getElementById('chatbot');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.querySelector('.chat-messages');

chatbotWidget.addEventListener('click', () => {
    chatbotWindow.classList.remove('hidden');
    chatbotWidget.classList.add('hidden');
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.add('hidden');
    chatbotWidget.classList.remove('hidden');
});
  
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
    
    appendMessage('Tu', userMessage);
    chatInput.value = '';
    
    const prePrompt = "Dovrai impersonare un assistente di un ecommerce di elettronica, rispondi in massimo quattro righe alla seguente domanda posta da un utente: ";
    
    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=secret', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prePrompt + userMessage }]
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Risposta API Gemini:', data);
        let responseText = 'Errore nella risposta';
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                responseText = candidate.content.parts[0].text;
            }
        
        appendMessage('Assistente', responseText);
    })
});

function appendMessage(sender, text) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    messageEl.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function compareWithAmazon(event) {
    const button = event.target;
    const productCard = button.closest('.product-card');
    const productTitle = productCard.querySelector('h3').textContent;
    const currentPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('€', '').replace(',', '.'));
    
    button.textContent = 'Ricerca in corso...';
    button.disabled = true;
    
        const searchUrl = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(productTitle)}&page=1&country=IT`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'secret',
                'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
            }
        };
        
        const searchResponse = await fetch(searchUrl, options);
        const searchData = await searchResponse.json();
        
        console.log('Risposta API:', searchData);
        
        const topResult = searchData.data.products[0];
        console.log('Primo risultato:', topResult);
        
        const amazonPrice = parseFloat(topResult.product_price.replace(',', '.'));
        
        const comparison = document.createElement('div');
        comparison.classList.add('price-comparison');
        
        if (isNaN(amazonPrice) || amazonPrice === undefined) {
            comparison.innerHTML = `<p>Prezzo Amazon: Non disponibile</p>`;
        } else if (amazonPrice < currentPrice) {
            comparison.innerHTML = `<p>Amazon: €${amazonPrice.toFixed(2)} <span class="better-price">Il nostro prezzo è peggiore della concorrrenza</span></p>`;
            comparison.querySelector('.better-price').style.color = 'red';
        } else if (amazonPrice > currentPrice) {
            comparison.innerHTML = `<p>Amazon: €${amazonPrice.toFixed(2)} <span class="better-price">Il prezzo presente sul nostro sito è migliore!</span></p>`;
            comparison.querySelector('.better-price').style.color = 'green';
        } else {
            comparison.innerHTML = `<p>Amazon: €${amazonPrice.toFixed(2)} <span class="better-price">Stesso prezzo</span></p>`;
            comparison.querySelector('.better-price').style.color = 'blue';
        }
        
        const existingComparison = productCard.querySelector('.price-comparison');
        if (existingComparison) {
            existingComparison.remove();
        }
        
        productCard.querySelector('.product-info').appendChild(comparison);
        
    
        button.textContent = 'Compara';
        button.disabled = false;
        
        setTimeout(() => {
            const comparison = productCard.querySelector('.price-comparison');
            if (comparison && comparison.parentNode) {
                comparison.remove();
            }
        }, 8000);
    
}

document.addEventListener('DOMContentLoaded', function() {
    const compareButtons = document.querySelectorAll('.btn-compare');
    compareButtons.forEach(button => {
        button.addEventListener('click', compareWithAmazon);
    });
});



