<?php

function count_odnoklassniki_likes($page)
{
	$str = download_page('http://www.odnoklassniki.ru/dk', array(
		'st.cmd' => 'extLike',
		'uid' => 'odklcnt0',
		'ref' => $page,
	));

	if (preg_match("#'odklcnt0','(?P<likes>\d+)'#", $str, $m)) {
		return (int) $m['likes'];
	} else {
		return null;
	}
}
