<!DOCTYPE html>
<html>
  <head>
    <title>{{title}}</title>
    <style>
      a {
        display: block;
        margin: 10px;
        font-size: 18px;
        max-width: 200px;
      }
      .link-list {
        display: flex;
        flex-direction: column;
      }
    </style>
  </head>
  <body>
  <div class="link-list">
    {{#each files}}
    <a href="{{../dir}}/{{this}}">{{this}}</a>
    {{/each}}
    </div>
  </body>
</html>
