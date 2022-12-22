var heroText = document.getElementById("heroText");

var typewriter = new Typewriter(heroText, {
    loop: true,
    delay: 20,
    deleteSpeed: 20
  });

typewriter.typeString("C'est <strong class=\"red\">NOEL</strong>, je peux maintenant m'amuser avec : <strong class=\"red\">HTML</strong>")
    .pauseFor(2000)
    .deleteChars(4)
    .typeString("<strong class=\"red\">CSS</strong>")
    .pauseFor(2000)
    .deleteChars(3)
    .typeString("<strong class=\"red\">JS</strong>")
    .pauseFor(2000)
    .deleteChars(2)
    .typeString("<strong class=\"red\">JQUERY</strong>")
    .pauseFor(2000)
    .deleteChars(6)
    .typeString("<strong class=\"red\">AJAX</strong>")
    .pauseFor(2000)
    .start();

$.ajax({
    url:"ajax/produits.json",
    dataType:"json",
    
    success:function(data){
        $(data.produits).each(function(i){
            $("#products").append("<div class=\"card\"><img src=\""+this.image+"\" class=\"card-img-top\" alt=\""+this.nom+"\"><div class=\"card-body\"><h5 class=\"card-title\">"+this.nom+"</h5><p class=\"card-text\">"+this.description+"</p><p class=\"card-text price\">Prix : "+this.prix+"€</p><button class=\"btn btn-info addToCart\" id=\"addToCart"+i+"\">Ajouter au panier</button></div></div>");
        });

        var regExProduct = /\d+/g;
        var intoCart = 0;
        var cartTotal = 0;
        var addToCartButtons = $(".addToCart");
        addToCartButtons.each(function(){
            $(this).on("click", function(){
                if (intoCart == 0) {
                    $(".cart").empty().append("<div>Voici la liste de vos produits. Vous pouvez changer les quantités si vous le souhaitez.</div><div><span id=\"totalPriceLeft\">Total : <span id=\"totalPrice\"></span>€</span><button class=\"btn btn-primary\" type=\"button\" data-bs-toggle=\"offcanvas\" data-bs-target=\"#offcanvasleft\" aria-controls=\"offcanvasleft\">Valider ma commande</button></div>");
                }
                intoCart++;
                $("#intoCart").text(intoCart);
                var productIndex = Number.parseFloat($(this).attr("id").match(regExProduct));
                $(".cart").append("<div class=\"productInCart\"><div>Désignation : <strong>"+data.produits[productIndex].nom+"</strong></div><button class=\"btn btn-danger\" type=\"button\">Supprimer</button><div><div>Quantité : <input type=\"number\" value=\"1\" class=\"qty\"></div><div>Prix : <strong class=\"unitPrice\">"+data.produits[productIndex].prix+"€</strong></div></div></div>");
                var quantitiesInCart = [];
                $(".qty").each(function(){
                    quantitiesInCart.push(Number.parseFloat($(this).val()));
                });
                console.log($(quantitiesInCart));
                var pricesInCart = []
                $(".unitPrice").each(function(){
                    pricesInCart.push(Number.parseFloat($(this).html().match(regExProduct)));
                });
                console.log($(pricesInCart));
                if (quantitiesInCart.length == pricesInCart.length) {
                    cartTotal = 0;
                    for (let index = 0; index < quantitiesInCart.length; index++) {
                        cartTotal += quantitiesInCart[index] * pricesInCart[index];
                    }
                }
                console.log(cartTotal);
                $("#totalPrice").text(cartTotal);
            });
        });

        // if (($("#addGrade").val() != "") && (isNaN($("#addGrade").val()) == false)) {
        //     addedGrades.push(parseFloat($("#addGrade").val()));
        // };
        // for (let y = 0; y < addedGrades.length; y++) {
        //     data.etudiants[1].notes.push(Number.parseFloat(addedGrades[y]));
        // }
        // if (addedGrades.length > 0) {
        //     $("#alreadyAdded").text("Notes déjà ajoutées : "+addedGrades.toString().replaceAll(",", ", ")).fadeIn("fast");
        //     $("#addGrade").val("");
        // }

        // for (let index = 0; index < data.etudiants.length; index++) {
        //     var nom_etudiant = data.etudiants[index].nom;
        //     var prenom_etudiant = data.etudiants[index].prenom;
        //     var somme = 0;
        //     var currentStudent = data.etudiants[index];
        //     for (let index2 = 0; index2 < currentStudent.notes.length; index2++) {
        //         somme = somme + currentStudent.notes[index2];
        //     }
        //     var moyenne = Number.parseFloat(somme / (data.etudiants[index].notes.length)).toFixed(1);
        //     if (moyenne >= 10) {
        //         var pass = "Oui";
        //         var color = "green";
        //         var back = "bg-green";
        //     } else {
        //         var pass = "Non";
        //         var color = "red";
        //         var back = "bg-red";
        //     }
        //     $("#result").append("<div class =\"card "+back+"\"><p><b>Élève : "+prenom_etudiant+" "+nom_etudiant+"</b></p><p>Moyenne : "+moyenne+" / Admis : <span class=\""+color+"\">"+pass+"</span></p></div>");
        // }
    },
    error:function(xhr, status){
        alert(xhr.status);
    }
});