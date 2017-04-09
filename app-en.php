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
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
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
    <div role="tabpanel" class="tab-pane" id="vi-2">Style</div>
    <div role="tabpanel" class="tab-pane" id="vi-3">Publish</div>
  </div>

  <script src="//cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
  <script src="//cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script src="//cdn.bootcss.com/simplemde/1.11.2/simplemde.min.js"></script>
  <script src="//cdn.bootcss.com/markdown-it/8.3.1/markdown-it.min.js"></script>
  <script src="js/app.js"></script>
</body>

</html>
