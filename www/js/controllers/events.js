

  /***************
  /* Leaderboard */
  ( function()
  {
    
    angular.module('sloRock.controllers' ).controller( 'EventsController', [ '$scope', '$state', '$filter', 'mainConfig', 'eventsService', EventsController ] );

    function EventsController( $scope, $state, $filter, mainConfig, eventsService )
    {
      var objView = this;
      var orderBy = $filter( 'orderBy' );

      $scope.mainConfig = mainConfig;

      objView.selectEvent = function( intEventSong )
      {
        $state.go( 'app.song', { eventId : intEventSong } );
      }

      objView.refreshData = function( boolForceRefresh )
      {
        eventsService.getEvents( boolForceRefresh ).then( function( objData )
        {
          var arrayBands = new Array();

          for( intEventKey in objData )
          {
            arrayBands.length = 0;

            for( intBandKey in objData[ intEventKey ]['Bands'] )
            {
              arrayBands.push( objData[ intEventKey ]['Bands'][ intBandKey ]['Title'] );
            }

            objData[ intEventKey ]['BandsList'] = arrayBands.join( ', ' );
          }
          
          objView.eventsData = orderBy( objData, 'Timestamp' );


        } ).finally( function()
        {
          $scope.$broadcast( 'scroll.refreshComplete' );
        } );
      }

      objView.refreshData( false );
    }


  } )();
