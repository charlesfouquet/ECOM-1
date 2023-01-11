// ============= TYPEWRITERJS =============
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

// CONSTRUCTION PAGE DES ARTICLES, GESTION DU PANIER (AJOUT, MODIFICATION, SUPPRESSION)
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

// ============= MISE A JOUR PANIER =============
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

// RECUPERATION ET INJECTION DES INFORMATIONS NECESSAIRES SUR PAGE DE CONFIRMATION
$(".confirmRegister").click(function(){
    $("#confOrdPagNom").text($("#nom").val());
    $("#confOrdPagPrenom").text($("#prenom").val());
    $("#confOrdPagEmail").text($("#email").val());
    $("#confOrdPagPhone").text($("#phone").val());
    $("#confOrdPagAdresse").text($("#adresse").val()+",");
    $("#confOrdPagCP").text($("#cp").val());
    $("#confOrdPagVille").text($("#ville").val());
    $("#confOrdPagCart").html("");
    $(".productInCart").each(function(i){
        $("#confOrdPagCart").append("<div><strong>"+$(".productInCart .prodName")[i].innerHTML+"</strong></div><div id=\"confOrdPagDetails\"><div>Prix unitaire : <strong>"+$(".productInCart .unitPrice")[i].innerHTML+"</strong></div><div>Quantité : <strong>"+$($(".productInCart .qty")[i]).val()+"</strong></div></div><hr>");
    })
    $("#confOrdPagTotal").text($("#totalPrice").html());
})

// ============= CONTROLE DE SAISIE : INITIALISATION =============
var regExEmail = /^\w+([.-]?\w+)@\w+([.-]?\w+)\.(\w{2,3})$/;
var regExTel = /\d{10}/;
var regExTel2 = /\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}/;
var regExPostCode = /\d{5}/;
var inputsList = $(".formInput");
var selectList = $("#ville");
var errorState = "y";

// ============= CONTROLE DE SAISIE : CHAMP PAR CHAMP EN LIVE (INPUTS UNIQUEMENT) =============
inputsList.each(function(){
    $(this).on("keyup", function() {
        if ($(this).val() == "") {
            $(this).css("background-color","rgb(255, 200, 200)");
            $($(this).siblings(".userHelp")).addClass("error").text("Le champ "+$($(this).siblings("label")).html()+" est requis");
        } else if (($(this).val() != "") && ($(this).attr("id") == "email")) {
            if (regExEmail.test($(this).val()) == false) {
                $(this).css("background-color","rgb(255, 200, 200)"); 
                $($(this).siblings(".userHelp")).addClass("error").text("Le champ "+$($(this).siblings("label")).html()+" n'est pas correctement rempli (par exemple : local@domain.com)");
            } else if (regExEmail.test($(this).val()) == true) {
                $(this).css("background-color","rgb(200, 255, 200)");
                $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
            } 
        } else if (($(this).val() != "") && ($(this).attr("id") == "phone")) {
            if ((regExTel.test($(this).val()) == false) && (regExTel2.test($(this).val()) == false)) {
                $(this).css("background-color","rgb(255, 200, 200)"); 
                $($(this).siblings(".userHelp")).addClass("error").text("Le champ "+$($(this).siblings("label")).html()+" n'est pas correctement rempli (par exemple : 0123456789)");
            } else if ((regExTel.test($(this).val()) == true) || (regExTel2.test($(this).val()) == true)) {
                $(this).css("background-color","rgb(200, 255, 200)");
                $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
            } 
        } else if (($(this).val() != "") && ($(this).attr("id") == "cp")) {
            if (regExPostCode.test($(this).val()) == false) {
                $(this).css("background-color","rgb(255, 200, 200)"); 
                $($(this).siblings(".userHelp")).addClass("error").text("Le champ "+$($(this).siblings("label")).html()+" n'est pas correctement rempli (par exemple : 75000)");
            } else if (regExPostCode.test($(this).val()) == true) {
                $(this).css("background-color","rgb(200, 255, 200)");
                $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
            } 
        } else if ($(this).val() != "") {
            $(this).css("background-color","rgb(200, 255, 200)");
            $($(this).siblings(".userHelp")).removeClass("error").text("*requis");   
        } 
        validateForm();
    });
});

// ============= CONTROLE DE SAISIE : SUR LA VILLE UNE FOIS LE CODE POSTAL SAISI =============
$("#cp").focusout(function(){
    if ($(this).val() != "") {
        selectList.each(function(){
            if (($(this).val() != "") && ($(this).attr("id") == "ville")) {
                if (($(this).val()) == "noTown") {
                    $(this).css("background-color","rgb(255, 200, 200)"); 
                    $($(this).siblings(".userHelp")).addClass("error").text("Aucune ville n'est sélectionnée");
                } else if (($(this).val()) != "noTown") {
                    $(this).removeAttr("style");
                    $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
                }
            }
        });
    };
    validateForm();
});

// ============= CONTROLE DE SAISIE : LORS DE CLICKS OU CHANGEMENTS DE VALEUR SUR VILLE =============
selectList.each(function(){
    $(this).on("click", function() {
        if (($(this).val() != "") && ($(this).attr("id") == "ville")) {
            if (($(this).val()) == "noTown") {
                $(this).css("background-color","rgb(255, 200, 200)"); 
                $($(this).siblings(".userHelp")).addClass("error").text("Aucune ville n'est sélectionnée");
            } else if (($(this).val()) != "noTown") {
                $(this).removeAttr("style");
                $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
            }
        }
    });
    $(this).on("change", function() {
        validateForm();
    });
});

// ============= CONTROLE DE SAISIE : FORMULAIRE ENTIER LORS DU SUBMIT =============
$("#userInfo").click(function(){
    formEmptyCheck(event);
})
function formEmptyCheck(event) {
    event.preventDefault();
    inputsList.each(function(){
        if ($(this).val() == "") {
            $($(this).siblings(".userHelp")).addClass("error").text("Le champ "+$($(this).siblings("label")).html()+" est requis");
            $(this).css("background-color","rgb(255, 200, 200)");
        } else if (($(this).val() != "") && ($(this).attr("id") == "email")) {
            if (regExEmail.test($(this).val()) == false) {
                $(this).css("background-color","rgb(255, 200, 200)"); 
                $($(this).siblings(".userHelp")).addClass("error").text("Le champ "+$($(this).siblings("label")).html()+" n'est pas correctement rempli (par exemple : local@domain.com)");
            } else if (regExEmail.test($(this).val()) == true) {
                $(this).css("background-color","rgb(200, 255, 200)");
                $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
            } 
        } else if (($(this).val() != "") && ($(this).attr("id") == "phone")) {
            if ((regExTel.test($(this).val()) == false) && (regExTel2.test($(this).val()) == false)) {
                $(this).css("background-color","rgb(255, 200, 200)"); 
                $($(this).siblings(".userHelp")).addClass("error").text("Le champ "+$($(this).siblings("label")).html()+" n'est pas correctement rempli (par exemple : 0123456789)");
            } else if ((regExTel.test($(this).val()) == true) || (regExTel2.test($(this).val()) == true)) {
                $(this).css("background-color","rgb(200, 255, 200)");
                $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
            } 
        } else if (($(this).val() != "") && ($(this).attr("id") == "cp")) {
            if (regExPostCode.test($(this).val()) == false) {
                $(this).css("background-color","rgb(255, 200, 200)"); 
                $($(this).siblings(".userHelp")).addClass("error").text("Le champ "+$($(this).siblings("label")).html()+" n'est pas correctement rempli (par exemple : 75000)");
            } else if (regExPostCode.test($(this).val()) == true) {
                $(this).css("background-color","rgb(200, 255, 200)");
                $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
            } 
        } else if ($(this).val() != "") {
            $(this).css("background-color","rgb(200, 255, 200)");
            $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
        }
    })
    selectList.each(function(){
        if (($(this).val() != "") && ($(this).attr("id") == "ville")) {
            if (($(this).val()) == "noTown") {
                $(this).css("background-color","rgb(255, 200, 200)"); 
                $($(this).siblings(".userHelp")).addClass("error").text("Aucune ville n'est sélectionnée");
            } else if (($(this).val()) != "noTown") {
                $(this).removeAttr("style");
                $($(this).siblings(".userHelp")).removeClass("error").text("*requis");
            }
        }
    });
}

// ============= CONTROLE DE SAISIE : ACTIVATION DU LIEN VERS MODAL SI PAS D'ERREURS =============
function validateForm() {
    var errorsCounter = 0;
    inputsList.each(function(){
        if ($(this).val() == "") {
            errorsCounter++;
        } else if (($(this).val() != "") && ($(this).attr("id") == "email")) {
            if (regExEmail.test($(this).val()) == false) {
                errorsCounter++;
            };
        } else if (($(this).val() != "") && ($(this).attr("id") == "phone")) {
            if ((regExTel.test($(this).val()) == false) && (regExTel2.test($(this).val()) == false)) {
                errorsCounter++;
            };
        } else if (($(this).val() != "") && ($(this).attr("id") == "cp")) {
            if (regExPostCode.test($(this).val()) == false) {
                errorsCounter++;
            };
        };
    });
    selectList.each(function(){
        if (($(this).val() != "") && ($(this).attr("id") == "ville")) {
            if (($(this).val()) == "noTown") {
                errorsCounter++;
            }
        }
    });
    if (errorsCounter > 0) {
        $(".confirmRegister").removeAttr("data-bs-toggle", "data-bs-target");
    } else if (errorsCounter == 0) {
        $(".confirmRegister").attr({
            "data-bs-toggle":"modal",
            "data-bs-target":"#orderConfirmationPage"
        });
    };
}

// ============= FORMATAGE TELEPHONE SUR FOCUS IN ET OUT =============
$("#phone").on("focusout", function(){
    var phoneNumber = $(this).val().replace(/[^\d]/g, '');
    if (phoneNumber.length == 10) {
        phoneNumber = phoneNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
    } else if (phoneNumber.length != 10) {
        $($(this).siblings(".userHelp")).addClass("error").text("Le champ "+$($(this).siblings("label")).html()+" n'est pas correctement rempli");
        $(this).css("background-color","rgb(255, 200, 200)"); 
    }
    $(this).val(phoneNumber)
})

$("#phone").on("focusin", function(){
    var phoneNumber = $(this).val().replace(/[^\d]/g, '');
    $(this).val(phoneNumber)
})

// ============= RECHERCHE AUTOMATIQUE VILLE VIA API =============
$("#cp").on("keyup", function() {
    if ($("#cp").val().length == 5) {
        $("#ville").empty();
        $("#ville").append("<option value=\"noTown\" id=\"noTown\">Saisissez un code postal</option>");
        $("#ville").prop("disabled", "disabled");
        $.ajax({
            url:"https://apicarto.ign.fr/api/codes-postaux/communes/"+$("#cp").val(),
            dataType:"json",
            
            success:function(data){
                var resultTable = [];
                $(data).each(function(){
                    resultTable.push(this.nomCommune);
                })
                
                if (resultTable.length > 1) {
                    $("#ville").empty();
                    $("#ville").append("<option value=\"noTown\" id=\"noTown\">Sélectionnez votre ville</option>");
                    $("#ville").prop('disabled', false);
                    for (let index = 0; index < resultTable.length; index++) {
                        $("#ville").append("<option value=\""+resultTable[index]+"\">"+resultTable[index]+"</option>");
                    }
                } else if (resultTable.length == 1) {
                    $("#ville").empty();
                    $("#ville").prop('disabled', true);
                    $("#ville").append("<option value=\""+resultTable+"\">"+resultTable+"</option>");
                } 
            },
            error:function(xhr, status){
                $("#ville").empty();
                $("#ville").prop('disabled', true);
                $("#ville").append("<option value=\"noTown\" id=\"noTown\">Introuvable, réessayez</option>");
            }
        });
    } else if ($("#cp").val().length != 5) {
        $("#ville").empty();
        $("#ville").append("<option value=\"noTown\" id=\"noTown\">Saisissez un code postal</option>");
        $("#ville").prop("disabled", "disabled");
    }
})