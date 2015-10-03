# breizhcamp
site web du breizhcamp


Les contributions sont bienvenues :P


Pour tester chez vous :
```bash
$ npm install -g brunch bower
$ npm install
$ bower install
$ brunch w
```

Ou via Docker : 
```bash
$ docker build -t breizhcamp-www ./
$ docker run -p 3333:3333 breizhcamp-www
```

Lors du développement, pour que le conteneur prenne en compte en direct les modifications locales :
```bash
$ docker run -it --rm -p 3333:3333 -p 9485:9485 -v <local breizhcamp path>:/opt/breizhcamp  breizhcamp-www
```
