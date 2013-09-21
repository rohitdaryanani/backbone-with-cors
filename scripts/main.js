(function ($, BB, _) {

	$('#add_contact').tooltip();

	var App = Backbone.View.extend({
		el: "#contacts",
		events: {
			'click #add_contact': 'addPerson'
		},
		initialize: function () {
			this.input_name = $('#inputs input[name=name]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody');
			this.listenTo(this.collection, 'add', function(model) {
				console.log(model);

				if(model.get('_id')) {
					var view = new PersonView({model: model});
					this.contacts_list.append(view.render().el);
				}

				else  {
					this.collection.sync('create', model, {
						success: function(s) {
							console.log('Success');

							model.set('_id', s._id);
							var view = new PersonView({model: model});
						},
						error: function(e) {
							if (e) {
								if (e.responseJSON.err) {
									alert('Duplicate Username');
								}

								if (e.responseJSON.errors) {
									alert('Contact Number should only contain numbers');
								}
							}
						}
					});
				}
			});
		},
		addPerson: function (evt) {

			var person = new PersonModel({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});

			this.collection.add(person);
		}
	});

	var PersonModel = Backbone.Model.extend({
		defaults: {
			'name': '-',
			'number': '-',
			'username': '-'
		},
		idAttribute: '_id',
		initialize: function () {

		}
	});

	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		url: 'http://localhost:9090/contacts',
		initialize: function () {

		}
	});

	var PersonView = Backbone.View.extend({
		tagName: 'tr',
		template: $('#contact_template').html(),
		editTemplate: $('#edit_mode_template').html(),
		initialize: function() {

		},
		events: {
			'click .edit': 'editContact',
			'click .delete': 'deleteContact',
			'click .done': 'updateContact',
			'click .cancel': 'render'
		},
		editContact: function() {
			var edittingTemplate = _.template(this.editTemplate);
			this.$el.html(edittingTemplate(this.model.toJSON()));
			return this;
		},
		deleteContact: function() {
			this.model.destroy();
		},
		updateContact: function() {
			this.model.set('name', $(this.el).find('input[name=name]').val());
			this.model.set('number', $(this.el).find('input[name=number]').val());
			this.model.set('username', $(this.el).find('input[name=username]').val());
			this.model.sync('update', this.model, {
				success: function(err, result) {
					if (result === 'success') { this.render(); }
				}
			});
		},
		render: function() {
			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()));
			return this;
		}
	});

	var contactApp = new App({collection: new PersonCollection()});
	contactApp.collection.fetch();

})(jQuery, Backbone, _);