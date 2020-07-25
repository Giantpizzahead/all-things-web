<?php
  function error($msg) {
    header("Location: register.php?msg=$msg");
    exit;
  }

  session_start();
  
  // Only try logging in if a form was actually submitted
  if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header("Location: register.php");
    exit;
  }

  // Make sure needed fields are set
  if (!isset($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    error("invalid-email");
  }
  if (!isset($_POST['username']) || empty($_POST['username'])) {
    error("empty-username");
  }
  if (!isset($_POST['password']) || empty($_POST['password'])) {
    error("empty-password");
  }
  if (!isset($_POST['confirm-pass']) || $_POST['password'] != $_POST['confirm-pass']) {
    error("bad-confirm-pass");
  }

  $email = $_POST['email'];
  $username = $_POST['username'];
  $password = $_POST['password'];

  // Validate input

  // Username should be at most 64 characters
  // Must contain only alphanumeric characters, dashes, or underscores
  $validChars = array('-', '_');
  if (strlen($username) > 64 || !ctype_alnum(str_replace($validChars, '', $username))) {
    error("bad-username");
  }

  // Password should be at least 8 characters and at most 128 characters
  if (strlen($password) < 8 || strlen($password) > 128) {
    error("bad-password");
  }

  // Make sure no user already has this username

  include_once("includes/dbconn.php");

  $query = "SELECT * FROM users WHERE username=?";
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $query)) {
    echo "Invalid SQL query!<br>";
    echo mysqli_stmt_error($stmt);
    exit;
  }
  mysqli_stmt_bind_param($stmt, "s", $username);
  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);
  $resultCount = mysqli_num_rows($result);
  if ($resultCount != 0) {
    // Username already exists
    error("username-taken");
  }

  // Finally, register the user

  $query = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $query)) {
    echo "Invalid SQL query!<br>";
    echo mysqli_stmt_error($stmt);
    exit;
  }
  mysqli_stmt_bind_param($stmt, "sss", $email, $username, $password);
  mysqli_stmt_execute($stmt);

  // Log the user in!
  $_SESSION['username'] = $username;

  header("Location: index.php?msg={$_SESSION['username']}&welcome=true");
?>