<?php

function count_facebook_likes($page)
{
	$str = download_page('http://graph.facebook.com/fql', array(
		'q' => "SELECT total_count FROM link_stat WHERE url='{$page}'"
	));

	$obj = json_decode($str);
	if (isset($obj->data[0]->total_count)) {
		return (int) $obj->data[0]->total_count;
	} else {
		return null;
	}
}
