/**
 * OpenReport
 *
 * Copyright 2013, The Austin Conner Group
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

/**
 * App Router
 *
 *
 *
 */
app.controller = Backbone.Router.extend({

    before: function (route, params) {
        // remove prev page
				if(app.pageView !== null){
					app.pageView.destroy();
				}
				// check if authorized
				if(app.config.APIKey === ''){
					if(route !== 'about'){
						window.location.replace('#login');
					}
					return false;
				}
				$(".loader").show();
    },
    after: function (route, params) {
				if(route === '' || route === 'menu'){
					$('#back-button').prop("disabled", true);
				}
				else{
					$('#back-button').prop("disabled", false);
				}
				$('#messages').empty();

    },
	routes: {
		"" : "login",
		"login" : "login",
		"settings" : "settings",
		"about" : "about",
		"menu" : "menu",
		"recentReports": "recentReports",
		"reportForms": "reportForms",
		"assignedForms": "assignedForms",
		"report/:reportId":"recordView",
		"form/:formId": "reportForm",
		"form/:formId/:identity":"reportForm"
	},
	login: function(){
		app.pageView = new app.views.LoginView();
	},
	home: function() {
		app.pageView = new app.views.PageView({tpl:'#homeView'});
	},
	menu: function() {
		app.pageView = new app.views.PageView({tpl:'#menuView'});
	},
	about: function() {
		app.pageView = new app.views.PageView({tpl:'#aboutView'});
	},
    settings: function() {
		app.pageView = new app.views.SettingsView();
	},
	recentReports: function() {
		//if(app.data.reports !== null) app.data.reports.reset();
		app.data.reports = new app.collections.ReportRecords({ user_email:localStorage["email"]});

		app.pageView = new app.views.ReportsView({collection: app.data.reports});

	},
	reportForms: function(){

		if(app.data.forms !== null) app.data.forms.reset();
		app.data.forms = new app.collections.ReportForms();

		app.pageView = new app.views.FormListView({view:'#reportFormsView', collection: app.data.forms});
		app.data.forms.fetchForms({'key':app.config.APIKey});
	},
	assignedForms: function(){
		if(app.data.forms !== null) app.data.forms.reset();
		app.data.forms = new app.collections.ReportForms();

		app.pageView = new app.views.FormListView({view:'#reportAssignmentsView', collection: app.data.forms});
		app.data.forms.fetchAssigned({'key':app.config.APIKey, 'user':localStorage["email"]});
	},
	recordView:function(reportId){
		$.ajax({
			url:app.config.API+'record/'+app.config.APIKey+'/'+reportId,
			dataType: "json",
			success: function(response){
				app.pageView = new app.views.RecordView({model: response.data});
			}
		});
	},
	reportForm: function(formId, identity){
		app.data.form = new app.models.ReportForm({'api_key':app.config.APIKey, 'form_id':formId });
		app.pageView = new app.views.FormView({'model':app.data.form, identity:identity	});
		app.data.form.fetch();
	}

});
