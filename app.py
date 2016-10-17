from flask import Flask, send_file, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager, Shell
import json
import urllib.request

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/swe'

db = SQLAlchemy(app)
manager = Manager(app)

myDict = dict()
api_key="d0d1072f35f6c08b0ce0d7249c1c1d94d500c913"
game1URL = "http://www.giantbomb.com/api/game/1/?api_key="+api_key+"&format=json&field_list=id,name,original_release_date,genres,developers,original_rating"
game2URL = "http://www.giantbomb.com/api/game/2/?api_key="+api_key+"&format=json&field_list=id,name,original_release_date,genres,developers,original_rating"
game3URL = "http://www.giantbomb.com/api/game/3/?api_key="+api_key+"&format=json&field_list=id,name,original_release_date,genres,developers,original_rating"
charactersURL = "http://www.giantbomb.com/api/characters/?api_key="+api_key+"&format=json"
platformsURL = "http://www.giantbomb.com/api/platforms/?api_key="+api_key+"&format=json"

gameDict = dict()
for x in range(1,4):
	with open('static/json/game'+str(x)+'.json') as data_file:
		data = json.load(data_file)['results']
		gameDict[data['id']] = data

characterDict = dict()
for x in range(1,4):
	with open('static/json/character'+str(x)+'.json') as data_file:
		data = json.load(data_file)['results']
		characterDict[data['id']] = data

platformDict = dict()
for x in range(1,4):
	with open('static/json/platform'+str(x)+'.json') as data_file:
		data = json.load(data_file)['results']
		platformDict[data['id']] = data


#Many to many relationship table between characters and games
#char_game = db.Table('char_game', db.Column('character_id', db.Integer, db.ForeignKey('Character.id'),db.column('game_id',db.Integer,db.ForeignKey('Game.id'))))

#Many to many relationship table between games and platforms
#plat_game = db.Table('plat_game', db.Column('character_id', db.Integer, db.ForeignKey('character.id'),db.column('platform_id',db.Integer,db.ForeignKey('platform.id'))))

class Game(db.Model):
	__tablename__ = 'games'
	#Column values are name, release date, genre, developers/publisher, rating of first release
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String)
	release_date = db.Column(db.String)
	genre = db.Column(db.String)
	developers = db.Column(db.String)
	rating = db.Column(db.String)
	#Page values are description, review, image, platforms, characters, aliases, site detail url
	description = db.Column(db.String)
	review = db.Column(db.String)
	#Image
	#Define relationship with platforms. Links to table. Backref creates new property of platforms that list all games
	#platforms = db.relationship('Platform', secondary = plat_game, backref = db.backref('games'))
	#characters = db.relationship('Character', secondary = char_game, backref = db.backref('games'))

	aliases = db.Column(db.String)
	site_detail_url = db.Column(db.String)
	def __repr__(self):
		return '<Game>'

class Platform(db.Model):
	__tablename__ = 'platform'
	#Column values are name, release date, company, starting price, number of sold units
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String)
	release_date = db.Column(db.String)
	company = db.Column(db.String)
	starting_price = db.Column(db.String)
	number_units_sold = db.Column(db.Integer)
	#Page values are description, online support flag, abbreviations, site_detail_url, Image
	description = db.Column(db.String)
	online_support = db.Column(db.String)
	abbreviations = db.Column(db.String)
	site_detail_url = db.Column(db.String)
	#Image


	def __repr__(self):
		return '<Platform>'

class Character(db.Model):
	__tablename__ = 'characters'
	#Column values are name, birthday, gender, deck, game first appeared in
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String)
	birthday = db.Column(db.String)
	gender = db.Column(db.String)
	deck = db.Column(db.String)
	game_first_appeared = db.relationship('Game', )
	#Page Values are Description, Image, Site_Detail_URL, aliases
	description = db.Column(db.String)
	#Image
	site_detail_url = db.Column(db.String)
	aliases = db.Column(db.String)

	def __repr__(self):
		return '<Character>'


@app.route("/")
def index():
	return send_file("templates/index.html")

@app.route("/getGameTable/",methods=["GET"])
def getGameTable():
	obj = []
	for key, value in gameDict.items():
		obj.append(value)
	return jsonify(obj)

@app.route("/getPlatformTable/",methods=["GET"])
def getPlatformTable():
	obj = []
	for key, value in platformDict.items():
		obj.append(value)
	return jsonify(obj)

@app.route("/getCharacterTable/",methods=["GET"])
def getCharacterable():
	obj = []
	for key, value in characterDict.items():
		obj.append(value)
	return jsonify(obj)
	



def shell_context():
	context = {
		'app': app,
		'db': db,
		'Game': Game,
		'Platforms':Platform,
		'Characters':Characters
	}
	return context

manager.add_command('shell', Shell(make_context=shell_context))

if __name__ == "__main__":
	manager.run()
