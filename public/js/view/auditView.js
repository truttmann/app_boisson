define(["jquery", "underscore", "backbone", "backbone.syphon", "text!template/audit.html", "text!template/audit_only_question.html"], function($, _, Backbone, Syphon, audit_tpl, audit_only_question_tpl) {
    AuditView = Backbone.View.extend({
        showOnlyQuestion: false,
        getTemplate: function() {
            return this.showOnlyQuestion ? _.template(audit_only_question_tpl) : _.template(audit_tpl);
        },
        id: 'audit-view',
        initialize: function(options) {
            this.options = options;
            this.audit = options.audit;
            this.filters = options.filters;
            this.$el.on('pagebeforeshow', _.bind(this.autoSelectFilter, this));
            this.once('render:completed', _.bind(this.onRenderCompleted, this));
            this.on('change:filters', _.bind(this.update, this));
        },

        onRenderCompleted: function() {
            this.$el.find('#filters, #filters2').on('change', _.bind(this.onClickFilter, this));
            this.$el.find('#checkbox-view').on('change', _.bind(function() {
                this.showOnlyQuestion = !this.showOnlyQuestion;
                this.update();
            }, this));
        },

        autoSelectFilter: function() {
            var filters = this.filters.response;
            $("input[type='checkbox']", this.$el).each(function() {
                if (_.contains(filters, $(this).attr('name'))) {
                    $(this).attr("checked", true).checkboxradio("refresh");
                }
            });
            if(this.$el.attr('id')=="filters"){
                $("#profile-filters", this.$el).val(this.filters.profile).attr('selected', true).siblings('options').removeAttr('selected');
                $("#profile-filters", this.$el).selectmenu('refresh');
            }
        },

        update: function() {
            this.template = this.getTemplate();
            filtered = this.audit.filterByResponse(this.filters.response);
            filtered = filtered.filterByProfile(this.filters.profile);
            agents = filtered.getAgents();
            var template = this.template({
                audit: filtered.toJSON(),
                agents: agents,
                state: this.audit.get('state_id')
            });
            var new_theme_list = $('#audit-area', template).html();
            var new_profile_list = $('#profile-filters', template).html();
            $('#audit-area', this.$el).empty().html(new_theme_list);
            $('#profile-filters', this.$el).empty().html(new_profile_list);
            this.$el.find('[data-role="collapsible"]').collapsible()
            this.$el.find('#audit-area [data-role="listview"]').listview();

            if(this.$el.attr('id')=="filters"){
                $("#profile-filters", this.$el).val(this.filters.profile).attr('selected', true).siblings('options').removeAttr('selected');
                $("#profile-filters", this.$el).selectmenu('refresh');
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
            this.template = this.getTemplate();
            if(in_audit == false){
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
				}
				in_audit = true;
			}
            filtered = this.audit.filterByResponse(this.filters.response);
            filtered = filtered.filterByProfile(this.filters.profile);
            agents = filtered.getAgents();
            this.$el.empty();
            this.$el.append(this.template({
                audit: filtered.toJSON(),
                agents: agents,
                state: this.audit.get('state_id')
            }));
            this.trigger('render:completed', this);
            return this;
        }
    });
    return AuditView;
});
