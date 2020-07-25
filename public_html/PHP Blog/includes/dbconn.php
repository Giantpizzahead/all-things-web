<?php
  // $dbServerName = "localhost";
  // $dbUsername = "root";
  // $dbPassword = "";
  // $dbName = "dbpizzablog";

  $url = getenv('JAWSDB_URL');
  $dbparts = parse_url($url);

  $dbServerName = $dbparts['host'];
  $dbUsername = $dbparts['user'];
  $dbPassword = $dbparts['pass'];
  $dbName = ltrim($dbparts['path'], '/');

  $conn = mysqli_connect($dbServerName, $dbUsername, $dbPassword, $dbName);

  if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
  }
?>