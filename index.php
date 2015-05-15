<?php

define('CACHE_TIMEOUT', strtotime('-2 hours'));
define('BASE_PATH', dirname(__FILE__));

function get_url()
{
	$url = filter_input(INPUT_GET, 'url');
	if (parse_url($url, PHP_URL_HOST) == filter_input(INPUT_SERVER, 'HTTP_HOST') || 1) {
		return $url;
	} else {
		exit;
	}
}

function download_page($url, $vars)
{
	$query = http_build_query($vars);
	return file_get_contents("{$url}?{$query}");
}

function get_cache_filepath($url)
{
	$hash = md5($url);
	return BASE_PATH . "/cache/{$hash}.tmp";
}

function set_cache_headers($last_modified)
{
	$max_age = $last_modified - CACHE_TIMEOUT;
	header('Pragma: public');
	header("Cache-Control: max-age={$max_age}, public");
	header('Expires: ' . gmdate('r', time() + $max_age));
	header('Last-modified: ' . gmdate('r', $last_modified));
}

function load_cached_likes($url)
{
	$file = get_cache_filepath($url);
	if (file_exists($file)) {
		$last_modified = filemtime($file);
		if ($last_modified > CACHE_TIMEOUT) {
			set_cache_headers($last_modified);
			return file_get_contents($file);
		}
	}
}

function save_cached_likes($url, $likes)
{
	$js = json_encode($likes);
	file_put_contents(get_cache_filepath($url), $js);
	set_cache_headers(time());
	return $js;
}

function count_likes($url)
{
	$likes = array();
	foreach (glob(BASE_PATH . '/networks/*.php') as $file) {
		include_once $file;
		$network = basename($file, '.php');
		$fn = "count_{$network}_likes";

		if (function_exists($fn)) {
			$likes[$network] = $fn($url);
		}
	}

	return $likes;
}

$url = get_url();
$js = load_cached_likes($url, false);
if (!$js) {
	$likes = count_likes($url);
	$js = save_cached_likes($url, $likes);
}

header('Content-Type: text/plain; charset=utf-8');
echo "SocialLikes.count({$js});";
