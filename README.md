# README

2022-12-19 heroku shut down free tier last month so move to render.
See https://github.com/simonallfrey/dry-citadel-63535 for docs.


entrypoint is now:

https://bone-dry-citadel-render.onrender.com/sa/<usermail>/<password>

## Deployment


first build at:
https://dashboard.render.com/select-repo?type=web

Create a new web service with the following values:
  * Build Command: `yarn`
  * Start Command: `node app.js`

rebuild existing at:
https://dashboard.render.com/
