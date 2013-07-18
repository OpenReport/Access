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
 * ReportForm: Reporting Form Model
 *
 *
 */
app.models.ReportForm = Backbone.Model.extend({
   api_key:'',
   urlRoot: app.config.API+'form',
   defaults:{
      id:null,
      title:'',
      description:'',
      date_created:'',
      api_key:null
   },
   initialize: function(options) {
      options || (options = {});
      this.api_key = options.api_key;
      if(this.api_key !== '') this.urlRoot = app.config.API+'form/'+this.api_key+'/';
   },
   //url:function(){
   //   return this.urlRoot+this.api_key+'/'+this.id;
   //},
   parse:function(response){
       return response.data;
   }
});

/**
 * ReportForms: Reporting Form Colection
 *
 *
 */
app.collections.ReportForms = Backbone.Collection.extend({
   // model:app.models.ReportForm,
    initialize: function(options) {
        options || (options = {});

    },
    fetchForms: function(options) {
        options || (options = {});
        this.key = options.key;
        this.user_id = 0;
        this.fetch(options);
    },
    fetchAssigned: function(options) {
        options || (options = {});
        this.key = options.key;
        this.user_id = options.user_id;
        this.fetch(options);
    },
    // override fetch url for addtional uri elements
    url:function() {
        // build url
        if(this.user_id > 0){
         return app.config.API+'assignments/'+this.key+'/'+this.user_id;
        }
        else{
         return app.config.API+'forms/'+this.key+'/'+app.config.UserRoles;
        }

    },
    parse:function(response){

        return response.data;
    }
});
