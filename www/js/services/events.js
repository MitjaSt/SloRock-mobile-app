

  /*****************
  * EVENTS SERVICE *
  *****************/

  ( function()
  {
    angular.module('sloRock' ).factory( 'eventsService', [ '$http', '$q', '$state', '$cacheFactory', '$cordovaDevice', '$ionicLoading', '$ionicPlatform', 'DSCacheFactory', 'mainConfig', 
    function( $http, $q, $state, $cacheFactory, $cordovaDevice, $ionicLoading, $ionicPlatform, DSCacheFactory, mainConfig )
    {
      /* SET CACHE */
      self.EventsCache = DSCacheFactory.get( 'EventsCache' );

      self.EventsCache.setOptions( 
      {
        onExpire : function( key, value )
          {
            getEvents().then( function()
            {
  				    /* When cache expires, go to events view and reload it */
            	$state.go('app.events', { cache : false } );

            }, 
            /* Error, data was not refreshed. No internet connection? */
            function()
            {
              /* Refresh existing data */
              self.EventsCache.put( key, value );
            } );
          }
      } );


      function getEvents( boolForceRefresh )
      {
        if( typeof boolForceRefresh === 'undefined' ){ boolForceRefresh = false; }

        $ionicLoading.show( { template: '<i class="icon ion-loading-b"></i>' } );
        
        var deferred = $q.defer(),
            cacheKey = 'EventsData',
            EventsData = null;

        if( boolForceRefresh !== true )
        {
          EventsData = self.EventsCache.get( cacheKey );
        }


        if( EventsData )
        {
          deferred.resolve( EventsData );

          $ionicLoading.hide();
        }
        else
        {
    			$http.get( mainConfig.SiteApiUrl + 'api/events.php?userId=' + mainConfig.UserId, { cache: false } ).success( function( objData )
    			{
    				self.EventsCache.put( cacheKey, objData );
    				deferred.resolve( objData );

    				$ionicLoading.hide();

    			} ).error( function()
    			{
    				deferred.reject();

    				$ionicLoading.hide();
          } );
        }
        
        return deferred.promise;
      }

      return {
        getEvents : getEvents
      };
    } ] );

  } )();