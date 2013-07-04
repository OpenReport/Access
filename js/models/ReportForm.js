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
 */

/**
 * ReportForm: Reporting Form Model
 *
 *
 */
app.models.ReportForm = Backbone.Model.extend({
   urlRoot: app.config.API+'form',
   defaults:{
      id:null,
      title:'',
      description:'',
      date_created:'',
      api_key:null
   }
});

/**
 * ReportForms: Reporting Form Colection
 *
 *
 */
app.collections.ReportForms = Backbone.Collection.extend({
    model:app.models.ReportForm,
    initialize: function(options) {
        options || (options = {});

    },
    fetchForms: function(options) {
        options || (options = {});
        this.key = options.key;
        this.user_id = 0;
        this.fetch();
    },
    fetchAssigned: function(options) {
        options || (options = {});
        this.key = options.key;
        this.user_id = options.user_id;
        this.fetch();
    },
    // override fetch url for addtional uri elements
    url:function() {
        // build url
        var uri = this.key;

        if(this.user_id > 0){
         return app.config.API+'assignments/'+uri+'/'+app.config.UserId;
        }
        else{
         return app.config.API+'form/'+uri;
        }


    },
    parse:function(response){
        console.log(response);
        return response.data;
    }
});
