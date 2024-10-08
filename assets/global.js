document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-to-cart-form");
  const addButton = document.getElementById("add-to-cart-button");
  const variantRadios = document.querySelectorAll('input[name="id"]');
  const cartPopup = document.getElementById("cart-popup");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const continueShopping = document.getElementById("continue-shopping");
  const loader = document.getElementById("loader");

  const updateVariantSelection = () => {
    document.querySelectorAll(".variant-radio").forEach((label) => {
      label.classList.remove("checked");
    });

    variantRadios.forEach((radio) => {
      if (radio.checked) {
        const variantRadio = radio.closest(".variant-radio");
        if (variantRadio) {
          variantRadio.classList.add("checked");
          const variantPrice = variantRadio
            .querySelector(".variant-radio__label:last-child")
            ?.textContent.trim();
          if (addButton) {
            addButton.textContent = `Add to Cart - ${variantPrice || ""}`;
          }
        }
      }
    });
  };

  updateVariantSelection();

  variantRadios.forEach((radio) => {
    radio.addEventListener("change", updateVariantSelection);
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      if (loader) loader.style.display = "flex";

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
          return fetch("/cart.js");
        })
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
        })
        .finally(() => {
          if (loader) loader.style.display = "none";
        });
    });
  }

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
          <img class="cart-item__image" src="${item.image}" alt="${item.title}" loading="lazy">
          <div class="cart-item__details">
            <p>${item.product_title}</p>
            <p>${item.variant_title}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: ${formatMoney(item.price, cart.currency)}</p>
          </div>
          <button class="cart-item__remove" data-variant-id="${item.variant_id}">Remove</button>
        `;
        cartItems.appendChild(cartItem);
      });
      cartTotal.textContent = `Total: ${formatMoney(cart.total_price, cart.currency)}`;
      if (checkoutButton) {
        checkoutButton.style.display = "inline-block";
      }
    }

    cartPopup.style.display = "flex";
    attachRemoveItemListeners();
  };

  const attachRemoveItemListeners = () => {
    const removeButtons = document.querySelectorAll(".cart-item__remove");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const variantId = e.target.getAttribute("data-variant-id");
        removeCartItem(variantId);
      });
    });
  };

  const removeCartItem = (variantId) => {
    fetch(`/cart/change.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 0,
      }),
    })
      .then((response) => response.json())
      .then((cart) => {
        displayCartPopup(cart);
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  };

  const formatMoney = (cents, currency) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    });
    return formatter.format(cents / 100);
  };

  if (continueShopping) {
    continueShopping.addEventListener("click", () => {
      cartPopup.style.display = "none";
    });
  }
});