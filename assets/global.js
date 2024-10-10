document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-to-cart-form");
  const addButton = document.getElementById("add-to-cart-button");
  const variantRadios = document.querySelectorAll('input[name="id"]');
  const cartPopup = document.getElementById("cart-popup");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const continueShopping = document.getElementById("continue-shopping");
  const loader = document.getElementById("loader");
  const mainImage = document.querySelector(".featured-product__main-image img");
  const thumbnailsContainer = document.querySelector(
    ".featured-product__thumbnails"
  );
  const thumbnails = document.querySelectorAll(".thumbnail");
  const prevButton = document.querySelector(".slider-nav.prev");
  const nextButton = document.querySelector(".slider-nav.next");
  let currentIndex = 0;
  const radioButtons = document.querySelectorAll(".variant_custom-input");

  const updateCheckedClass = () => {
    document.querySelectorAll(".variant-radio").forEach((label) => {
      label.classList.remove("checked");
    });

    radioButtons.forEach((radio) => {
      if (radio.checked) {
        radio.closest(".variant-radio").classList.add("checked");
      }
    });
  };

  updateCheckedClass();

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", updateCheckedClass);
  });

  const updateMainImage = (index) => {
    mainImage.src = thumbnails[index].querySelector("img").dataset.fullImageUrl;
    currentIndex = index;
    updateActiveThumbnail();
    updateThumbnailSlider();
  };

  const updateActiveThumbnail = () => {
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
    });
  };

  const updateThumbnailSlider = () => {
    const thumbnailWidth = thumbnails[0].offsetWidth;
    const marginRight = parseFloat(getComputedStyle(thumbnails[0]).marginRight);
    const containerWidth = thumbnailsContainer.offsetWidth;
    const totalWidth = thumbnails.length * (thumbnailWidth + marginRight);

    let offset = currentIndex * (thumbnailWidth + marginRight);

    if (offset > totalWidth - containerWidth) {
      offset = totalWidth - containerWidth;
    } else if (offset < 0) {
      offset = 0;
    }

    thumbnailsContainer.style.transform = `translateX(-${offset}px)`;
  };

  const infiniteLoop = (index) => {
    if (index < 0) {
      return thumbnails.length - 1;
    } else if (index >= thumbnails.length) {
      return 0;
    }
    return index;
  };

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => updateMainImage(index));
  });

  prevButton.addEventListener("click", () => {
    currentIndex = infiniteLoop(currentIndex - 1);
    updateMainImage(currentIndex);
  });

  nextButton.addEventListener("click", () => {
    currentIndex = infiniteLoop(currentIndex + 1);
    updateMainImage(currentIndex);
  });

  let autoSlideInterval;

  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
      currentIndex = infiniteLoop(currentIndex + 1);
      updateMainImage(currentIndex);
    }, 5000);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  startAutoSlide();

  const slider = document.querySelector(".featured-product__slider");
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  variantRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const selectedVariant = this.value;
      const variantPrice = this.parentElement
        .querySelector(".variant-radio__label:last-child")
        .textContent.trim();
      addButton.textContent = this.disabled
        ? "Sold Out"
        : `Add to Cart - ${variantPrice}`;
      addButton.disabled = this.disabled;
    });
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      loader.style.display = "flex";

      fetch("/cart/add.js", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((item) => {
          updateCart();
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          loader.style.display = "none";
        });
    });
  }

  const updateCart = () => {
    fetch("/cart.js")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((cart) => {
        displayCartPopup(cart);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const displayCartPopup = (cart) => {
    cartItems.innerHTML = "";
    const checkoutButton = document.querySelector(
      '.cart-popup__buttons a[href="/checkout"]'
    );

    if (cart.items.length === 0) {
      cartItems.innerHTML = "<p>Your cart is empty.</p>";
      cartTotal.textContent = "";
      if (checkoutButton) {
        checkoutButton.style.display = "none";
      }
    } else {
      cart.items.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <img class="cart-item__image" src="${item.image}" alt="${
          item.title
        }" loading="lazy">
          <div class="cart-item__details">
            <p>${item.product_title}</p>
            <p>${item.variant_title}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: ${formatMoney(item.price, cart.currency)}</p>
          </div>
          <button class="cart-item__remove" data-variant-id="${
            item.variant_id
          }">Remove</button>
        `;
        cartItems.appendChild(cartItem);
      });
      cartTotal.textContent = `Total: ${formatMoney(
        cart.total_price,
        cart.currency
      )}`;
      if (checkoutButton) {
        checkoutButton.style.display = "inline-block";
      }
    }

    cartPopup.style.display = "flex";

    const removeButtons = document.querySelectorAll(".cart-item__remove");
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        removeFromCart(this.dataset.variantId);
      });
    });
  };

  const removeFromCart = (variantId) => {
    fetch("/cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 0,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((cart) => {
        updateCart();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  continueShopping.addEventListener("click", () => {
    cartPopup.style.display = "none";
  });

  const formatMoney = (cents, currency) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(cents / 100);
  };
});
