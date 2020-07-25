<?php include("includes/header.php"); ?>
  <main>
    <?php
      if (isset($_GET['msg'])) {
        $cleanUsername = htmlspecialchars($_GET['msg']);
        if (isset($_GET['welcome'])) {
          showInfoBox("Registration complete!", "Welcome to The Pizza Blog, {$cleanUsername}.");
        } else {
          showSuccessBox("Success", "Welcome back, {$cleanUsername}.");
        }
      }
    ?>
    <h2 class="big-center-text">WE LOVE PIZZA</h2>
    <p class="medium-center-text">(and talking about pizza)</p>
  </main>
<?php include("includes/footer.php"); ?>