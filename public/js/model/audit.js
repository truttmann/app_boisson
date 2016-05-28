define(["jquery", "underscore", "backbone", "backbone.deep-model", "moment"], function($, _, Backbone, DeepModel, moment) {
    var AuditModel = Backbone.DeepModel.extend({
        _filtersQuestion: function(filters) {
            /* recuperation de toutes les reponses enregistrées en local */
            var patch_response_appli = this.get('patches');

            var filtered_questions = this.get('questions').filter(function(item) {
                /* boucle sur tout les filtres, et récupérer toutes les réponses valides */
                var response1 = [];
                var response2 = [];

                /* recuperation des differentes reponses au questions autorisées */
                for(var value in filters) {
                    var  n = filters[value].length;
                    var lastChar = filters[value].substr(n-1, 1);
                    if (lastChar == '2') {
                        response2.push(filters[value].substr(0, n-1));
                    } else {
                        response1.push(filters[value]);
                    }
                }

                var res = false;
                var passe = false;
                /* on parcours les reponses de toutes les question enregistrées en local pour retrouver celle de la question courante */
                for(var value2 in patch_response_appli) {
                    if(patch_response_appli[value2].audit_question_id == item.audit_question){
                        res = ($.inArray(item.response, response1) != -1 &&  $.inArray(patch_response_appli[value2].auditor_response, response2) != -1)?true:false;
                        passe = true;
                        break;
                    }
                }

                if(passe == false && (response2.length == 4 || response2.length == 0)) {
                    res = ($.inArray(item.response, response1) != -1)?true:false;
                }
                return res;
            });
            return filtered_questions;
        },
        
        _extractThemeId: function() {
            return _.chain(this.get('questions')).pluck('theme_id').uniq().value();
        },
        
        _filtersThemes: function() {
            var theme_ids = this._extractThemeId();
            var questions = this.get('questions');
            var filtered_themes = _.chain(this.get('themes')).map(function(theme) {
                var filtered_children = _(theme.children).map(function(child) {
                    if (_.contains(theme_ids, child.id)) {
                        child.questions = _(questions).chain().where({
                            theme_id: child.id
                        }).pluck('audit_question').value();
                        return child;
                    }
                });
                filtered_children = _(filtered_children).compact();
                if (!_.isEmpty(filtered_children)) {
                    theme.children = filtered_children;
                    return theme;
                }
            }).compact().value();
            return filtered_themes;
        },

        deepClone: function() {
            return new this.constructor(this.toJSON());
        },
        
        filterByResponse: function(filters) {
            var filtered_audit = this.deepClone();
            filtered_audit.filters = filters;
            var filtered_questions = filtered_audit._filtersQuestion(filters);
            filtered_audit.set('questions', filtered_questions);
            filtered_themes = filtered_audit._filtersThemes();
            filtered_audit.set('themes', filtered_themes);
            return filtered_audit;
        },

        filterByProfile: function(filters) {

            var filtered_audit = this.deepClone();
            if (filters == "all"){
                return filtered_audit;
            }
            var filtered_questions = filtered_audit.get('questions').filter(function(item) {
                var agent_ids = _(item.agents).pluck('id');
                return _.contains(agent_ids, filters);
            });
            filtered_audit.set('questions', filtered_questions);
            filtered_themes = filtered_audit._filtersThemes();
            filtered_audit.set('themes', filtered_themes);
            return filtered_audit;
        },
        
        getAgents: function() {
            var agents = _(this.get('questions')).chain().pluck('agents').flatten().value();
            var uagents = _(agents).uniq(function(obj){
                return obj.id
            });
            return uagents;
        },

        findTheme: function(theme){
            return _.chain(this.get('themes')).pluck('children').flatten().findWhere({ id : theme.id }).value();
        },

        findQuestionsByTheme: function(theme){
            return _.chain(this.get('questions')).where({ theme_id : theme.id }).value();
        },

        findPatchByAuditQuestionId: function(question, ref){
            return _.chain(this.get('patches')).find(function(patch, i){
                if (patch.audit_question_id == question.audit_question_id){
                    if (!_.isUndefined(ref)){
                        ref.index = i;
                    }
                    return patch;
                }
            }).value();
        },

        findQuestionByAuditQuestion: function(question, ref){
            return _.chain(this.get('questions')).find(function(src_question, i){
                if (src_question.audit_question == question.audit_question){
                    if (!_.isUndefined(ref)){
                        ref.index = i;
                    }
                    return src_question;
                }
            }).value();
        },

        findQuestionByQuestionId: function(id){
            return _.chain(this.get('questions')).find(function(src_question) {
                if (src_question.id == id){
                    return src_question;
                }
            }).value();
        },

        parse: function(response, options) {
            if (response.data) {
                response = response.data;
            }
            return response;
        },

    });
    return AuditModel;
});