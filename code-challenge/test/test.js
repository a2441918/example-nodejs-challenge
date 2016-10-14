var request = require('supertest');
var express = require('express');
var router = express.Router();
var path = require('path'); 

/* GET home page. */
router.get('/', function(req, res, next) {
		res.render('index', { title: 'Express' });
		});

//This route lists the recent commits on the repository. 
router.get('/listAllCommits',  function(req, res, next) {


		var GitHub = require('github-api');

		// token auth
		var gh = new GitHub({
token: '1b41b2d7603033d7c6e4f640573937733452ac08'
});

		var repo = gh.getRepo('junaidkaps', 'node');
		console.log(repo);


		repo.listCommits()
		.then(function({data: commitsJson}) {
			//console.log(commitsJson)
			res.jsonp(commitsJson)
			});


});


//This route does the following: 
//1. Lists the last 25 commit SHAs on the node repository by author.
//2. Displays commit SHAs that end with a number and commit SHAs that do not end with a number.
//3. SHAs ending with a number are color coded. 
router.get('/authorCommits',  function(req, res, next) {

//Connect to Github via token authentication. 

		var GitHub = require('github-api');

		// token auth
		var gh = new GitHub({
token: '1b41b2d7603033d7c6e4f640573937733452ac08'
});


//Access the forked node repository. 
var repo = gh.getRepo('junaidkaps', 'node');
console.log(repo);

//1. List all commits that belong to user: trott
//2. Check to see which SHA ends with an integer and which SHA does not. 

repo.listCommits({author: 'trott'})
.then(function({data: authorCommitsJson}) {

	var re = new RegExp('([0-9]+)$');
        var numberResponse = []; 
	var nonNumberResponse = []; 
	for (var i=0; i<25; i++) {

	if(authorCommitsJson[i].sha.match(re)) {


	numberResponse.push("\n" + authorCommitsJson[i].sha) 
	}
	else { 

	nonNumberResponse.push("\n" + authorCommitsJson[i].sha);
	

	}
	
}	
//Render the results in HTML:  		
	res.render('index', {title: 'Junaid\'s Code Challenge ', nonNumberResponse: nonNumberResponse, numberResponse: numberResponse}); 

});
});

 
module.exports = router;

describe('GET /authorCommits', function() {
  it('looking for 200 response', function(done) {
    request(router)
      .get('/authorCommits')
      .expect(200);
      done(); 
  });
});

describe('Color Code Verification', function() { 
		
	var url = "http://localhost:3000/authorCommits"

	it("returns color code #E6F1F6", function(done) { 
	request(url, function(error, response, body) { 
	console.log(body);
	expect(body).to.equal("E6F1F6"); 
	done(); 
}); 
}); 
}); 
