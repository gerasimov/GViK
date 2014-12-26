/*




 */


_GViK( function( appData, require, Add ) {

    var config = require( 'config' ),
        event = require( 'event' ),
        core = require( 'core' );

    function SQL() {

        this.open();
    }

    SQL.prototype.open = function() {
        this.db = openDatabase(
            config.get( "SQL_DATABASE_SHORTNAME" ),
            config.get( "SQL_DATABASE_VERSION" ),
            config.get( "SQL_DATABASE_NAME" ),
            config.get( "SQL_DATABASE_SIZE" ) );
    };


    SQL.prototype.getTransaction = function( clb ) {
        this.db.transaction( clb );
    };


    SQL.prototype.query = function( sqlQuery, clb, ech ) {
        this.getTransaction( function( transaction ) {
            transaction.executeSql( sqlQuery, [], function( transaction, result ) {
                event.asyncTrigger( 'sqlTransactionResult', result.rows );

                if ( clb )
                    clb( result.rows, transaction );

                if ( ech ) {
                    var i = result.rows.length;
                    for ( ; l--; ) ech( result.rows.item( i ) );
                }

            }, function() {

                if ( err )  err();

                event.asyncTrigger( 'sqlTransactionError' );
            } );
        } );
    };



    Add( 'sql', new SQL() );
} );