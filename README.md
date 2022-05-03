![](https://i.imgur.com/l4LVxgo.png)


### First Step:
- Clone this repos:
    -    Front : https://github.com/MemStone-MBA/Front-SveltKit
    -    Back : https://github.com/MemStone-MBA/Back-Strapi

### Back end configuration
Strapi server is running with a mongoDB database.

- Instal dependencies
`npm install`
- Build strapi server
`strapi build`
- Start strapi server
`strapi start`

Make sure to create admin credentials in [localhost:1337/admin](http://localhost:1337/admin)

### Front end configuration
Front end use svelte.JS framework.

- Instal dependencies
`npm install`
- Start server
`npm run dev`
- Create .env with .env.example

Access to server with [localhost:3000](http://localhost:3000)

### Log Errors configuration
Front end use log error system te prevent unknows errors

- Add .env log folder path
`\log`
- Check errors on console and folder with details
