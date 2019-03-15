
  /***************
  * VOTE SERVICE *
  ***************/

	( function()
	{
		angular.module('sloRock' ).factory( 'voteService', [ 
																'$http', '$q', '$state',
																'$cacheFactory', '$cordovaDevice', '$ionicLoading', 
																'$ionicPlatform', 'DSCacheFactory', 'mainConfig', 
																'$cordovaDialogs', '$cordovaPush', '$ionicModal',
		function( $http, $q, $state, $cacheFactory, $cordovaDevice, $ionicLoading, $ionicPlatform, DSCacheFactory, mainConfig, $cordovaDialogs, $cordovaPush, $ionicModal )
		{
			/* SET CACHE */
			self.VoteDataCache = DSCacheFactory.get( 'VoteCache' );
			self.LeaderboardWeekDataCache = DSCacheFactory.get( 'LeaderboardWeekCache' );

			function getCurrentLeaderboardWeek()
			{
				var deferred = $q.defer();

				$http.get( mainConfig.SiteApiUrl + 'api/currentLeaderboardWeek', { cache: false } ).success( 
				function( intLeaderboardWeek )
        {
					self.LeaderboardWeekDataCache.put( 'CurrentLeaderboardWeek', intLeaderboardWeek );

					deferred.resolve( intLeaderboardWeek );		          	
        } ).error( function()
        {
        	deferred.reject();
        } );

        return deferred.promise;
			}

			function canVote( intSongId, boolMakeVoteRequest )
			{
				if( angular.isUndefined( boolMakeVoteRequest ) ) { boolMakeVoteRequest = false }

				VoteData = self.VoteDataCache.get( 'VoteData' );

				console.log( 'Current vote data:' );
				console.log( VoteData );
				
				var deferred = $q.defer();

				getCurrentLeaderboardWeek().then( function( intCurrentLeaderboardWeek )
		        {
		        	/* Check if vote data exists in cache */
		          	if( VoteData )
					{
						/* Loop song data, check if vote for current song within same week exists */
						for( intKey in VoteData )
						{
							if( VoteData[ intKey ]['SongId'] == intSongId && VoteData[ intKey ]['SongWeek'] == intCurrentLeaderboardWeek )
							{
								deferred.resolve( false );
								return false;
							}
						}
					}

					/* If makeVoteRequest exists, do vote */
					if( boolMakeVoteRequest )
					{
						makeVoteRequest( intSongId, intCurrentLeaderboardWeek );
					}

					deferred.resolve( true );
		        } );

				return deferred.promise;
			}

			function makeVoteRequest( intSongId, intCurrentSongWeek )
			{
				var strUrl  = mainConfig.SiteApiUrl;
					strUrl += 'api/leaderboard?songId=' + intSongId;
					strUrl += '&userId=' + mainConfig.UserId;

				$http.get( strUrl, { cache: false } );

				VoteData = self.VoteDataCache.get( 'VoteData' );

				if( !VoteData )
				{
					VoteData = new Array();
				}

				VoteData.push( 	{ 
									'SongId' 	: intSongId,
									'SongWeek'  : intCurrentSongWeek,
									'Datestamp' : new Date().getTime()
								} );

				self.VoteDataCache.put( 'VoteData', VoteData );

				console.log( 'Vote successful. Song ID: ' + intSongId );
				console.log( VoteData );

				return true;
			}

			return {
				canVote 	: canVote,
				getCurrentLeaderboardWeek : getCurrentLeaderboardWeek
			};
		} ] );

	} )();