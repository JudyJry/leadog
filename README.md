# leadog
要測試和修改這個東東，請先下載Node.js LTS 版本 (16.13.1)，會附帶npm (8.1.2)。
---
## 步驟
### 1.打包一下程式
打開一個cmd.exe，使用cd指令來到leadog資料夾。
不想每次都這麼麻煩可以直接複製一個cmd.exe進leadog資料夾裡，這樣點開的時候路徑就會直接是leadog資料夾了。
接著使用`npm run watch`指令，你大概會看到以下幾行。
```
> leadog@1.0.0 watch
> webpack -w --mode development

asset vendor.js 2.54 MiB [emitted] (name: vendor) (id hint: vendors)
asset main.js 44.6 KiB [emitted] (name: main)
Entrypoint main 2.59 MiB = vendor.js 2.54 MiB main.js 44.6 KiB
runtime modules 3.64 KiB 8 modules
modules by path...

webpack 5.64.4 compiled successfully in 3010 ms
```
之後每更新一次程式碼，它都會自己幫你打包喔！
### 2.架個本地伺服器
再打開一個cmd.exe，來到leadog資料夾。
使用`npm start`指令，你大概會看到以下幾行。
```
> leadog@1.0.0 start
> node server.mjs

localhost:8000 is Ready.
```
當跳出`localhost:8000 is Ready.`，就表示伺服器開好了，可以在瀏覽器上打上`localhost:8000`看到你的網頁啦。
### 3.修改程式碼
修，都修。

