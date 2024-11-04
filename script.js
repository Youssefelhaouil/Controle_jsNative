let TArticles = [];
let TArticlesChoisis = [];

function init() {
  $.ajax({
    url: "articles.json",
    method: "GET",
    dataType: "json",
    success: function (data) {
      TArticles = data;
      ChargerPizza();
    },
    error: function () {
      alert("Erreur lors du chargement des articles.");
    },
  });
}

function ChargerPizza() {
  const pizzaSelect = document.getElementById("pizza");
  TArticles.forEach((article) => {
    const option = document.createElement("option");
    option.value = article.code;
    option.setAttribute("data-prix", article.prixUnitaire);
    option.textContent = article.designation;
    pizzaSelect.appendChild(option);
  });
}

function ajouter() {
  const nom = document.getElementById("nom").value;
  const adresse = document.getElementById("adresse").value;
  const pizzaCode = document.getElementById("pizza").value;
  const quantite = parseInt(document.getElementById("quantite").value);
  const prixUnitaire = parseFloat(document.querySelector("#pizza option:checked").getAttribute("data-prix")); 

  if (!nom || !adresse || isNaN(quantite)) {
    alert("saisir tous les champs.");
    return;
  }
  if (quantite < 1 || quantite > 10) {
    alert("La quantité doit être comprise entre 1 et 10");
    return; 
  }

  const articleChoisi = {
    designation: TArticles.find((article) => article.code === pizzaCode).designation,
    quantite: quantite,
    prixUnitaire: prixUnitaire,
  };

  TArticlesChoisis.push(articleChoisi);
  updateTable();
  calculateTotal();
}

function updateTable() {
  const tbody = document.querySelector("#tableArticles tbody");
  tbody.innerHTML = "";

  TArticlesChoisis.forEach((article) => {
    tbody.innerHTML += `
            <tr>
               <td class="p-2 border">${article.designation}</td>
               <td class="p-2 border">${article.quantite}</td>
               <td class="p-2 border">${(article.prixUnitaire * article.quantite).toFixed(2)} DH</td>
            </tr>
        `;
  });

  const total = TArticlesChoisis.reduce(
    (sum, article) => sum + (article.prixUnitaire * article.quantite), 
    0
  );

  const montantTotal = document.querySelector(".MontantTotal"); 
  montantTotal.innerHTML = `<h1 class="font-bold text-xl pt-4">Montant Total = ${total.toFixed(2)} DH</h1>`;
}

function calculateTotal() {
  const total = TArticlesChoisis.reduce(
    (sum, article) => sum + (article.prixUnitaire * article.quantite),
    0
  );
  document.getElementById("total").value = total.toFixed(2) + " DH";
}

function gererPaiement() {
  const isCheque = document.getElementById("cheque").checked;
  document.getElementById("numCarteBancaire").disabled = isCheque;
}

function afficherPopup() {
  let details = TArticlesChoisis.map(
    (article) =>
      `${article.designation} - Quantité: ${article.quantite} - Prix Unitaire: ${(article.prixUnitaire * article.quantite).toFixed(2)} DH`
  ).join("<br>");
  
  const total = TArticlesChoisis.reduce(
    (sum, article) => sum + (article.prixUnitaire * article.quantite),
    0
  );

  details += `<br><h1 class="font-bold text-xl pt-4">Montant Total: ${total.toFixed(2)} DH</h1>`; 
  document.getElementById("details").innerHTML = details;
  document.getElementById("popup").style.display = "flex";
}

function fermerPopup() {
  document.getElementById("popup").style.display = "none";
}

function imprimerCommande() {
  window.print();
}

init();  
