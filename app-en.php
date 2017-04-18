<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en">
<!--<![endif]-->

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>VerseInk Editor</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">

  <link href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
  <link href="//cdn.bootcss.com/simplemde/1.11.2/simplemde.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/app.css">
  <link rel="stylesheet" href="css/vit-orange-dot.css">
  <link rel="stylesheet" href="css/vit-manuscript.css">
  <link rel="stylesheet" href="css/vit-serif.css">

  <script src="//cdn.bootcss.com/modernizr/2.8.3/modernizr.min.js"></script>
</head>

<body>
  <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://firefox.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
        <!--<a class="navbar-brand" href="#">Verse.Ink</a>-->
      </div>

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse">
        <div class="container vi-tabs-wrapper">
          <a class="navbar-brand" href="#">Verse.Ink</a>
          <ul class="nav navbar-nav vi-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#vi-1" aria-controls="vi-write" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-pencil"></span> Write</a></li>
            <li role="presentation"><a href="#vi-2" aria-controls="vi-style" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-tint"></span> Style</a></li>
            <li role="presentation"><a href="#vi-3" aria-controls="vi-publish" role="tab" data-toggle="tab"><span class="glyphicon glyphicon-send"></span> Publish</a></li>
          </ul>
        </div>

      </div>
      <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
  </nav>

  <div class="tab-content vi-main">
    <div role="tabpanel" class="tab-pane active" id="vi-1">
      <div class="row center-block vi-1-toolbar">
        <!--
        <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active"><a href="#vi-1-markdown" aria-controls="profile" role="tab" data-toggle="tab">Markdown</a></li>
        </ul>
-->
      </div>
      <div class="tab-content center-block vi-1-main">
        <textarea class="form-control" id="vi-1-textarea"></textarea>
        <!--<div role="tabpanel" class="tab-pane active" id="#vi-1-markdown"></div>-->
      </div>
    </div>
    <div role="tabpanel" class="tab-pane" id="vi-2">
      <div class="vi-2-wrapper">
        <div class="vi-2-preview center-block">
          <div></div>
        </div>
        <div class="vi-2-themes">
          <div class="vi-sidebar-title">Featured</div>
          <div class="vi-2-theme">
            <div class="vi-2-theme-controls">
              <div class="vi-2-theme-title">Orange Dot</div>
              <button class="btn btn-primary" id="vi-theme-orange-dot">Use</button></div>
          </div>
          <div class="vi-2-theme">
            <div class="vi-2-theme-controls">
              <div class="vi-2-theme-title">Manuscript</div>
              <button class="btn btn-primary" id="vi-theme-manuscript">Use</button></div>
          </div>
          <div class="vi-2-theme">
            <div class="vi-2-theme-controls">
              <div class="vi-2-theme-title">Serif</div>
              <button class="btn btn-primary" id="vi-theme-serif">Use</button></div>
          </div>
          <a href="" class="vi-2-upload"><span class="glyphicon glyphicon-plus-sign"></span> Upload</a>
        </div>
      </div>
    </div>
    <div role="tabpanel" class="tab-pane" id="vi-3">
      <div class="vi-3-wrapper">
        <div class="vi-2-preview center-block">
          <div id="vi-copy-from" contenteditable="true"></div>
        </div>
        <div class="vi-3-tools">
          <div class="vi-sidebar-title">Preflight<a class="pull-right">Add plugin</a></div>
          <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            <div class="panel panel-default">
              <div class="panel-heading" role="tab" id="headingOne">
                <h4 class="panel-title">
                  <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Basic Spelling &amp; Grammar: No issue</a>
                </h4>
              </div>
              <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                <div class="panel-body">No mistake detected.</div>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading" role="tab" id="headingTwo">
                <h4 class="panel-title">
                  <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">Browser Capibility: No issue</a>
                </h4>
              </div>
              <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                <div class="panel-body">All elements will be displayed correctly on email clients, WeChat, HTML and PDF.</div>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading" role="tab" id="headingThree">
                <h4 class="panel-title">
                  <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">Reading Time: <span class="vi-3-reading-time">3 min</span></a>
                </h4>
              </div>
              <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                <div class="panel-body">
                  <div class="input-group">
                    <div class="input-group-addon">Speed</div>
                    <input type="number" id="vi-3-reading-speed" class="form-control" value="150">
                    <div class="input-group-addon">wpm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="vi-sidebar-title">Publish</div>
          <div class="vi-3-publish"><button type="button" class="btn btn-default btn-lg btn-block vi-3-publish-email" data-clipboard-target="#vi-copy-from">Email</button>
            <button type="button" class="btn btn-default btn-lg btn-block vi-3-publish-wechat">WeChat</button></div>
        </div>
      </div>
    </div>
  </div>

  <script src="//cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
  <script src="//cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script src="//cdn.bootcss.com/simplemde/1.11.2/simplemde.min.js"></script>
  <!--  <script src="//cdn.bootcss.com/markdown-it/8.3.1/markdown-it.min.js"></script>-->
  <script src="https://cdn.jsdelivr.net/g/markdown-it@8.3.1,jquery@3.2.1,raphael@2.2.7,webfontloader@1.6.27,snap.svg@0.5.1,underscorejs@1.8.3,highlight.js@9.10.0"></script>
  <script src="  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
"></script>
  <script src="https://cdn.jsdelivr.net/clipboard.js/1.6.0/clipboard.min.js"></script>
  <script src="js/app.js"></script>
</body>

</html>
