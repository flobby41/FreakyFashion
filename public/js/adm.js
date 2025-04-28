function fetchData() {
  fetch('http://localhost:3000/products/api/products')
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error('could not fetch products');
      }
    })
    .then(data => {  
      let placeholder = document.querySelector('#data-output');
      let out = '';
      for (let product of data) {
        out += `
          <tr>
            <td>${product.name}</td>
            <td>${product.SKU}</td>
            <td>${product.price}</td>
            <td> 
              <button class="delete-btn" data-id="${product.id}">
                <i class="fa fa-trash"></i> 
              </button>     
            </td>
          </tr>
        `;
      }
      placeholder.innerHTML = out;

      // Attache les écouteurs de suppression après le rendu de la liste
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
          const productId = event.target.closest('button').getAttribute('data-id');

          if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            try {
              const response = await fetch(`http://localhost:3000/products/api/products/${productId}`, {
                method: 'DELETE'
              });

              if (response.ok) {
                alert("Produit supprimé avec succès");
                fetchData(); // Recharge les données sans recharger toute la page
              } else {
                alert("Erreur lors de la suppression du produit");
              }
            } catch (error) {
              console.error("Erreur réseau :", error);
              alert("Erreur réseau lors de la tentative de suppression");
            }
          }
        });
      });
    })
    .catch(err => console.error('error loading products'));
}


