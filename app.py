from flask import Flask, send_file, url_for
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


class Game(db.Model):
	__tablename__ = 'games'
	#Column values are name, release date, genre, developers/publisher, rating of first release
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String)
	release_date = db.Column(db.String)
	genre = db.Column(db.String)
	developers = db.Column(db.String)
	rating = db.Column(db.String)

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
	game_first_appeared = db.Column(db.String)

	def __repr__(self):
		return '<Character>'


@app.route("/")
def index():
	return send_file("templates/index.html")

@app.route("/getGameTable/",methods=["GET"])
def getGameTable():
	



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
