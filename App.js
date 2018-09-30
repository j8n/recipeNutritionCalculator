(function(){

	// App main object and namespace
	var App = {};

	// increment number for id's
	App.incIdNumber = 1;

	// ingredients list
	App.ingredients = [];

	// initial ingredients in list
	App.initialIngredientsInList = 1;

	// ingredients properties blueprint
	App.ingredientProperties = {
		properties: {
			n: {},
			name: {},
			amount: {},
		},	
		nutrients: {
			energy: {},
			carbs: {},
			sugars: {},
			protein: {},
			fat: {},
			saturated: {},
			trans: {},
			sodium: {},
		},
	};


	// app buttons
	App.addIngredientButton = document.getElementById("add-ingredient-button");
	App.removeLastIngredientButton = document.getElementById("remove-last-ingredient-button");
	App.calculateButton = document.getElementById("calculate-button");


	/*******************************
		Ingredient
		params: name, amount, energy, carbs, sugars, protein, fat, saturatedFats, transFats, sodium
	*******************************/
	App.Ingredient = function(properties = {}, nutrients = {}){
		

		//var properties = properties == null ? App.ingredientProperties.properties : properties;
		//var nutrients = nutrients == null ? App.ingredientProperties.nutrients : nutrients;


		// @Properties
		this.id = App.incIdNumber;
		this.properties = {};
		this.nutrients = {};
		this.tds = {};
		this.inputFields = {};


		// set ingredient properties
		for(var prop in App.ingredientProperties.properties){
			this.properties[prop] = properties[prop] ? properties[prop] : 0;
		}


		// set ingredient nutrients
		for(var nutrient in App.ingredientProperties.nutrients){
			this.nutrients[nutrient] = nutrients[nutrient] ? nutrients[nutrient] : 0;
		}


		// push to app array
		App.ingredients.push(this);
		

		// inc app number
		App.incIdNumber++;


		// create and set ingredient's tr element
		this.tr = document.createElement("tr");
		this.tr.setAttribute("app-ingredient-id", this.id);


		/***************************************************
			create td and input fields based on properties and nutrients
		***************************************************/
		for(var prop in this.properties){
			var attributeId = this.id + "-" + prop;
			var td = document.createElement("td");
			var input = document.createElement("input");

			td.id = "td-" + attributeId;
			input.id = "input-" + attributeId;
			input.className = "form-control";

			this.tds[prop] = td;
			this.inputFields[prop] = input;

			this.tr.appendChild(td);
			td.appendChild(input);
		};

		for(var nutrient in this.nutrients){
			var attributeId = this.id + "-" + nutrient;
			var td = document.createElement("td");
			var input = document.createElement("input");

			td.id = "td-" + attributeId;
			input.id = "input-" + attributeId;
			input.className = "form-control";

			this.tds[nutrient] = td;
			this.inputFields[nutrient] = input;

			this.tr.appendChild(td);
			td.appendChild(input);
		};

		/***************************************************
			get total nutrients based on ingredient amount
		***************************************************/
		this.getTotalNutrientsByAmount = function(){
			return {
				totalEnergy: (this.nutrients.energy * this.properties.amount / 100),
				totalCarbs: (this.nutrients.carbs * this.properties.amount / 100),
				totalSugars: (this.nutrients.sugars * this.properties.amount / 100),
				totalProtein: (this.nutrients.protein * this.properties.amount / 100),
				totalFat: (this.nutrients.fat * this.properties.amount / 100),
				totalSaturatedFats: (this.nutrients.saturatedFats * this.properties.amount / 100),
				totalTransFats: (this.nutrients.transFats * this.properties.amount / 100),
				totalSodium: (this.nutrients.sodium * this.properties.amount / 100)
			}
		};

		
		/*****************************************
			get properties from input fields
		*****************************************/
		this.getPropertiesFromInputs = function(){
			for(var prop in this.properties){
				var input = this.inputFields[prop];
				var inputValue = input.value;

				if(prop == "name"){
					this.properties.name = inputValue;
				}else{
					this.properties[prop] = !isNaN(parseFloat(inputValue)) ? parseFloat(inputValue) : 0;
				}
			}

			for(var nutrient in this.nutrients){
				var input = this.inputFields[nutrient];
				var inputValue = input.value;
				this.nutrients[nutrient] = !isNaN(parseFloat(inputValue)) ? parseFloat(inputValue) : 0;
			}
		};


		/**********************************
			add to table
		**********************************/
		this.addToTable = function(){
			var listTableBody = document.getElementById('list-table-body');
			this.tds['n'].innerHTML = listTableBody.getElementsByTagName("tr").length + 1;
			listTableBody.appendChild(this.tr);
		};

		
		/**********************************
			get list index
		**********************************/
		this.getListIndex = function(){
			return App.ingredients.indexOf(this);
		};


		/**********************************
			remove
		**********************************/
		this.remove = function(){
			var listTableBody = document.getElementById('list-table-body');
			App.ingredients.splice(this.getListIndex(), 1);
			listTableBody.removeChild(this.tr);
		};


		// log ingredient
		console.log(this);
	
	};



	/**********************************
		calculate 

		(need some fixes)
	**********************************/
	App.calculate = function(){
		var totalAmount = 0;
		var totalEnergy = 0;
		var totalCarbs = 0;
		var totalSugars = 0;
		var totalProtein = 0;
		var totalFat = 0;
		var totalFatSaturated = 0;
		var totalFatTrans = 0;
		var totalSodium = 0;


		for(var i=0; i<App.ingredients.length; i++){
			var ing = App.ingredients[i];
			ing.getPropertiesFromInputs();
			var totals = ing.getTotalNutrientsByAmount();

			totalAmount += (ing.properties.amount);
			totalEnergy += totals.totalEnergy;
			totalCarbs += totals.totalCarbs;
			totalSugars += totals.totalSugars;
			totalProtein += totals.totalProtein;
			totalFat += totals.totalFat;
			totalFatSaturated += totals.totalSaturatedFats;
			totalFatTrans += totals.totalTransFats;
			totalSodium += totals.totalSodium;
		};


		if(totalAmount <= 0){
			return;
		};


		document.getElementById("total-amount").innerHTML = (totalAmount).toFixed(2);
		document.getElementById("total-energy").innerHTML = (totalEnergy).toFixed(2);
		document.getElementById("total-carbs").innerHTML = (totalCarbs).toFixed(2);
		document.getElementById("total-sugars").innerHTML = (totalSugars).toFixed(2);
		document.getElementById("total-protein").innerHTML = (totalProtein).toFixed(2);
		document.getElementById("total-fat").innerHTML = (totalFat).toFixed(2);
		document.getElementById("total-fat-saturated").innerHTML = (totalFatSaturated).toFixed(2);
		document.getElementById("total-fat-trans").innerHTML = (totalFatTrans).toFixed(2);
		document.getElementById("total-sodium").innerHTML = (totalSodium).toFixed(2);



		document.getElementById("total-energy-percent").innerHTML = (100 * totalEnergy / totalAmount).toFixed(2);
		document.getElementById("total-carbs-percent").innerHTML = (100 * totalCarbs / totalAmount).toFixed(2);
		document.getElementById("total-sugars-percent").innerHTML = (100 * totalSugars / totalAmount).toFixed(2);
		document.getElementById("total-protein-percent").innerHTML = (100 * totalProtein / totalAmount).toFixed(2);
		document.getElementById("total-fat-percent").innerHTML = (100 * totalFat / totalAmount).toFixed(2);
		document.getElementById("total-fat-saturated-percent").innerHTML = (100 * totalFatSaturated / totalAmount).toFixed(2);
		document.getElementById("total-fat-trans-percent").innerHTML = (100 * totalFatTrans / totalAmount).toFixed(2);
		document.getElementById("total-sodium-percent").innerHTML = (100 * totalSodium / totalAmount).toFixed(2);

	};
	

	/**********************************
		add ingredient to the table
	**********************************/
	App.addListIngredient = function(){
		var ingredient = new App.Ingredient();
		ingredient.addToTable();
	};


	/**********************************
		remove last ingredient from the table
	**********************************/
	App.removeLastListIngredient = function(){
		var last = App.ingredients[App.ingredients.length - 1];
		last.remove();
	};


	/**********************************
		setup
	**********************************/
	App.setup = function(){
		App.addIngredientButton.onclick = function(){
			App.addListIngredient();
		};

		App.removeLastIngredientButton.onclick = function(){
			App.removeLastListIngredient();
		};

		App.calculateButton.onclick = function(){
			App.calculate();
		};

		for(var i=0; i<App.initialIngredientsInList; i++){
			App.addListIngredient();
		};
	};
	

	/**********************************
		export to window
	**********************************/
	window.App = App;

})();
