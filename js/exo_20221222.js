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
                    $(".cart").empty().append("<div>Voici la liste de vos produits. Vous pouvez changer les quantités si vous le souhaitez.</div><div id=\"confirmHeader\"><span id=\"totalPriceLeft\">Total : <span id=\"totalPrice\"></span>€</span><button class=\"btn btn-primary confirmOrder\" type=\"button\" data-bs-toggle=\"offcanvas\" data-bs-target=\"#offcanvasleft\" aria-controls=\"offcanvasleft\">Valider ma commande</button></div>");
                }
                var productIndex = Number.parseFloat($(this).attr("id").match(regExProduct));
                if (($("#productID-"+productIndex)).length != 0) {
                    var incrementQty = 1 + Number.parseFloat(($("#productID-"+productIndex)).children("div.inside1").children(".inside2").children(".qty").val());
                    $("#productID-"+productIndex+" .qty").val(incrementQty);
                } else {
                    $(".cart").append("<div class=\"productInCart\" id=\"productID-"+productIndex+"\"><div>Désignation : <strong class=\"prodName\">"+data.produits[productIndex].nom+"</strong></div><button class=\"btn btn-danger deleteButton\" id=\"deleteButton-"+productIndex+"\" type=\"button\">Supprimer</button><div class=\"inside1\"><div class=\"inside2\">Quantité : <input type=\"number\" class=\"qty\"></div><div class=\"inside2\">Prix : <strong class=\"unitPrice\">"+data.produits[productIndex].prix+"€</strong></div></div></div>");
                    $("#productID-"+productIndex+" .qty").val(1);
                }
                var quantitiesInCart = [];
                $(".qty").each(function(){
                    quantitiesInCart.push(Number.parseFloat($(this).val()));
                });
                intoCart = 0;
                quantitiesInCart.forEach(element => {
                    intoCart += Number.parseFloat(element);
                });
                $("#intoCart").text(intoCart);
                var pricesInCart = []
                $(".unitPrice").each(function(){
                    pricesInCart.push(Number.parseFloat($(this).html().match(regExProduct)));
                });
                if (quantitiesInCart.length == pricesInCart.length) {
                    cartTotal = 0;
                    for (let index = 0; index < quantitiesInCart.length; index++) {
                        cartTotal += quantitiesInCart[index] * pricesInCart[index];
                    }
                }
                $("#totalPrice").text(cartTotal);

                var qtyFields = $(".qty");
                qtyFields.each(function(){
                    // $(this).keyup(function(){
                    //     updateCartTotal();
                    // })
                    $(this).change(function(){
                        updateCartTotal();
                        if (($(".cart div").html().match("Votre panier est tristement vide en ce moment") != null) || (cartTotal == 0)) {
                            intoCart = 0;
                        }
                    })
                });

                var deleteButtons = $(".deleteButton");
                deleteButtons.each(function(){
                    $(this).click(function(){
                        var toDelete = $(this).attr('id').replace("deleteButton-", "productID-");
                        $("#"+toDelete).remove();
                        updateCartTotal();
                        if (($(".cart div").html().match("Votre panier est tristement vide en ce moment") != null) || (cartTotal == 0)) {
                            intoCart = 0;
                        }
                    })
                });
            });
        });
    },
    error:function(xhr, status){
        alert(xhr.status);
    }
});

function updateCartTotal() {
    var cartTotal = 0;
    var intoCart = 0;
    var regExProduct = /\d+/g;
    var quantitiesInCart = [];
    $(".qty").each(function(){
        quantitiesInCart.push(Number.parseFloat($(this).val()));
        intoCart = intoCart + Number.parseFloat($(this).val());
    });
    var pricesInCart = []
    $(".unitPrice").each(function(){
        pricesInCart.push(Number.parseFloat($(this).html().match(regExProduct)));
    });
    if (quantitiesInCart.length == pricesInCart.length) {
        cartTotal = 0;
        for (let index = 0; index < quantitiesInCart.length; index++) {
            cartTotal += quantitiesInCart[index] * pricesInCart[index];
        }
    }
    if (intoCart == 0) {
        $("#intoCart").text("");
    } else {
        $("#intoCart").text(intoCart);
    }
    if ((cartTotal == 0) && (intoCart == 0)) {
        $(".cart").empty().append("<div class=\"offcanvas-body cart\"><img src=\"img/shopping-cart.jpg\" alt=\"Shopping cart\"><div>Votre panier est tristement vide en ce moment</div></div>");
    } else {
        $("#totalPrice").text(cartTotal);
    }
}

$(".confirmRegister").click(function(){
    $("#confOrdPagNom").text($("#nom").val());
    $("#confOrdPagPrenom").text($("#prenom").val());
    $("#confOrdPagEmail").text($("#email").val());
    $("#confOrdPagPhone").text($("#phone").val());
    $("#confOrdPagAdresse").text($("#adresse").val());
    $("#confOrdPagCP").text($("#cp").val());
    $("#confOrdPagVille").text($("#ville").val());
    $("#confOrdPagCart").html("");
    $(".productInCart").each(function(){
        $("#confOrdPagCart").append("<div><strong>"+$(".productInCart .prodName").html()+"</strong></div><div id=\"confOrdPagDetails\"><div>Prix unitaire : <strong>"+$(".productInCart .unitPrice").html()+"</strong></div><div>Quantité : <strong>"+$(".productInCart .qty").val()+"</strong></div></div><hr>");
    })
    
    $("#confOrdPagTotal").text($("#totalPrice").html());
})