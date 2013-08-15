<?php
// Get pages query
$args = array(
	'sort_order' => 'ASC',
	'sort_column' => 'menu_order', 
	'post_type' => 'page',
	'exclude' => '',
	'post_status' => 'publish'
);

$section = new WP_Query( $args );
// Open loop
if ( $section->have_posts() ) :     
    while ($section->have_posts()) : $section->the_post() 
	    foreach {
		    	$slug = $section->post_name;
		    	?>
		    	<section id='<?php echo "$slug" ?>'>
		    	<?php get_template_part("template", "$slug");?>
		    	</section>

<?php
}
// Close loop
    endwhile;
endif;
?>
