<?php

function count_twitter_likes($page)
{
	$str = download_page('http://urls.api.twitter.com/1/urls/count.json', array(
		'url' => $page,
	));

	$obj = json_decode($str);
	if (isset($obj->count)) {
		return (int) $obj->count;
	} else {
		return null;
	}
}
