var MarkDownEditController = JSB.defineClass('MarkDownEditController : UIViewController', {
  viewDidLoad: function() {
    var webFrame = self.view.bounds;

    self.webView = new UIWebView(webFrame);
    
    self.webView.scalesPageToFit = true;
    self.webView.autoresizingMask = (1 << 1 | 1 << 4);
    self.webView.delegate = self;
    self.webView.scrollView.delegate = self;
    self.view.addSubview(self.webView);
    
    self.tempPath = Application.sharedInstance().tempPath + NSUUID.UUID().UUIDString();
    NSFileManager.defaultManager().createDirectoryAtPathWithIntermediateDirectoriesAttributes(self.tempPath,true,{});
    
    NSFileManager.defaultManager().copyItemAtPathToPath(self.mainPath + '/editormd',self.tempPath + '/editormd');
  },
  viewWillAppear: function(animated) {
    self.loaded = false;
    self.webView.delegate = self;
    self.view.backgroundColor = Application.sharedInstance().defaultNotebookColor;
    self.webView.backgroundColor = Application.sharedInstance().defaultNotebookColor;
    self.webView.loadFileURLAllowingReadAccessToURL(NSURL.fileURLWithPath(self.tempPath + '/editormd/edit.html'),NSURL.fileURLWithPath(Application.sharedInstance().tempPath));
    //self.webView.loadRequest(NSURLRequest.requestWithURL(NSURL.fileURLWithPath(self.mainPath + '/editormd/edit.html')));
  },
  viewWillDisappear: function(animated) {
    if(!self.loaded){
      self.retfunc({html:self.html,text:self.text,dirty:false});        
      return;
    }
    self.webView.evaluateJavaScript('testEditor.resize(400,400);testEditor.previewing();testEditor.getHTML();',function(html){
        self.webView.evaluateJavaScript('testEditor.getMarkdown();',function(text){
            self.webView.evaluateJavaScript("var nodes = document.getElementsByClassName('editormd-preview-container');var rect = nodes[0].getBoundingClientRect();var size = {width:rect.width,height:rect.height};size;",function(e){
              var size = JSON.parse(e);
              self.retfunc({text:text,html:html,dirty:(self.text != text),size:size});      
            });
        });
    });
    self.webView.delegate = null;
  },
  viewWillLayoutSubviews: function() {
    if(self.loaded){
    }
  },
  scrollViewDidScroll: function() {
  },
  webViewDidStartLoad: function(webView) {
  },
  webViewDidFinishLoad: function(webView) {
    self.loaded = true;
    NSTimer.scheduledTimerWithTimeInterval(0.2,false,function(timer){
      var scp = "testEditor.setMarkdown('"+self.text.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n")+"');";
      self.webView.evaluateJavaScript(scp);
    });
  },
  webViewDidFailLoadWithError: function(webView, error) {
  },
});


