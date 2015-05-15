<?php

function count_moimir_likes($page)
{
	$str = download_page('http://connect.mail.ru/share_count', array(
		'callback' => '1',
		'url_list' => $page,
		'func' => 'moimir',
	));

	if (preg_match('#{"shares":(?P<likes>\d+),"clicks":\d+}#', $str, $m)) {
		return (int) $m['likes'];
	} else {
		return null;
	}
}
