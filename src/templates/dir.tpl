<!DOCTYPE html>
<html>
  <head>
    <title>{{title}}</title>
    <style>
      a {
        display: block;
        margin: 10px;
        font-size: 18px;
      }
    </style>
  </head>
  <body>
    {{#each files}}
    <a href="{{../dir}}/{{this}}">{{this}}</a>
    {{/each}}
  </body>
</html>
