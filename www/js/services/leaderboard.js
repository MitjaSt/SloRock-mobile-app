
  /**********************
  * LEADERBOARD SERVICE *
  **********************/

	( function()
	{
		angular.module('sloRock' ).factory( 'leaderboardService', [ '$http', '$q', '$state', '$cacheFactory', '$cordovaDevice', '$ionicLoading', '$ionicPlatform', 'DSCacheFactory', 'mainConfig', 
		function( $http, $q, $state, $cacheFactory, $cordovaDevice, $ionicLoading, $ionicPlatform, DSCacheFactory, mainConfig )
		{
			/* SET CACHE */
			self.SongDataCache = DSCacheFactory.get( 'SongDataCache' );
			
			self.SongDataCache.setOptions( 
			{
				onExpire : function( key, value )
			    {
			    	getLeaderboardData().then( function()
			    	{
			    		console.log( 'Cache was refreshed via AJAX.' );
			    		
			    		/* When cache expires, go to leaderboard view and reload it */
						  $state.go( 'app.leaderboard', { cache : false } );		

			    	},

			    	/* Error, data was not refreshed. No internet connection? */
			    	function()
			    	{
			    		console.log( 'Cache was not refreshed. No internet connection?' );
              
			    		/* Refresh existing data */
			    		self.SongDataCache.put( key, value );
			    	} );
			    }
			} );
			
			function getLeaderboardData( boolForceRefresh )
			{
				if( typeof boolForceRefresh === 'undefined' ){ boolForceRefresh = false; }
				
				$ionicLoading.show( { template: '<i class="icon ion-loading-b"></i>' } );

				var deferred = $q.defer(),
					cacheKey = 'SongData',
					SongData = null;

				if( boolForceRefresh !== true )
				{
					SongData = self.SongDataCache.get( cacheKey );
				}


				if( SongData )
				{
					console.log( 'SongData cache found.' );

					deferred.resolve( SongData );

					$ionicLoading.hide();
				}
				else
				{
					// Clear cache data
					// var cache = $cacheFactory.get( '$http' );
					// cache.removeAll();

			        $http.get( mainConfig.SiteApiUrl + 'api/leaderboard.php?userId=' + mainConfig.UserId, { cache: false } ).success( function( objData )
			        {
			          // device.uuid // from cordova;
			          self.SongDataCache.put( cacheKey, objData );
    						
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
				getLeaderboard : getLeaderboardData
			};
		} ] );
		

	} )();