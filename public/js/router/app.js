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
            /*"sync/:type": "sync",
            "delete": "delete",
            "audit/:id": "audit",
            "audit/:id/theme/:lftid": "theme",
            "audit/:id/theme/:tid/question/:qid": "question",
            "checklists/:id": "checklists",
            "checklist/:id": "checklist"*/
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

        /*filters: function() {
            return {
                response: ["yes", "no", "unknown", "empty"],
                profile: "all",
            }
        },*/
        initialize: function() {
            $('.back').on('click', function(event) {
                window.history.back();
                return false;
            });
            this.firstPage = true;
            this.userLocal = userLocal;
            /*this.audits = new AuditsCollection();
            this.checklistFactory = new ChecklistFactory();
            this.filters = this.filters();
            this.audits.fetch();*/
        },
        /*_clean: function() {
            this.audits.reset();
        },*/
        logout: function() {
            this.userLocal.clear();
            this.userLocal.set(this.userLocal.defaults);
            this.userLocal.save();
            localStorage.clear();
            Backbone.history.navigate('login', true);
        },
        /*setFilters: function(filters) {
            this.filters = filters;
        },*/
        /*sync: function(type) {
            var syncView = new SyncView({
                audits: this.audits,
                mode: type
            })
            controller = new SyncController({
                view: syncView
            });
            this.checklistFactory.listenTo(this.audits, 'sync', this.checklistFactory.create);
            syncView.render();
            this.changePage(controller.view);
        },*/
        /*delete: function() {
            var deleteView = new DeleteView({
                audits: this.audits,
            })
            controller = new SyncController({
                view: deleteView
            });
            deleteView.render();
            this.changePage(controller.view);
        },*/
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
        /*audit: function(id, filters) {
            var audit = this.audits.get(id);
            var view = new AuditView({
                audit: audit,
                filters: this.filters
            });
            view.render();
            view.on("change:filters", _.bind(this.setFilters, this));
            this.changePage(view);
        },
        theme: function(audit_id, theme_id) {
            var audit = this.audits.get(audit_id);
            var theme = audit.findTheme({
                id: theme_id
            });
            var questions = audit.findQuestionsByTheme({
                id: theme_id
            });
            themeView = new ThemeView({
                audit: audit,
                theme: theme,
                questions: questions,
                filters: this.filters
            });
            themeView.render();
            themeView.on("change:filters", _.bind(this.setFilters, this));
            this.changePage(themeView);
        },*/
        /*question: function(audit_id, theme_id, question_id) {
            var audit = this.audits.get(audit_id);
            var filtered = audit.filterByResponse(this.filters.response);
            filtered = filtered.filterByProfile(this.filters.profile);
            var theme = filtered.findTheme({
                id: theme_id
            });
            var questions = filtered.findQuestionsByTheme({
                id: theme_id
            }); //
            var question = _.findWhere(questions, {
                audit_question: question_id
            });
            var view = new QuestionView({
                audit: audit,
                theme: theme,
                questions: questions,
                question: question,
                filters: this.filters
            });
            view.render();
            view.on("change:filters", _.bind(this.setFilters, this));
            this.changePage(view);
        },*/


        /*checklists   : function(checklist, params) {
            var audit = this.audits.get(params.audit);
            var question_id = params.question;
            var view = new ChecklistsView(
                {
                    audit: audit,
                    question: question_id
                }
            );

            view.render();
            this.changePage(view);
        },

        checklist: function(checklist, params) {

            var audit = this.audits.get(params.audit);
            var question_id = params.question;
            var view = new ChecklistView(
                {
                    audit: audit,
                    question: question_id,
                    num: params.num,
                    checklist: checklist
                }
            );

            view.render();
            this.changePage(view);
        },*/


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