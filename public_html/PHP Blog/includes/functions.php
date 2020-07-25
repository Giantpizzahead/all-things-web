<?php
  function showAlertBox($title, $msg) {
    echo '
    <div class="alert-box">
      <h3>' . $title . '</h3>
      <p>' . $msg . '</p>
    </div>
    ';
  }

  function showSuccessBox($title, $msg) {
    echo '
    <div class="alert-box alert-success">
      <h3>' . $title . '</h3>
      <p>' . $msg . '</p>
    </div>
    ';
  }

  function showInfoBox($title, $msg) {
    echo '
    <div class="alert-box alert-info">
      <h3>' . $title . '</h3>
      <p>' . $msg . '</p>
    </div>
    ';
  }
?>