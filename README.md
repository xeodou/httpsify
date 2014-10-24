httpsify
========

Simple app forwarding http content to  https


### Quick Example

https://httpsify.xeodou.me/url?redirect=www.google.com


### Usage

```
https://httpsify.xeodou.me/url/[name]?
    minify=true&
    decodeuri=true&
    replace=true&
    from=a&
    to=b&
    redirect=www.google.com
```

### Options

**name** The optional file name, if you want give a name with this url.

**minify** Minify the data, recommad to use it when url it's redirect a `javascript` `css` or `html`.

**decodeuri** Use `decodeURIComponent` to decode uri encoded data, use it when your data need decode.

**replace** It's use with *from* and *to* options, `replace` means your want to replace data `from` with `to`.

**redirect** The url that you want to covert and the url must **encoded**. It's **required**.

**base64** If your redirect an image url, It will return image data with `base64` encoded.

### Example

https://httpsify.xeodou.me/url?minify=true&decodeuri=true&replace=true&from=http:\/\/img\d.douban.com&to=https://httpsify.xeodou.me/url/?redirect=http://img5.douban.com&redirect=http://www.douban.com/service%2Fbadge%2Fxeodou%2F%3Fshow%3Dcollection%26select%3Drandom%26n%3D8%26columns%3D2%26hidelogo%3Dyes%26hideself%3Dyes%26cat%3Dmovie%7Cbook

## License

MIT
