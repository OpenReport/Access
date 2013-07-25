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


var app = {
    config: {},
    views: {},
    models: {},
    collections: {},
    router: {},
    utility: {},
    pageView: null,
    data: {forms:null, reports:null},
    geo: null,
    userMedia: null,
    mediaStream: null,
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

        app.geo = {lon:0, lat:0};
        // get initial geolocation
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                app.geo = {lon:position.coords.longitude, lat:position.coords.latitude}
            });
        }

        Backbone.history.start({pushstate:false});
    }),
    formatDate:(function(date){
        return moment(date).format('LL');
    }),
    /**
     * Calculate next due date
     *
     * param: as=date (assign date)
     * param: ld=date (last occurance)
     * param: s=schedule (daily, weekly, monthly)
     * param: i=ignore weekends (daily logic)
     *
     */
    nextDueDate:(function(as, ld, s, i){
        if(ld === null){ // return assigned date if no reports are filed
            return moment(as).format('LL');
        }
        var due;
        switch(s){
            case 'daily':
                due = moment(ld).add('days', 1);
            break;
            case 'weekly':
                due = moment(ld).add('weeks', 1);
            break;
            case 'monthly':
                due = moment(ld).add('months', 1);
            break;
        }
        return due.format('LL');
    }),

    /**
     * format 'media:image'
     *
     *
     */
    formatMedia: function (src){

	media = '';
	images = src.split(',');

	for(i=0;i<images.length;i++){
		if(images[i] === '') continue;
		media = media + '<img class="thumb" src="http://api.openreport.local/media/data/'+images[i]+'" >';
	}

	return media === '' ? 'no photos':media;
}



};
