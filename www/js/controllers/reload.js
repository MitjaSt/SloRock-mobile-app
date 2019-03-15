

  /****************
  /* Reload data */
  ( function()
  {
    angular.module('sloRock.controllers' ).controller( 'ReloadDataController', [ '$state', 'mainConfig', 'leaderboardService', 'voteService', ReloadDataController ] );

    function ReloadDataController( $state, mainConfig, leaderboardService, voteService )
    {
      voteService.getCurrentLeaderboardWeek();
      
      leaderboardService.getLeaderboard( true ).then( function()
      {
        $state.go( 'app.leaderboard' );
      } );
    }
  } )();
