<?php
  session_start();
  if (isset($_SESSION['username'])) {
    // Log out by removing username in this session
    $_SESSION['username'] = null;
  }
  
  header("Location: index.php");
?>