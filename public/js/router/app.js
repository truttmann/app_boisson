define(["jquery", "underscore", "backbone", 'backbone.localStorage', "backbone.token", "backbone.queryparams", "backbone.route-filter", "model/user-local", "view/homeView", "view/loginView"], function($, _, Backbone, QueryParams, RouterFilter, LocalStorage, Token, UserLocalModel, HomeView, LoginView) {
    

    var userLocal = new UserLocalModel();
    userLocal.fetch();

    var AppRouter = Backbone.Router.extend({
        init: true,
        routes: {
            "": "home",
            "home": "home",
            "login": "login",
            "logout": "logout"
        },
        
        before: {
            '*any': 'checkAuthorization'
        },

        checkAuthorization: function(fragment, args, next) {
            var isLogged = this.userLocal.get('is_logged');
            Backbone.TokenAuth.setToken(this.userLocal.get('token'));
            if (!isLogged && fragment != "login"){
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