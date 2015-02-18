<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>WebManagerPhp :: Login</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">
	<?php include_once('include-css.php'); ?>
</head>
<body>
	<?php include_once('header-browsehappy.php'); ?>
	<div class="container">
	    <div class="row">
	        <div class="col-sm-6 col-md-4 col-md-offset-4">
	            <h1 class="text-center login-title"></h1>
	            <div class="account-wall">
	                <img class="profile-img" src="img/bootstrap.png" alt="" >
	                <form class="form-signin" >
	                	<input type="text" class="form-control" placeholder="Username" required >
	                	<input type="password" class="form-control" placeholder="Password" required >
	                	<button class="btn btn-lg btn-primary btn-block" type="submit">Logar</button>
	                	<a href="#" class="pull-right need-help"> </a><span class="clearfix"></span>
	                </form>
	            </div>
	            <a href="#" class="text-center new-account"> </a>
	        </div>
	    </div>
	</div>
	<?php include_once('include-js.php'); ?>
</body>
</html>
