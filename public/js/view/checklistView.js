define(["jquery", "underscore", "backbone", "backbone.syphon", "text!template/checklist.html"], function($, _, Backbone, Syphon, checklist_tpl) {

    var ChecklistView = Backbone.View.extend({

        template: _.template(checklist_tpl),

        id: 'checklist-view',

        initialize: function(options) {
            this.options = options;
            /* recuperation de la question */
            this.current_question = options.audit.findQuestionByQuestionId(options.question);

            this.patches = this.options.audit.get('patches');

            this.checklistsTotalNumber = parseInt(this.current_question.checklists[0].number);

            if(typeof this.current_question != "undefined") {

                /* nous verifions si la question possède déjà une sauvegarde de cette checklist , sinon nous le créons */
                if(typeof this.current_question.save_checklist == "undefined") {
                    this.current_question.save_checklist = [];
                }
                this.num = options.num;

                /* nous créons la liste des checklist pour la verification future */
                for (var z=1; z< this.checklistsTotalNumber+1; z++) {
                    if(typeof this.current_question.save_checklist[z] == "undefined") {
                        this.current_question.save_checklist[z] = $.extend(true, {}, this.current_question.checklists[0]);
                    }
                }

                this.options.audit.save();

                this.checklists = this.current_question.save_checklist[this.num];
                this.theme = this.current_question.theme_id;
            } else {
                this.checklists = null;
                this.theme = null;
            }

            this.audit_number = options.audit.id;
            this.question = options.question;
            /* this.comment = this.current_question.checklists[0].comment; */

            this.once('render:completed', _.bind(this.onRenderCompleted, this));

        },

        onRenderCompleted: function() {
            /*this.$el.find('textarea[name="comment"]').bind("keyup", _.bind(function() {
                this.current_question.checklists[0].comment = this.$el.find('textarea[name="comment"]').val();
                this.options.audit.save();
            }, this));*/

            this.$el.find('input[type="radio"]').bind("click", _.bind(function(event) {
                this.num = parseInt(this.num);
                if(typeof this.current_question.save_checklist[this.num] != "undefined") {
                    var check_id = $(event.target).attr('data-parent-id');
                    var check_item_id = $(event.target).attr('data-id');
                    var save = false;

                    for(var i=0; i<this.current_question.save_checklist[this.num].listssmenu.length; i++) {
                        if(check_id == this.current_question.save_checklist[this.num].listssmenu[i].id) {
                            for(var i2=0; i2<this.current_question.save_checklist[this.num].listssmenu[i].item.length; i2++) {
                                if(this.current_question.save_checklist[this.num].listssmenu[i].item[i2].id == check_item_id) {
                                    this.current_question.save_checklist[this.num].listssmenu[i].item[i2].response = $(event.target).val();
                                    save = true;
                                }
                            }
                        }
                    }
                    if(save == true) {
                        this.options.audit.save();
                    }

                    /* verification pour la modification de la reponse à la question en cas de remplissage de toutes les questions des checklists */
                    var quitte = false;
                    var non = false;
                    var i = 1;
                    while(typeof this.current_question.save_checklist[i] != "undefined") {
                        /* on sort si nous avons au moins une question (checklist) sans reponse */
                        if(quitte == true) {
                            break;
                        }

                        for(var i2=0; i2<this.current_question.save_checklist[i].listssmenu.length; i2++) {
                            /* on sort si nous avons au moins une question (checklist) sans reponse */
                            if(quitte == true) {
                                break;
                            }

                            for(var i3=0; i3<this.current_question.save_checklist[i].listssmenu[i2].item.length; i3++) {
                                /* on sort si nous avons au moins une question (checklist) sans reponse */
                                if(quitte == true) {
                                    break;
                                }
                                if(typeof this.current_question.save_checklist[i].listssmenu[i2].item[i3].response == "undefined") {
                                    quitte = true;
                                    break;
                                }else if(this.current_question.save_checklist[i].listssmenu[i2].item[i3].response == "no") {
                                    non = true;
                                }
                            }
                        }
                        i++;
                    }
                    if(quitte == false) {
                        if (this.options.audit.get("state_id") == 4) {
                            var o = 0;
                            while(typeof this.patches[o] != "undefined") {
                                if(this.patches[o].audit_question_id == this.current_question.audit_question) {
                                    if(non == false) {
                                        this.patches[o].auditor_response = "yes";
                                        this.options.audit.save();
                                    } else {
                                        this.patches[o].auditor_response = "no";
                                        this.options.audit.save();
                                    }
                                }
                                o++;
                            }
                        } else {
                            if(non == false) {
                                this.current_question.response='yes';
                                this.options.audit.save();
                            } else {
                                this.current_question.response='no';
                                this.options.audit.save();
                            }
                        }
                    }
                };
            }, this));
            /*this.$el.find('#filters, #filters2').on('change', _.bind(this.onClickFilter, this));
            this.$el.find('#checkbox-view').on('change', _.bind(function() {
                this.showOnlyQuestion = !this.showOnlyQuestion;
                this.update();
            }, this));*/
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template({
                checklists: this.checklists,
                audit_number : this.audit_number,
                audit_question_id : this.current_question.audit_question,
                question : this.question,
                theme : this.theme,
                comment: this.comment,
                num: this.num,
                nums: (parseInt(this.num) + 1),
                checklistsTotalNumber: this.checklistsTotalNumber
            }));

            this.trigger('render:completed', this);
            return this;
        }
    });
    return ChecklistView;
});