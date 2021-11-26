This extension is in the experimental phase.

### Requirements
* Firfox (version: 94.0)
* Vedio tag that has ```cc``` button implemented in .srt format.

### Manual Installtion
* In a firefox tab print 
```about:debugging#/runtime/this-firefox ```
* click on ```Load Temporary Add-on```
* navigate to code folder and select the ```manifest.json``` file

### Description
- Open the devtool (```ctl+shift+i```) go to this extension tab in the devtool. Go to any vedio in the page and if there is an caption button (```cc```) click it then choose language caption. The text of the vedio will be listed in the devtool as an srt format and at the end unformated text.

### Notes
- This extension works good for facebook alike vedios only.
- The extension implemented to listen to requests that deliver .srt files.
so if more than on file request the last request will be seen unless you click ```List all srt file in this page``` button will list all .srt requests already made by the page.

