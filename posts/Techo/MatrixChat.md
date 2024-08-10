---
title: Matrix注册教程
tags:
  - SystemFile
---
# Matrix注册教程（小王吧版）

特色很清楚国民党当年是怎么死的，所以，墙内自然没什么没有后门的平台。

因此，于我个人认为，过度依赖墙内平台讨论mlm是很愚蠢的（如果你真心要反的话，乐子人忽略）。

但是不是人人都会使用魔法，而且梯子这种需要维护第三方服务器的，也就是要花钱的。虽然钱少，但是麻烦。而且现在TG的注册烦的要死，所以不用TG。

我们适用matrix，下面是教程（时间仓促有不少错别字，烦请包含），我是从自己另外的文章里搬过来的，所以上下文可能有点生硬。

## 越过GFW

如果你在网上看到过什么网站，比方说google, twitter却发现上不去，那这就是GFW的功劳。（安分守己地刷抖音？有些资讯你在能正常访问的网站上是找不到的。）

事实是，如果你不想自己说的每句话都被特色的军警看着，想要稍微更自由的说话，那越过GFW是很必要的。

首先要纠正一点，如果你把GFW想象成一堵密不透风的墙，把国内围起来，那就错了。事实上，墙上**有大量的漏洞，上面还挂满了梯子**。

> GFW的实质是一个审查机器，审查每个跨境的数据包是否通过（包括所谓翻墙的流量，其实也经过了审查）。他面临如下挑战：
>
> 1. 中国和国外互相数据流量是巨大的，每秒是TB级的，GFW对于每个包差
>    不多只有0.1s时间检测是否合法。（如果深度检测过多的包，那么GFW会卡死。）
> 2. 互联网经过几十年的发展，大部分流量都是加密的。GFW在数据包能获取的明文只有数据包收发的公网IP和访问的域名（比如说：`longlivemarxleninmaoism.online`）（当然，他可以事后人工主动探测）。
> 3. 作为新兴帝国主义国家，中帝国无法与外界脱钩。因此GFW必须避免误伤正常流量。

有两个便于利用的漏洞：QUIC和域前置。（当然还有梯子，可以去看燎原月刊 https://liaoyuan.store ）

### Windows端

如果你想用Edge浏览器，那比较简单，因为Windowns10和Windows11都被捆绑了Edge。

具体来说，你需要建立一个`UZA_MSEDGE.bat`文件，写入：

```bash
@echo off
taskkill /f /t /im msedge.exe
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --host-resolver-rules="MAP bu2021.xyz 104.19.112.155:443,MAP annas-archive.se 104.19.112.155:443,MAP zh.annas-archive.se 104.19.112.155:443,MAP www.recaptcha.net 114.250.70.34:443,MAP odysee.com 104.19.112.156:443,MAP api.na-backend.odysee.com 104.19.112.156:443,MAP api.odysee.com 104.19.112.156:443,MAP z-library.rs 104.19.113.157:443,MAP zh.z-library.rs 104.19.113.157:443,MAP reader.z-library.rs 104.19.113.157:443,MAP dlz1.fcdn.sk 104.19.113.157:443,MAP cdn.croxy.network 104.19.113.157:443,MAP apkmirror.com 104.19.113.157:443,MAP www.apkmirror.com 104.19.113.157:443" -origin-to-force-quic-on=longlivemarxleninmaoism.online:443,annas-archive.se:443,zh.annas-archive.se:443,odysee.com:443,api.na-backend.odysee.com:443,api.odysee.com:443,z-library.rs:443,zh.z-library.rs:443,reader.z-library.rs:443,dlz1.fcdn.sk:443,cdn.croxy.network:443,apkmirror.com:443,www.apkmirror.com:443 --host-rules="MAP www.matrix.org 104.20.76.252,MAP matrix.org 104.20.76.252,MAP matrix-client.matrix.org 104.20.76.252,MAP www.croxy.network 143.244.204.138,MAP libgen.rs 193.218.118.42,MAP zh.singlelogin.re 176.123.7.105,MAP singlelogin.re 176.123.7.105,MAP github.com 20.205.243.166" --ignore-certificate-errors
```

如果你没有装Edge，可以到 https://cn.bing.com 搜索 `Microsoft Edge`  下载。

如果你担心适用Edge的隐私问题，我推荐Ungoogled_Chromium（https://ungoogled-software.github.io/ungoogled-chromium-binaries/ ）。彻底退出然后传入命令行参数即可。（如果你不用Edge，我不提供详细的说明，需要你自己的计算机计基础）。

### Mac或者GNU/Linux

彻底退出后使用Chromium系浏览器传入对应命令行参数即可。

### Android

Android系统要比Windows麻烦一点，需要适用ADB，我这里提供一个教程。

本教程测试于MIUI14（国内版）。

**遇到类似不安全或病毒报警，请自行判断是否继续。**

为了省流，我不打算配图片

#### 第一部分：准备文件

##### 两个安装包

（`.apk`），提供的是两个链接，不保证可以下载。

+ Termux（https://www.downkuai.com/android/140917.html ）（知道F-droid的，推荐从Fdroid下载；如果你用电脑进行ADB，则不需要）
+ KiWiBrowser（https://www.onlinedown.net/soft/10107048.htm ）（建议用链接里的版本，切记不要`安全下载`！否则后果自负）（其他基于Chromium的浏览器也可，比如Chromium, Chrome, UngoogledChromium, Bromite，我之所以推荐kiwi是因为他支持扩展，这也是我自用的浏览器之一，且是最常用的浏览器）

##### 一句命令

```bash
echo "_ --host-resolver-rules=\"MAP bu2021.xyz 104.19.112.155:443,MAP annas-archive.se 104.19.112.155:443,MAP zh.annas-archive.se 104.19.112.155:443,MAP www.recaptcha.net 114.250.70.34:443,MAP odysee.com 104.19.112.156:443,MAP api.na-backend.odysee.com 104.19.112.156:443,MAP api.odysee.com 104.19.112.156:443,MAP z-library.rs 104.19.113.157:443,MAP zh.z-library.rs 104.19.113.157:443,MAP reader.z-library.rs 104.19.113.157:443,MAP dlz1.fcdn.sk 104.19.113.157:443,MAP cdn.croxy.network 104.19.113.157:443,MAP apkmirror.com 104.19.113.157:443,MAP www.apkmirror.com 104.19.113.157:443\" -origin-to-force-quic-on=longlivemarxleninmaoism.online:443,annas-archive.se:443,zh.annas-archive.se:443,odysee.com:443,api.na-backend.odysee.com:443,api.odysee.com:443,z-library.rs:443,zh.z-library.rs:443,reader.z-library.rs:443,dlz1.fcdn.sk:443,cdn.croxy.network:443,apkmirror.com:443,www.apkmirror.com:443 --host-rules=\"MAP www.matrix.org 104.20.76.252,MAP matrix.org 104.20.76.252,MAP matrix-client.matrix.org 104.20.76.252,MAP www.croxy.network 143.244.204.138,MAP libgen.rs 193.218.118.42,MAP zh.singlelogin.re 176.123.7.105,MAP singlelogin.re 176.123.7.105,MAP github.com 20.205.243.166\" --ignore-certificate-errors" > chrome-command-line
```

#### 第二部分：开启ADB

这里提供一个MIUI下利用Termux作为终端的例子。

##### 安装Termux并作准备

进入Termux后，是一个命令行界面。

你可以考虑换清华源，见镜像站官方帮助文档（https://mirrors.tuna.tsinghua.edu.cn/help/termux/ ）

依次执行以下命令：（如果遇到提问，直接`Enter`走默认）

```bash
apt update
apt upgrade
pkg install android-tools
```

##### 连接ADB

其他系统（UI）请自行搜索或探索办法。

请务必连上WIFI（其实不重要，但是MIUI无线调试必须连wifi才能开启，所以这个网慢不慢不重要，其实这个操作根本不用连网）

1. 点开`设置`
2. 点开`我的设备`
3. 点开`全部参数于信息`
4. 快速点击`MIUI版本`五次，会看到消息框`您现在处于开发者模式！`
5. 不停点击返回回到`设置`根菜单
6. 找到`更多设置`，进入
7. 进入`开发者选项`
8. 找到`无线调试`，进入，启用
9. 与之前开启的`Termux`窗口分屏（小窗也可以，不能切后台，重要！）
10. 点开使用配对码配对设备
11. 会弹出来一个报告小窗窗，上面有`WLAN配对码`，是6个数字，记下来，比如说是`114514`；还有一个`IP地址和·端口`（显示在报告小窗上那个），记下来，比如说是`192.168.2.114:42257`
12. 进入`Termux`，打命令并`Enter`

    ```bash
    adb pair 192.168.2.224:42257 114514
    ```

    根据上一步得到数据自行修改）。然后应该会显示类似`Pair Successfully`之类的，你没看到`Error`或者`ERR`就行。
13. 回到无线调试设置，你应该会看到一个已配对设备，继续。这次我们选在主窗口上的`IP地址和端口`，记下来，比如说是`192.168.2.114:42819`。
    键入并`Enter`

    ```bash
    adb connect 192.168.2.114:42819
    ```

    应该返回`Connected Successfully`之类的，然后无线调试窗口的已配对设备会显示已连接，连接完成。`Termux`不要退出。

##### 设置command-line

上一步完成后，继续键入命令并`Enter`（比如说在`Termux`里）。

```bash
adb shell
cd /data/local/tmp
```

然后把你之前获取的那段命令键入并`Enter`，比方说

```bash
echo "_ --host-resolver-rules=\"MAP bu2021.xyz 172.64.145.17:443,MAP annas-archive.se 172.64.145.17:443\" -origin-to-force-quic-on=bu2021.xyz:443,annas-archive.se:443 --host-rules=\"MAP libgen.rs 193.218.118.42,MAP zh.singlelogin.re 176.123.7.105,MAP singlelogin.re 176.123.7.105\" --ignore-certificate-errors" > chrome-command-line
```

接下来

```bash
echo "$(<chrome-command-line)"
```

会输出类似这样的内容：

```text
_ --host-resolver-rules=" ... 后面一堆东西
```

OK，键入

```bash
exit
adb disconnect
```

关闭无线调试，关闭开发者模式，关闭Termux。

#### 第三部分：打开ChromeFlag

还记得Kiwi吗。

进入，一路瞎点。

地址栏输入

```text
chrome://flags/
```

搜索`Command`，找到`Enable command line on non-rooted devices`，设置为`Enabled`。

退出Kiwi，杀掉所有进程，**重启手机**。

#### 第四部分：确认设置成功

重新打开Kiwi。

地址栏输入

```text
chrome://version/
```

确认命令行栏有`_`打头，如果没有，再次杀掉所有进程，重启，不断重复知道出现`_`。

#### 第五部分：愉快上网

使用KiWi浏览器，键入`https://longlivemarxleninmaoism.online`

#### 附：更新指南

1. 重新连接adb（如果你没有卸载Termux，不用`pair`，直接`connect`即可）。
2. 设置command-line。
3. 退出Kiwi，杀掉所有进程，重启手机。

## 加matrix群聊

这个教程基于上面的`越过GFW章节`。

### 客户端

首先，你需要一个Matrix客户端（这些2024年都没被墙，实在不行我后续看看能不能本地布设一个自带过墙的），比方说：

+ https://app.element.io
+ https://app.cinny.in
+ https://matrix.org/ecosystem/clients/ 中所有支持web的客户端。

直接用你的浏览器进链接，加载慢可能要等一会儿。

服务器直接用默认（matrix.org不用改，大群的github号是推荐oblak，但是oblak好像现在不开放注册了，而且上海很卡，根本加载不出，所以我们域前置用matrix）。(matrix虽然用了默认不支持域前置的cloudflare，但是被域前置被matrix故意打开了，所以这是个长久可用的策略。同时，全球$30 \%$的流量走cloudflare cdn，GFW不敢贸然封IP，甚至特色香港政府官网也用了Cloudfalre）。

### 注册与登录

注册是需要梯子的，因为你要过人机验证（或者你借道github避开人机）。于是这里有了两条路。但是，首先你需要一个邮箱。这里推荐outlook或者yandex，注意别绑手机号。

+ outlook官网：https://outlook.live.com 注册参考教程（其实你会英文跟着步骤就行）：https://blog.csdn.net/Pencil2038/article/details/129128205
+ yandex官网：https://mail.yandex.com 注册参考教程：https://baijiahao.baidu.com/s?id=1761619264333047948

登录是不需要梯子的，域前置过墙。

#### 邮箱路线

推荐在Windows上搞，方便操作。

首先你需要使用一个网页代理（我默认用 https://www.croxy.network/ 因为网页代理容易被墙，而我帮你在这个网站上过了墙）。

打开之后下面很明显有个文本框（Enter a URL or a search query to access），键入 https://app.element.io/ （其他也行，但是我以这个matrix官方的为例）。接下来会跳转代理，尽可能刷一个51开头的，快。（如果不是，可以回退重新进，刷一个快的。）

如果显示`Your browser can't run Element`，找到`I understand the risk and continue`这个按钮（本来也就只有一个按钮）。

接下来点`Create Account`。

写一个合适的username（用户名），设置一个合适的Password（密码），填入你的邮箱。

接下来你需要通过人机验证，等待recaptcha加载后~~开始找自行车和红绿灯~~，走流程，记得小心不要点错。（就是因为这玩意才需要网页代理）

接下来，去你的邮箱（不要关掉上一个页面），找matrix给你发的邮件（收件箱里找不到去垃圾邮件里找），复制那个链接打开（好像也可以直接打开）。注意这一步不需要那个网页代理。

然后他应该会提示注册成功，让你你保存自己的Security Key（我忘了是哪个页面了，反正是上面两个页面之一），你会下载一个txt，务必保存好！！不要泄露！！！

接下来你就可以登录了，直接打开 https://app.element.io 客户端，然后Login，输入账号密码，他会提示你提供Security Key，照提示做即可。

务必注意保存好你的Security Key，不然你换个地方可能无法登录，且一定无法看加密消息！

#### 借道Github

首先你需要注册一个Github号，参考教程：https://www.bilibili.com/video/BV1784y1d7df/ （注意github被墙间歇性封锁，有的时候可能上不去）

然后你进 https://app.element.io 客户端，Create Account，然后找到Github图标，单击，走流程。

同样，你需要保存Security Key。

登录的时候点login，然后点github图标，然后走流程，提供Security Key。

### Verify Session

让你Verify Session，一般Verify with Security Key。

另外，如果你用网页代理注册的，推荐把网页代理的session取消注册。

### 加群

点Search，然后点Public Rooms，然后输入群地址。

这里推荐TG大群的matrix群：地址是 #jinggangshan:matrix.org （这个群可以看TG大群内容，但是发的东西TG大群看不到，但是matrix群互相可以交流）

当然你也可以自建群，建议开启端到端加密。（大群的matrix群没开）。

### 忽略片哥和挖矿哥

右键头像，有一个红色Ignore，会忽略这个号在这个群的一切信息。

### 提防晶哥

**切记，墙内墙外避免用相同用户名，相同邮箱！**。
