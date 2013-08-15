<?php get_header();?>
<?php
$args = array(
	'sort_order' => 'ASC',
	'sort_column' => 'menu_order', 
	'post_type' => 'page',
	'exclude' => '',
	'post_status' => 'publish'
);
$pages = get_pages($args);
//start loop
foreach ($pages as $page_data) {
    $content = apply_filters('the_content', $page_data->post_content);
    $title = $page_data->post_title;
    $slug = $page_data->post_name;
?>
	<section id='<?php echo "$slug" ?>'>
	<?php get_template_part("page", "$slug");?>
	</section>
<?php
}
?>

<?php get_footer();?>

