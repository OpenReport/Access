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
 */

/**
 * ReportRecord: Reporting Form Record
 *
 *
 */
app.models.ReportRecord = Backbone.Model.extend({
   urlRoot: app.config.API+'record/'+app.config.APIKey,
   defaults:{
      id:null,
      api_key:app.config.APIKey,
      form_id:0,
      identity: '',
      identity_name:'',
      meta:null,
      record_date: null,
      user: '',
      lon:0,
      lat:0
   }
});



app.collections.ReportRecords = Backbone.Collection.extend({
    model:app.models.ReportRecord,
    id:0,   // record id
    user_email:'',
    recCount:0,
    initialize: function(options) {
        options || (options = {});
        this.key = options.key;
        this.user_email = options.user_email;
    },
    fetchRecords: function(options) {
        options || (options = {});
        this.pageOffset = options.pageOffset;
        this.fetch(options);
    },
    // override fetch url for addtional uri elements
    url:function() {

        var limit = app.config.PagingSize;
        // check for paging
        if('undefined' != typeof this.pageOffset){
            limit = limit+','+this.pageOffset;
        }

        return app.config.API+'reports/'+app.config.APIKey+'/'+this.user_email+'?l='+limit;
    },
    parse:function(response){
        this.recCount = response.count;
        return response.data;
    }
});
