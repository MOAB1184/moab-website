var pizzaCount = 0;
var pizzasPerSecond = 0;
var pizzasMadeByOven = 0;
var pizzasMadeByKitchen = 0;
var pizzasMadeByRestaurant = 0;
var pizzasMadeByFactory = 0;
var ovenPizzasPerSecond = 0;
var kitchenPizzasPerSecond = 0;
var restaurantPizzasPerSecond = 0;
var factoryPizzasPerSecond = 0;
var pizzaInterval = setInterval(pizzaIncrement, 1000);
const pizzaClicker = document.getElementById("pizzaClicker");
function pizzaClick() {
    pizzaCount += 1;
    document.getElementById("pizzaCount").innerHTML = pizzaCount;
}
function onOvenClick() {
    if (pizzaCount > 49) {
        pizzaCount -= 50;
        ovenCount++;
        pizzasPerSecond++;
        ovenPizzasPerSecond++;
        localStorage.setItem("pizzaCount", pizzaCount);
        document.getElementById("ovenCount").innerHTML = ovenCount;
        document.getElementById("pizzaCount").innerHTML = pizzaCount;
        document.getElementById("pizzasPerSecond").innerHTML = pizzasPerSecond;
        document.getElementById("ovenPizzasPerSecond").innerHTML = ovenPizzasPerSecond;
    }
}
function onKitchenClick() {
    if (pizzaCount > 199) {
        pizzaCount -= 200;
        kitchenCount++;
        pizzasPerSecond += 4;
        kitchenPizzasPerSecond += 4;
        localStorage.setItem("pizzaCount", pizzaCount);
        document.getElementById("kitchenCount").innerHTML = kitchenCount;
        document.getElementById("pizzaCount").innerHTML = pizzaCount;
        document.getElementById("pizzasPerSecond").innerHTML = pizzasPerSecond;
        document.getElementById("kitchenPizzasPerSecond").innerHTML = kitchenPizzasPerSecond;
    }
}
function onRestaurantClick() {
    if (pizzaCount > 999) {
        pizzaCount -= 1000;
        restaurantCount++;
        pizzasPerSecond += 20;
        restaurantPizzasPerSecond += 20;
        localStorage.setItem("pizzaCount", pizzaCount);
        document.getElementById("restaurantCount").innerHTML = restaurantCount;
        document.getElementById("pizzaCount").innerHTML = pizzaCount;
        document.getElementById("pizzasPerSecond").innerHTML = pizzasPerSecond;
        document.getElementById("restaurantPizzasPerSecond").innerHTML = restaurantPizzasPerSecond;
    }
}
function onFactoryClick() {
    if (pizzaCount > 4999) {
        pizzaCount -= 5000;
        factoryCount++;
        pizzasPerSecond += 100;
        factoryPizzasPerSecond += 100;
        localStorage.setItem("pizzaCount", pizzaCount);
        document.getElementById("factoryCount").innerHTML = factoryCount;
        document.getElementById("pizzaCount").innerHTML = pizzaCount;
        document.getElementById("pizzasPerSecond").innerHTML = pizzasPerSecond;
        document.getElementById("factoryPizzasPerSecond").innerHTML = factoryPizzasPerSecond;
    }
}
function pizzaIncrement() {
    localStorage.setItem("pizzaCount", pizzaCount);
    localStorage.setItem("pizzasPerSecond", pizzasPerSecond);
    pizzaCount += pizzasPerSecond;
    pizzasMadeByOven += ovenPizzasPerSecond;
    pizzasMadeByKitchen += kitchenPizzasPerSecond;
    pizzasMadeByRestaurant += restaurantPizzasPerSecond;
    pizzasMadeByFactory += factoryPizzasPerSecond;
    document.getElementById("pizzaCount").innerHTML = pizzaCount;
    document.getElementById("pizzasPerSecond").innerHTML = pizzasPerSecond;
}
function revivalPage() {
    if (pizzaCount > 99999) {
        pizzaCount -= 100000;
        document.getElementById("pizzaCount").innerHTML = pizzaCount;
    }
}
function gameOverPage() {
    if (pizzaCount > 999999) {
        pizzaCount -= 1000000;
        document.getElementById("pizzaCount").innerHTML = pizzaCount;
    }
}

document.getElementById("ovenCost").addEventListener("click", onOvenClick);
document.getElementById("kitchenCost").addEventListener("click", onKitchenClick);
document.getElementById("restaurantCost").addEventListener("click", onRestaurantClick);
document.getElementById("factoryCost").addEventListener("click", onFactoryClick);
document.getElementById("pizzaClicker").addEventListener("click", pizzaClick);