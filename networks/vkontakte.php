<?php

function count_vkontakte_likes($page)
{
	$str = download_page('http://vk.com/share.php', array(
		'act' => 'count',
		'url' => $page,
	));

	if (preg_match('#\.count\(\d+,\s*(?P<likes>\d+)\)#', $str, $m)) {
		return (int) $m['likes'];
	} else {
		return null;
	}
}
