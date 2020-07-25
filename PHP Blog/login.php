<?php
  include("includes/header.php");
?>
  <main>
    <?php
      if (isset($_GET['msg'])) {
        switch($_GET['msg']) {
          case "empty-username":
            showAlertBox("Error", "Please enter a username.");
            break;
          case "empty-password":
            showAlertBox("Error", "Please enter a password.");
            break;
          case "invalid-user-or-pass":
            showAlertBox("Error", "Invalid username or password!");
            break;
          default:
            showAlertBox("Error", $_GET['msg']);
        }
      }
    ?>
    <form class="center-form" action="submit-login.php" method="POST">
      <h1>Login</h1>
      <label for="username"><b>Username</b></label>
      <input type="text" name="username" placeholder="Enter Username">
      <label for="password"><b>Password</b></label>
      <input type="password" name="password" placeholder="Enter Password">
      <button type="submit">Login</button>
      <label>
        <input type="checkbox" checked="checked" name="remember"> Remember me (or don't since this doesn't actually do anything)
      </label>
    </form>
  </main>
<?php include("includes/footer.php"); ?>