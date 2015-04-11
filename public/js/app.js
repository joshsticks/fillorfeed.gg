(function($){
	var Champ = Backbone.Model.extend({});

	var Champs =  Backbone.Collection.extend({
		model: Champ,
		parse: function(response) {
			return response.champions;
		},
		url: "https://na.api.pvp.net/api/lol/na/v1.2/champion?api_key=e502b879-b576-4bbc-bc52-0f1f04ce7ee1"
	});

	var allChamps = new Champs();

	var selectedChamp = null;

	allChamps.fetch({
		success: function(collection, response, options){
			var renderOnce = true;
			_.each(collection.models, function(champ){
				$.ajax({
					url: "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/"+champ.get("id")+"?champData=all&api_key=e502b879-b576-4bbc-bc52-0f1f04ce7ee1",
					success: function(response) {
						//champ.set("name", response.name);
						//champ.set("lore", response.lore);
						champ.attributes = response;
						if (renderOnce) {
							selectedChamp = champ;
							renderSelectedChamp();
							renderOnce = false;
						}
						$(".champion-list").append("<li class='champion' data-id='"+champ.get("id")+"'><a data-id='"+champ.get("id")+"' href='#champ'><img data-id='"+champ.get("id")+"' src='http://ddragon.leagueoflegends.com/cdn/5.7.2/img/champion/"+response.image.full+"'/><p>"+response.name+"</p></a></li>");
					}, 
					error: function(response) {
						console.log("error fetching individual details");
					}
				});
			});
			$(".champion-list").listview();
		},
		error: function(collection, response, options){
			console.log("error");
		}
	});

	$(document).on("click", ".champion", function(event) {
		selectedChamp = _.find(allChamps.models, function(champ){
			return $(event.target).data("id") == champ.id;
		});
	});

	$(document).on( "pagebeforeshow", "#champ", function( event ) {
		if(selectedChamp) {
			renderSelectedChamp();
		}
	});

	var renderSelectedChamp = function () {
		$(".champion-header").text(selectedChamp.get("name"));
		$(".champion-header").append("<img class='champion-img' src='http://ddragon.leagueoflegends.com/cdn/5.7.2/img/champion/"+selectedChamp.get("image").full+"'/>");
		$(".lore").html(selectedChamp.get("lore"));
	}
})(jQuery);