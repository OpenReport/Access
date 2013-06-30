/**
 * Open Report
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


var app = {
    config: {},
    views: {},
    models: {},
    collections: {},
    router: {},
    utility: {},
    pageView: null,
    data: {forms:null},
    geo: null,
    init:(function() {
        // use mastasch pattern
        _.templateSettings = {
		interpolate: /\{\{\=(.+?)\}\}/g,
		evaluate: /\{\{(.+?)\}\}/g
		};

        var router = new app.controller();
        app.router = router;

        // bind a back button
        $('#back-button').bind('click', function(e){
		//if(App.UI.prevPage.length !== 0){
			window.history.back();
	    //}
        });
        // bind a menu button
        $('#menu-button').bind('click', function(e){
            app.router.navigate('menu', true);
        });

        // bind a info button
        $('#info-button').bind('click', function(e){
            app.router.navigate('about', true);
        });


        Backbone.history.start({pushstate:false});
    })
};
