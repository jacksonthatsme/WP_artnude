<!DOCTYPE html>
<!-- HTML STARTS -->
<html>
<!-- HEAD STARTS -->
<head>
	<title><?php wp_title('-', true, 'right'); bloginfo( 'name' );?></title>
	<link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/images/favicon.png" />
	<?php wp_head(); ?>
</head>
<!-- HEAD ENDS -->
	<!-- BODY STARTS -->
	<body>
		<!-- HEADER START -->
		<header>
			<div class="container">
				<div class="ribbon"><img src="<?php  echo get_template_directory_uri() . '/images/ribbon.png' ?>"></div>
				<ul id="main_nav">
					<li><a href="#about">about</a></li>
					<li><a href="#submissions">submissions</a></li>
					<li><a href="#partners">partners</a></li>
					<li><a href="#events">events</a></li>
				</ul>
			</div>
		</header>