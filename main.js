JSB.newAddon = function(mainPath){
  JSB.require('MarkDownEditController');
  var newAddonClass = JSB.defineClass('MarkDownEditorM : JSExtension', /*Instance members*/{
    //Window initialize
    sceneWillConnect: function() {
      self.htmlController = MarkDownEditController.new();
      self.htmlController.mainPath = mainPath;
      self.renderTemplate = NSString.stringWithContentsOfFile(mainPath + '/editormd/renderTemplate.html');
      var editorFunc = function(html,text,respath,retfunc){
        self.htmlController.html = html;
        self.htmlController.text = text;
        self.htmlController.respath = respath;
        self.htmlController.retfunc = retfunc;
        return {'viewController':self.htmlController};
      };
      var renderFunc = function(html,text,respath){
        var removedTo = NSUUID.UUID().UUIDString();
        NSFileManager.defaultManager().moveItemAtPathToPath(respath + '/css',respath + '/css' + removedTo);
        NSFileManager.defaultManager().moveItemAtPathToPath(respath + '/js',respath + '/js' + removedTo);
        NSFileManager.defaultManager().moveItemAtPathToPath(respath + '/lib',respath + '/lib' + removedTo);
        NSFileManager.defaultManager().copyItemAtPathToPath(mainPath + '/editormd/css',respath + '/css');
        NSFileManager.defaultManager().copyItemAtPathToPath(mainPath + '/editormd/js',respath + '/js');
        NSFileManager.defaultManager().copyItemAtPathToPath(mainPath + '/editormd/lib',respath + '/lib');
        NSFileManager.defaultManager().copyItemAtPathToPath(mainPath + '/editormd/editormd.min.js',respath + '/editormd.min.js');
        var sArr = self.renderTemplate.split('%@');
        return sArr[0] + text + sArr[1];
      };
      var image = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(mainPath + '/markdown.png'),2);
      Application.sharedInstance().regsiterHtmlCommentEditor({title:'MarkDown',image:image},editorFunc,renderFunc,'MarkDownEditor');
    },
    //Window disconnect
    sceneDidDisconnect: function() {
      Application.sharedInstance().unregsiterHtmlCommentEditor('MarkDownEditor');
    },
    //Window resign active
    sceneWillResignActive: function() {
    },
    //Window become active
    sceneDidBecomeActive: function() {
    },
    notebookWillOpen: function(notebookid) {
    },
    notebookWillClose: function(notebookid) {
    },
    documentDidOpen: function(docmd5) {
    },
    documentWillClose: function(docmd5) {
    },
    controllerWillLayoutSubviews: function(controller) {
    },
  }, /*Class members*/{
    addonDidConnect: function() {
    },
    addonWillDisconnect: function() {
    },
    applicationWillEnterForeground: function() {
    },
    applicationDidEnterBackground: function() {
    },
    applicationDidReceiveLocalNotification: function(notify) {
    },
  });
  return newAddonClass;
};

