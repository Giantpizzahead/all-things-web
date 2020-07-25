<?php
  function error($msg) {
    header("Location: login.php?msg=$msg");
    exit;
  }

  session_start();
  
  // Only try logging in if a form was actually submitted
  if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header("Location: index.php");
    exit;
  }

  // Make sure needed fields are set
  if (!isset($_POST['username']) || empty($_POST['username'])) {
    error("empty-username");
  }
  if (!isset($_POST['password']) || empty($_POST['password'])) {
    error("empty-password");
  }

  include_once("includes/dbconn.php");

  $username = $_POST['username'];
  $password = $_POST['password'];

  $query = "SELECT * FROM users WHERE username=? AND password=?";
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $query)) {
    echo "Invalid SQL query!<br>";
    echo mysqli_stmt_error($stmt);
    exit;
  }
  mysqli_stmt_bind_param($stmt, "ss", $username, $password);
  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);
  $resultCount = mysqli_num_rows($result);
  if ($resultCount == 0) {
    // No user matched
    error("invalid-user-or-pass");
  }

  // Sucessfully logged in!
  $row = mysqli_fetch_assoc($result);
  $_SESSION['username'] = $row['username'];

  header("Location: index.php?msg={$_SESSION['username']}");
?>