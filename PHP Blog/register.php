<?php include("includes/header.php"); ?>
  <main>
    <?php
      if (isset($_GET['msg'])) {
        switch($_GET['msg']) {
          case "invalid-email":
            showAlertBox("Error", "Please enter a valid email address.");
            break;
          case "empty-username":
            showAlertBox("Error", "Please enter a username.");
            break;
          case "empty-password":
            showAlertBox("Error", "Please enter a password.");
            break;
          case "bad-confirm-pass":
            showAlertBox("Error", "Passwords do not match!");
            break;
          case "bad-username":
            showAlertBox("Error", "Bad username format! Usernames must be no longer than 64 characters, and they must contain only lowercase / uppercase letters, numbers, dashes (-), and underscores (_).");
            break;
          case "bad-password":
            showAlertBox("Error", "Bad password format! Passwords must be at least 8 characters long, and they must be no longer than 128 characters.");
            break;
          case "username-taken":
            showAlertBox("Error", "Username already taken!");
            break;
          default:
            showAlertBox("Error", $_GET['msg']);
        }
      }
    ?>
    <form class="center-form" action="submit-register.php" method="POST">
      <h1>Register</h1>
      <label for="email"><b>Email</b></label>
      <input type="text" name="email" placeholder="Enter Email">
      <label for="username"><b>Username</b></label>
      <input type="text" name="username" placeholder="Enter Username">
      <label for="password"><b>Password</b></label>
      <input type="password" name="password" placeholder="Enter Password">
      <label for="confirm-pass"><b>Confirm Password</b></label>
      <input type="password" name="confirm-pass" placeholder="Repeat Password">
      <button type="submit">Register</button>
      <label>
        <input type="checkbox" checked="checked" name="subscribe"> Spam me with constant emails!!!!!1!!11!!1!!1 (jk this checkbox is useless)
      </label>
    </form>
  </main>
<?php include("includes/footer.php"); ?>