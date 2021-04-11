require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (!msg.content.startsWith(".antmap") || msg.author.bot) return;

const args = msg.content.slice(".antmap".length).trim().split(/ +/);
var genus = args.shift().toLowerCase();
console.log("Searched for genus: " + genus);


const species = args.shift().toLowerCase();
console.log("Searched for species: " + species);

const taxonInfoURL = "https://api.inaturalist.org/v1/taxa?q=" + genus + "-" + species + "&is_active=true";

var request = require('request');
request(taxonInfoURL, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    taxonId = JSON.parse(body);
    parseData(taxonId)
  }
});

var id;

function parseData(data){
  var taxonData = JSON.stringify(data);
  console.log(taxonData);
  console.log("id at: " + taxonData.indexOf("\"id\":"));
  id = taxonData.substr(taxonData.indexOf("\"id\":") + 5, 6);
  console.log("Species ID: " + id);
  const mapLink = "https://api.inaturalist.org/v1/taxon_places/" + id + "/0/0/0.png";
  displayMap(mapLink);


}

genus = genus.replace(genus.charAt(0), genus.charAt(0).toUpperCase());

function displayMap(data){
  const mapEmbed = new Discord.MessageEmbed()
	.setColor(0x00AE86)
	.setTitle(genus + " " + species)
	.setURL('https://www.inaturalist.org/taxa/' + id)
	.setImage(data)
	.setTimestamp()
	.setFooter('Created by ergonomic_grip');

msg.channel.send(mapEmbed);
}

});

client.login("");
