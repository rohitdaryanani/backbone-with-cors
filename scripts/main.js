(function($, BB, _) {

    $('#add_contact').tooltip();

    var App = Backbone.View.extend({
        el: "#contacts",
        events: {
            'click #add_contact': 'addPerson'
        },
        initialize: function() {
            this.input_name = $('#inputs input[name=name]');
            this.input_number = $('#inputs input[name=number]');
            this.input_username = $('#inputs input[name=username]');
            this.contacts_list = $('.table tbody');
            this.listenTo(this.collection, 'add', function(model) {
                console.log(model);
                var self = this;

                if (model.get('_id')) {
                    var view = new PersonView({
                        model: model
                    });
                    this.contacts_list.append(view.render().el);
                } else {
                    this.collection.sync('create', model, {
                        success: function(s) {
                            console.log(s);

                            model.set('_id', s._id);
                            var view = new PersonView({
                                model: model
                            });
                            self.contacts_list.append(view.render().el);
                        },
                    });
                }
            });
        },
        addPerson: function(evt) {

            var person = new PersonModel({
                name: this.input_name.val(),
                number: this.input_number.val(),
                username: this.input_username.val()
            });

            this.collection.add(person);

            // var view = new PersonView({
            //     model: person
            // });
            // this.contacts_list.append(view.render().el);
        }
    });

    var PersonModel = Backbone.Model.extend({
        defaults: {
            'name': '-',
            'number': '-',
            'username': '-'
        },
        idAttribute: '_id',
        initialize: function() {

        },

        validate: function(attrs) {
            if (!attrs.name || !attrs.number || !attrs.username ) {
                alert("missing field");
                return 'A name is required';
            }
        }
    });

    var PersonCollection = Backbone.Collection.extend({
        model: PersonModel,
        url: 'http://localhost:9090/contacts',
        initialize: function() {

        }
    });

    var PersonView = Backbone.View.extend({
        tagName: 'tr',
        template: $('#contact_template').html(),
        editTemplate: $('#edit_mode_template').html(),
        events: {
            'click .edit': 'editContact',
            'click .delete': 'deleteContact',
            'click .done': 'updateContact',
            'click .cancel': 'render'
        },

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },

        editContact: function() {
            var edittingTemplate = _.template(this.editTemplate);
            this.$el.html(edittingTemplate(this.model.toJSON()));
            return this;
        },

        deleteContact: function() {
            this.model.destroy();
            console.log("done");
        },

        remove: function() {
            this.$el.remove();
        },

        render: function() {
            var compiledTemplate = _.template(this.template);
            this.$el.html(compiledTemplate(this.model.toJSON()));
            return this;
        },

        updateContact: function() {
            this.model.save({
                name: $(this.el).find('input[name=name]').val(),
                number: $(this.el).find('input[name=number]').val(),
                username: $(this.el).find('input[name=username]').val()
            });
            //this.render();
        }
    });


    var contactApp = new App({
        collection: new PersonCollection()
    });
    contactApp.collection.fetch();

})(jQuery, Backbone, _);
