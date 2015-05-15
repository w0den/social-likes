# social-likes
Simple social likes counters, all data of which are processed by own server.

## Hot to configure?
At this moment all data are cached into temporary files and the only thing that you need is to ensure that directory `/cache/` is writeable (0777) and variable `config` in file [./js/core.js](./js/core.js) is customized to fit you properly. The only required thing to change here is `config.serverScript`, which should contains full URL path to `/social-likes/` directory (ie. `http://site.com/social-likes/`). Also, you can set `config.countOnClick` to `false` if you don't want to increment counter value when user clicks on like button.

By default when user wants to share your page, will be used full URL (ie, `http://site.com/dir/page?m=1`). If you want to hide `?m=1`, set `config.url.includeQueryString` to `false`. Also, you if want to share only home page (without pathname), set `config.url.includePathname` to `false`.

## How to show likes?
See example in [./example.php](./example.php)


## Demo?
See http://jsbin.com/wudinudizo (be aware, counter don't work here).
