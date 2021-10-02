const mercadopago = new MercadoPago('TEST-19f2782f-5d29-4739-b34e-652f190c0a16', {
    locale: 'es-AR' // The most common are: 'pt-BR', 'es-AR' and 'en-US'
  });
  

    $('#checkout-btn').click(function() {
        console.log('click');
    $('#checkout-btn').attr("disabled", true);
    
    const orderData = {
      quantity: document.getElementById("quantity").value,
      description: document.getElementById("product-description").innerHTML,
      price: document.getElementById("unit-price").innerHTML
    };
      
    fetch("/create_preference", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then(function(response) {
          return response.json();
      })
      .then(function(preference) {
          createCheckoutButton(preference.id);
          
          $(".shopping-cart").fadeOut(500);
          setTimeout(() => {
              $(".container_payment").show(500).fadeIn();
          }, 500);
      })
      .catch(function() {
          alert("Unexpected error");
          $('#checkout-btn').attr("disabled", false);
      });
  });
  
  // Create preference when click on checkout button
  function createCheckoutButton(preferenceId) {
    // Initialize the checkout
    mercadopago.checkout({
      preference: {
        id: preferenceId
      },
      render: {
        container: '#button-checkout', // Class name where the payment button will be displayed
        label: 'Pay', // Change the payment button text (optional)
      }
    });
  }