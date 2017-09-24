extends layout

block content
  h1= title
  div(class="demo")
    a(class="permalink", href=".") ← главная
    h1 Авторизация
    div(class="auth-form")
      #error
        if(error.length>0)
          div(class="error-msg")= error
      form(action="/auth" method="post")
        div
         input(type="text" name="username")
        div
         input(type="password" name="password")
        div(class="buttons")
         span Логин и пароль <strong>admin</strong>&nbsp;
         button(type="submit") Войти
    div(class="soc-auth")
      a(href="/auth/fb") Войти через Facebook
      span &nbsp;&nbsp;|&nbsp;&nbsp;
      a(href="/auth/vk") Войти через Vk.com