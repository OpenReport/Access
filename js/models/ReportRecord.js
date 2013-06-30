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
 * ReportRecord: Reporting Form Records
 *
 *
 */
app.models.ReportRecord = Backbone.Model.extend({
   urlRoot: app.config.API+'record/',
   defaults:{
      id:null,
      api_key:0,
      form_id:0,
      meta:null,
      record_date: null,
      user: '',
      lon:0,
      lat:0
   }
});
