<?php
//	require_once("Session.php");

//	if ( !Session::validate() )
//		exit;
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="AtxFrotaWeb.">
	<meta name="keywords" content="AtxFrota, AtxFrotaWeb">
	<meta name="author" content="XPert Team">

	<title>WebManagerPhp</title>

	<!-- CSS -->
 	<?php include_once('include-css.php'); ?>
</head>
<body class="bs-docs-home" >
	<?php include_once('header-browsehappy.php'); ?>
	<?php include_once('header-menu.php'); ?>
	<?php include_once('header-title.php'); ?>

  <div id="modal-processando" class="modal fade" >
    <div class="modal-dialog" style="width:11em" >
      <div class="modal-content">
        <div class="modal-body">
          <img src="img/atxfrota-load.gif" /> <span style="font-size: 10px;">Processando...</span>
        </div>
      </div>
    </div>
  </div>

	<div class="container bs-docs-container" >
		<div class="row">
			<div class="col-md-9" role="main" >
				<div class="bs-docs-section">

					<ol id="menu-hierarchy" class="breadcrumb" >
            <li><a href="#" >Home</a></li>
            <li><a href="#" >Library</a></li>
            <li class="active"><a href="#" >Form</a></li>
          </ol>

					<?php
						require_once 'main-form-example.php';
						require_once 'main-table-example.php';
					?>

				</div>
			</div>
			<div class="col-md-3">

				<?php
					include_once('body-left.php');
				?>

			</div>
		</div>
	</div>

	<!-- FOOTER -->
 	<?php include_once('footer.php'); ?>

	<!-- JS -->
	<?php include_once('include-js.php'); ?>
</body>
</html>
