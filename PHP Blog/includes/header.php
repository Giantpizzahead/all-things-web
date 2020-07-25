<?php
session_start();
include_once("functions.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" type="text/css" href="styles/main.css">
  <title>The Pizza Blog</title>
</head>
<body>
  <header>
    <h1 id="main-header">The Pizza Blog</h1>
    <div id="login-info">
      <?php
        if (!isset($_SESSION['username'])) {
          echo '
          <p class="login-info-text">You are not logged in.</p>
          <p class="login-info-text"><a href="login.php" class="login-info-link">Login</a></p>
          <p class="login-info-text"><a href="register.php" class="login-info-link">Register</a></p>
          ';
        } else {
          echo '
          <p class="login-info-text">Welcome, <b>' . $_SESSION['username'] . '</b></p>
          <p class="login-info-text"><a href="logout.php" class="login-info-link">Logout</a></p>
          ';
        }
      ?>
    </div>
    <nav>
      <ul id="main-nav">
        <li class="nav-item"><a href="index.php">Home</a></li>
        <li class="nav-item"><a href="blog.php">Blog</a></li>
        <li class="nav-item"><a href="about.php">About</a></li>
        <li class="nav-item"><a href="contact.php">Contact</a></li>
      </ul>
    </nav>
  </header>