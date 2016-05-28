define(["jquery", "underscore", "backbone", "backbone.syphon", "text!template/theme.html"], function($, _, Backbone, Syphon, theme_tpl) {
    var ThemeView = Backbone.View.extend({
        template: _.template(theme_tpl),
        id: 'theme-view',

        initialize: function(options) {
            this.options = options;
            this.audit = options.audit;
            this.theme = options.theme;
            this.questions = options.questions;
            this.filters = options.filters;
            this.once('render:completed', _.bind(this.onRenderCompleted, this));
            this.$el.on('pagebeforeshow', _.bind(this.autoSelectFilter, this));
            this.on('change:filters', _.bind(this.update, this));
        },

        autoSelectFilter: function() {
            var filters = this.filters.response;
            $("input[type='checkbox']", this.$el).each(function() {
                if (_.contains(filters, $(this).attr('name'))) {
                    $(this).attr("checked", true).checkboxradio("refresh");
                }
            });
            $("#profile-filters", this.$el).val(this.filters.profile).attr('selected', true).siblings('options').removeAttr('selected');
            $("#profile-filters", this.$el).selectmenu('refresh');
        },

        onRenderCompleted: function() {
			this.$el.find('#filters, #filters2').on('change', _.bind(this.onClickFilter, this));

        },

        getFiltered: function() {
			var patch_response_appli = this.audit.get('patches');
            var filters = this.filters;
			var filtered_questions = _(this.questions).filter(function(item) {
				/* boucle sur tout les filtres, et récupérer toutes les réponses valides */
				var response1 = [];
				var response2 = [];

				/* recuperation des differentes reponses au questions autorisées */
				for(var value in filters.response) {
					var  n = filters.response[value].length;

					var lastChar = filters.response[value].substr(n-1, 1);
					if (lastChar == '2') {
						response2.push(filters.response[value].substr(0, n-1));
					} else {
						response1.push(filters.response[value]);
					}
				}

				var res = false;
				var passe = false;
				/* on parcours les reponses de toutes les question enregistrées en local pour retrouver celle de la question courante */
				for(var value2 in patch_response_appli) {
					if(patch_response_appli[value2].audit_question_id == item.audit_question){
						res = ($.inArray(item.response, response1) != -1 &&  $.inArray(patch_response_appli[value2].auditor_response, response2) != -1)?true:false;
						res = ($.inArray(item.response, response1) != -1 &&  $.inArray(patch_response_appli[value2].auditor_response, response2) != -1)?true:false;
						passe = true;
						break;
					}
				}

				if(passe == false && (response2.length == 4 || response2.length == 0)) {
					res = ($.inArray(item.response, response1) != -1)?true:false;
				}
				if (res == true){
					is_inside = _(item.agents).chain().pluck('id').contains(filters.profile).value();
					if (filters.profile == "all" || is_inside) {
						return item;
					}
				}
			});
            return filtered_questions;
        },

        update: function() {
            var filtered_questions = this.getFiltered();

            var template = this.template({
                audit: this.audit.toJSON(),
                questions: filtered_questions,
                theme: this.theme,
                agents: this.audit.getAgents(),
				state: this.audit.get('state_id')
            });

            var new_theme_list = $("#questionList", template).html();
            var new_footer = $('#quickStart', template).attr('href');

            $('#questionList', this.$el).html(new_theme_list).listview('refresh');
            if (new_footer) {
                $('#quickStxart', this.$el).attr('href', new_footer).html('Commencer');
            } else {
                $('#quickStart', this.$el).removeAttr('href').empty();
            }
        },

        onClickFilter: function(event) {
			var tab = [];
			$('#filters input:checked').each(function(){
				tab.push($(this).attr('name'));
			});
			if($('#filters input:checked').length == 0){
				tab.push("empty");
				tab.push("yes");
				tab.push("no");
				tab.push("unknown");
			}
			$('#filters2 input:checked').each(function(){
				tab.push($(this).attr('name'));
			});
			if($('#filters2 input:checked').length == 0){
				tab.push("empty2");
				tab.push("yes2");
				tab.push("no2");
				tab.push("unknown2");
			}

			this.filters.profile = $('#filters').find(':selected').val();

			this.filters.response = tab;

			this.trigger('change:filters', this.filters);
        },

        render: function() {
           filtered_questions = this.getFiltered();/*

			if(this.filters.response.indexOf("empty2") == -1){
				this.filters.response.push("empty2");
			}
			if(this.filters.response.indexOf("yes2") == -1){
				this.filters.response.push("yes2");
			}
			if(this.filters.response.indexOf("no2") == -1){
				this.filters.response.push("no2");
			}
			if(this.filters.response.indexOf("unknown2") == -1){
				this.filters.response.push("unknown2");
			}*/
			filtered = this.audit.filterByResponse(this.filters.response);
			filtered = filtered.filterByProfile(this.filters.profile);

			this.$el.empty();
            this.$el.append(this.template({
                audit: this.audit.toJSON(),
                theme: this.theme,
                questions: filtered_questions,
                agents: this.audit.getAgents(),
				state: this.audit.get('state_id')
            }));

			this.trigger('render:completed', this);
            return this;
        }
    });
    return ThemeView;
});