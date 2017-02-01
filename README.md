# electionsni
Open Data frameworks, datasets and front-end for elections in Northern Ireland

## about the project
The Elections NI Open Data project is a collaboration of people who wanted to produce datasets and visualisations of the 2016 Northern Ireland Assembly elections, led by ODI Belfast at NICVA and the NI Open Government Network.

## the data
We used a mixture of crowdsourced and 'official' data:
* We use **candidate** information from the [Democracy Club Candidate](http://www.eoni.org.uk/Elections/Polling-stations) project, which we square with [Electoral Office NI](http://www.eoni.org.uk) data once nominations are confirmed.
* Live **results** are crowdsourced from volunteers and contributors at count centres. These are input to the database so that the website updates in real-time. When final results data are published by the Electoral Office, we again check over these to ensure that they are fully accurate.

### contributing
**We're asking for Observers at count centers to help us crowdsource the results live. It's a simple as sending a photograph.**

Please, get in contact if you would like to help.
* Twitter: [@electionsni](http://twitter.com/electionsni)

### find data
To get the data, view the [Schema](https://github.com/NICVA/electionsni/blob/master/schema.md) and [browse](http://electionsni.org.s3-website-eu-west-1.amazonaws.com/data/) the directories.

These databases are made available under [CC-By-SA](https://creativecommons.org/licenses/by-sa/4.0/). You should attribute authorship to electionsni.org and the Electoral Office for Northern Ireland. You should attribute authorship to electionsni.org and state that it contains data from the Electoral Office for Northern Ireland and Democracy Club, and provide a link to the same license.

## the site
Find us at [electionsni.org](http://electionsni.org). We are visualising data and communicating it to the public at large.

The site uses a number of javascript libraries:
* [d3](https://d3js.org/)
* [leaflet](http://leafletjs.com/)
* [lodash](https://lodash.com/)

The website data is comprised of JSON files, which are generated directly from the database hosted on the site.
