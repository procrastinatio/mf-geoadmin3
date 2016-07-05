goog.provide('geoadmin');


goog.require('ga_attribution');
goog.require('ga_backgroundselector');
goog.require('ga_catalogtree');
goog.require('ga_catalogtree_controller');
goog.require('ga_cesium');
goog.require('ga_collapsible_directive');
goog.require('ga_contextpopup');
goog.require('ga_contextpopup_controller');
goog.require('ga_controls3d');
goog.require('ga_draggable_directive');
goog.require('ga_draw');
goog.require('ga_draw_controller');
goog.require('ga_drawstyle_controller');
goog.require('ga_drawstylepopup_controller');
goog.require('ga_featuretree');
goog.require('ga_featuretree_controller');
goog.require('ga_feedback');
goog.require('ga_feedback_controller');
goog.require('ga_fullscreen');
goog.require('ga_geolocation');
goog.require('ga_help');
goog.require('ga_identify_service');
goog.require('ga_importkml');
goog.require('ga_importwms');
goog.require('ga_importwms_controller');
goog.require('ga_layermanager');
goog.require('ga_main_controller');
goog.require('ga_map');
goog.require('ga_measure');
goog.require('ga_modal_directive');
goog.require('ga_mouseposition');
goog.require('ga_mouseposition_controller');
goog.require('ga_offline');
goog.require('ga_placeholder_directive');
goog.require('ga_popup');
goog.require('ga_print');
goog.require('ga_print_controller');
goog.require('ga_profile');
goog.require('ga_profile_controller');
goog.require('ga_profilepopup_controller');
goog.require('ga_query');
goog.require('ga_query_controller');
goog.require('ga_rotate');
goog.require('ga_scaleline');
goog.require('ga_search');
goog.require('ga_search_controller');
goog.require('ga_seo');
goog.require('ga_seo_controller');
goog.require('ga_share');
goog.require('ga_share_controller');
goog.require('ga_shop');
goog.require('ga_stylesfromliterals_service');
goog.require('ga_swipe');
goog.require('ga_tilt3d');
goog.require('ga_timeselector');
goog.require('ga_timeselector_controller');
goog.require('ga_timestamp_control');
goog.require('ga_tooltip');
goog.require('ga_tooltip_controller');
goog.require('ga_topic');
goog.require('ga_translation');
goog.require('ga_translation_controller');
goog.require('ga_waitcursor_service');
(function() {


  var module = angular.module('geoadmin', [
    'ga_controls3d',
    'ga_attribution',
    'ga_catalogtree',
    'ga_contextpopup',
    'ga_importkml',
    'ga_importwms',
    'ga_help',
    'ga_map',
    'ga_mouseposition',
    'ga_offline',
    'ga_popup',
    'ga_share',
    'ga_scaleline',
    'ga_search',
    'ga_topic',
    'ga_timeselector',
    'ga_timestamp_control',
    'ga_backgroundselector',
    'ga_translation',
    'ga_feedback',
    'ga_layermanager',
    'ga_tooltip',
    'ga_swipe',
    'ga_featuretree',
    'ga_measure',
    'ga_profile',
    'ga_fullscreen',
    'ga_waitcursor_service',
    'ga_stylesfromliterals_service',
    'ga_seo',
    'ga_draw',
    'ga_query',
    'ga_print',
    'ga_shop',
    'ga_tilt3d',
    'ga_modal_directive',
    'ga_draggable_directive',
    'ga_placeholder_directive',
    'ga_collapsible_directive',
    'ga_slider_directive',
    'ga_geolocation',
    'ga_rotate',
    'ga_identify_service',
    'ga_importwms_controller',
    'ga_main_controller',
    'ga_catalogtree_controller',
    'ga_mouseposition_controller',
    'ga_share_controller',
    'ga_print_controller',
    'ga_profile_controller',
    'ga_profilepopup_controller',
    'ga_translation_controller',
    'ga_feedback_controller',
    'ga_contextpopup_controller',
    'ga_search_controller',
    'ga_seo_controller',
    'ga_timeselector_controller',
    'ga_tooltip_controller',
    'ga_featuretree_controller',
    'ga_draw_controller',
    'ga_drawstyle_controller',
    'ga_drawstylepopup_controller',
    'ga_query_controller'
  ]);

})();
