<?php

class DataBase
{
	private static $dbhandle;

	private function connect() {
		$db = parse_ini_file( CONFIG . DS . "application.ini" );

		DataBase::$dbhandle = mysql_connect($db['HOST'], $db['DB_USER'], $db['DB_PASS'])
		  or die("Couldn't connect to SQL Server on $db['HOST']");
		$selected = mysql_select_db($db['DB_NAME'], DataBase::$dbhandle)
		  or die("Couldn't open database $db['DB_NAME']");
	}

	private function disconnect() {
		mysql_close(DataBase::$dbhandle);
	}

	private function query($sql='',$rows=false,$organize=true) {
		$this->connect();

		$result = mysql_query( $sql );
		$numrows = @mysql_num_rows( $result );

		if ( $numrows > 0 ) {
			$collection = array();

			while ( $row = mysql_fetch_assoc($result) ) {
				$collection[] = $row;
			}
		}
		else {
			$this->disconnect();
			return false;
		}

		$this->disconnect();
    return $collection;
  }

  public function select_sql($sql, $debug=false) {
    if ( $debug ) return var_dump( $sql );
    return $this->query($sql);
  }

  public function execute_sql($sql='', $debug=false) {
    if ( $debug ) return var_dump( $sql );
  	$this->connect();
    $result = mysql_query($sql);
		$this->disconnect();
  	return $result;
  }

	public function execute_sp($sx, $params, $debug=false) {
		$this->connect();

		$keys = array_keys($params);
		$first_key = $keys[0];
		$first_value = $params[ $first_key ];

		array_shift($params);
		$params = implode(",", $params);

		$call = " CALL $sx(@$first_key,$params) ";
		if ( $debug ) return $call;

		mysql_query( " SET @$first_key = $first_value " );
		mysql_query( $call );

		$rs = mysql_query( " SELECT COALESCE(@$first_key,0) AS $first_key " );
		$result = @mysql_fetch_array($rs);

		$this->disconnect();

    return $result[$first_key];
  }
}
