define(["jquery", "jquery.validate", "underscore", "backbone", "backbone.queryparams", "backbone.route-filter", 
    'backbone.localStorage', "backbone.token", "model/user-local",  "model/commande-local", 
    "view/homeView", "view/loginView", "view/creationcompteView", "view/parametreView",
    "view/commandeView", "view/MonStockView","view/MonStockCassePerteView", "view/CommanderMenuView",
    "view/commandeProduitView", "view/stockProduitView", "view/MonStockDestockView",
    "view/MonCompteView", "view/EncoursFacturationView", "view/MonEquipeView", "view/InventaireView",
    "view/HistoriqueCommandeView", "view/MonEquipeHcView", "view/MemberDetailView",
    "view/MemberAddView","view/MonStockAddView","view/MonStockAddProductCatView",
    "view/MonStockAddProductCatProdView", "model/lastcommande-local",
    "view/MonStockAddValidateView","model/message-local","model/stock-local",
    "view/MonStockCassePerteValidationView", "view/MonStockHistoriqueView",
    "view/MonStockHistoriqueDetailView"], 
function($, validate ,_, Backbone, QueryParams, RouterFilter,
    LocalStorage, Token, UserLocalModel, CommandeLocalModel,
    HomeView, LoginView, CreationCompteView, ParametreView,
    CommandeView, MonStockView,MonStockCassePerteView, CommanderMenuView,
    CommandeProduitView, StockProduitView, MonStockDestockView,
    MonCompteView, EncoursFacturationView, MonEquipeView, InventaireView,
    HistoriqueCommandeView, MonEquipeHcView, MemberDetailView,
    MemberAddView, MonStockAddView, MonStockAddProductCatView,
    MonStockAddProductCatProdView, LastcommandeLocalModel,
    MonStockAddValidateView,MessageLocalModel,StockLocalModel,
    MonStockCassePerteValidationView, MonStockHistoriqueView,
    MonStockHistoriqueDetailView) {
    
    var userLocal = new UserLocalModel();
    userLocal.fetch();
    
    var lastcommandeLocal = new LastcommandeLocalModel();
    lastcommandeLocal.fetch();
    
    var messageLocal = new MessageLocalModel();
    messageLocal.fetch();
    
    var stockLocal = new StockLocalModel();
    stockLocal.fetch();

    var AppRouter = Backbone.Router.extend({
        init: true,
        routes: {
            "": "home",
            "home": "home",
            "creationcompte": "creationcompte",
            "login": "login",
            "commanderMenu": "commanderMenu",
            "commander": "commander",
            "commanderProduit/:id": "commanderProduit",
            "historiqueCommande": "historiqueCommande",
            "monstock": "monstock",
            "monstockAdd": "monstockAdd",
            "monstockAddValidate": "monstockAddValidate",
            "monstockAddProductCat": "monstockAddProductCat",
            "monstockAddProductCatProd/:id": "monstockAddProductCatProd",
            "monstockDestock": "monstockDestock",
            "monstockCassePerte" : "monstockCassePerte",
            "monstockCassePerteValidate": "monstockCassePerteValidate",
            "monstockHistorique":"monstockHistorique",
            "monstockHistoriqueDetail/:id":"monstockHistoriqueDetail",
            "stockProduit": "stockProduit",
            "inventaire": "inventaire",
            "parametre": "parametre",
            "logout": "logout",
            "sync/:type": "sync",
            "moncompte" : "moncompte",
            "encoursFacturation" : "encoursfacturation",
            "monequipe" : "monequipe",
            "member/:id" : "memberDetail",
            "memberAdd" : "memberAdd",
            "monequipehc" : "monequipehc",
            "inventaire" : "inventaire",
        },
        
        before: {
            '*any': 'checkAuthorization'
        },

        checkAuthorization: function(fragment, args, next) {
            var isLogged = this.userLocal.get('is_logged');
            Backbone.TokenAuth.setToken(this.userLocal.get('token'));
            if (!isLogged && fragment != "login" && fragment != "creationcompte" && fragment != "monequipehc" ){
                Backbone.history.navigate('login',  {trigger: true});
            } 
            else if (isLogged && fragment == "login"){
                Backbone.history.navigate('home',  {trigger: true});
            }
            else {
                next();
            }
            return false;
        },
        initialize: function() {
            $('.back').on('click', function(event) {
                window.history.back();
                return false;
            });
            this.firstPage = true;
            this.userLocal = userLocal;
            this.lastcommandeLocal = lastcommandeLocal;
            this.messageLocal = messageLocal;
            this.stockLocal = stockLocal;
        },
        logout: function() {
            this.userLocal.clear();
            this.userLocal.set(this.userLocal.defaults);
            this.userLocal.save();
            localStorage.clear();
            Backbone.history.navigate('login', true);
        },
        login: function() {
            var loginView = new LoginView({
                user: this.userLocal
            });
            loginView.render();
            this.changePage(loginView);
        },
        home: function() {
            var view = new HomeView({
                user: this.userLocal,
                message: this.messageLocal
            });
            view.render();
            this.changePage(view);
        },
        commanderMenu: function() {
            var view = new CommanderMenuView({
                commande: new CommandeLocalModel(),
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        commander: function() {
            var view = new CommandeView({
                commande: new CommandeLocalModel(),
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        historiqueCommande: function() {
            var view = new HistoriqueCommandeView({
                commande: new CommandeLocalModel(),
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        monequipe: function() {
            var view = new MonEquipeView({
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        monequipehc: function() {
            var view = new MonEquipeHcView({
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        commanderProduit: function(id) {
            var view = new CommandeProduitView({
                commande: new CommandeLocalModel(),
                categorie_id: id,
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        monstock: function() {
            var view = new MonStockView({
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        monstockAdd: function() {
            var view = new MonStockAddView({
                user: this.userLocal,
                lastcommande: this.lastcommandeLocal,
                message: this.messageLocal
            });
            view.render();
            this.changePage(view);
        },
        monstockAddValidate : function(){
            var view = new MonStockAddValidateView({
                user: this.userLocal,
                lastcommande: this.lastcommandeLocal,
                message: this.messageLocal
            });
            view.render();
            this.changePage(view);
        },
        monstockAddProductCat: function() {
            var view = new MonStockAddProductCatView({
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        monstockAddProductCatProd:  function(id) {
            var view = new MonStockAddProductCatProdView({
                user: this.userLocal,
                idCategorie: id,
                lastcommande: this.lastcommandeLocal
            });
            view.render();
            this.changePage(view);
        },
        monstockDestock: function() {
            var view = new MonStockDestockView({
                user: this.userLocal,
                message: this.messageLocal
            });
            view.render();
            this.changePage(view);
        },
        monstockCassePerte: function() {
            var view = new MonStockCassePerteView({
                user: this.userLocal,
                message: this.messageLocal,
                stock: this.stockLocal
            });
            view.render();
            this.changePage(view);
        },
        monstockCassePerteValidate: function() {
            var view = new MonStockCassePerteValidationView({
                user: this.userLocal,
                message: this.messageLocal,
                stock: this.stockLocal
            });
            view.render();
            this.changePage(view);
        },
        monstockHistorique: function() {
            var view = new MonStockHistoriqueView({
                user: this.userLocal,
                message: this.messageLocal,
                stock: this.stockLocal
            });
            view.render();
            this.changePage(view);
        },
        monstockHistoriqueDetail: function(id) {
            var view = new MonStockHistoriqueDetailView({
                user: this.userLocal,
                message: this.messageLocal,
                stock: this.stockLocal,
                id: id
            });
            view.render();
            this.changePage(view);
        },
        stockProduit: function() {
            var view = new StockProduitView({
                commande: new CommandeLocalModel(),
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        inventaire: function() {
            var view = new InventaireView({
                commande: new CommandeLocalModel(),
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        parametre: function() {
            var view = new ParametreView({
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        encoursfacturation: function() {
            var view = new EncoursFacturationView({
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        moncompte : function() {
            var view = new MonCompteView({
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        memberDetail: function(id){
           var view = new MemberDetailView({
                user: this.userLocal,
                id: id
            });
            view.render();
            this.changePage(view); 
        },
        memberAdd: function(id){
           var view = new MemberAddView({
                user: this.userLocal,
                id: id
            });
            view.render();
            this.changePage(view); 
        },
        creationcompte: function() {
            var view = new CreationCompteView({
                user: this.userLocal
            });
            view.render();
            this.changePage(view);
        },
        changePage: function(page) {
            page.$el.attr('data-role', 'page');
            $('body').append(page.$el);
            if (this.init) {
                $(':mobile-pagecontainer').pagecontainer('change', $(page.el), {
                    transition: 'none',
                    changeHash: false,
                    reverse: true,
                    showLoadMsg: true,
                    allowSamePageTransition: true
                });
            } else {
                this.init = false;
            }
        }
    });
    return AppRouter;
});