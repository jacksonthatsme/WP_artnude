<?php
// adding the stylesheets
function theme_styles() {
	
	wp_enqueue_style( 'main', get_template_directory_uri() . '/style.css' );
	
}
//adding the custom js

function theme_js(){
		
	wp_enqueue_script( 'artnude', get_template_directory_uri() . '/js/artnude.js', array('jquery'), '', true );
	
	wp_enqueue_script( 'ticketleap', get_template_directory_uri() . '/js/jquery.tl.upcomingevents.js', array('jquery'), '', true );
	
	wp_enqueue_script( 'flexslider', get_template_directory_uri() . '/js/jquery.flexslider-min.js', array('jquery'), '', true );
	
}

add_action( 'wp_enqueue_scripts', 'theme_js' );

add_action( 'wp_enqueue_scripts', 'theme_styles' );

// Enable Custom Menus
add_theme_support( 'menus' );

function emailWidget(){
$args = array(
	'name'          => __( 'Mad Mimi Widget' ),
	'id'            => 'email',
	'description'   => 'Mad Mimi Widget',
	'before_widget' => '',
	'after_widget'  => '',
	'before_title'  => '',
	'after_title'   => ''
);

register_sidebar( $args );
}

emailWidget();

function twitterWidget(){
$args = array(
	'name'          => __( 'Twitter Widget' ),
	'id'            => 'twitter_widget',
	'description'   => 'Twitter Widget',
	'before_widget' => '',
	'after_widget'  => '',
	'before_title'  => '',
	'after_title'   => ''
);

register_sidebar( $args );

}
twitterWidget();

?>