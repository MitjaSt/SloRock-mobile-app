
  /***************
   * CONTROLLERS *
   **************/
  angular.module('sloRock.controllers', ['ionic', 'angular-underscore'] );
  
  .controller( 'AppController', function( $scope, $log )
  {
    console.log( 'AppController ran.' );
  } )
  
  .controller( 'EventsController', function( $scope )
  {
    console.log( 'EventsController ran.' );
  } )
  
  
  .controller( 'RadioController', function( $scope )
  {
    console.log( 'RadioController ran.' );
  } )
  
  ;

