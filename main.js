let timer;
let deleteFirstPhotoDelay;

async function start() {
    try {
        const response = await fetch("https://api.thecatapi.com/v1/breeds");
        const data = await response.json();
        createBreedList(data);
    } catch (e) {
        console.log("There was a problem fetching the breed list.");
    }
}

start();

function createBreedList(breedList) {
    document.getElementById("breed").innerHTML = `
        <select onchange="loadByBreed(this.value)">
            <option>Choose a cat breed</option>
            ${breedList.map(breed => `<option value="${breed.id}">${breed.name}</option>`).join('')}
        </select>
    `;
}

async function loadByBreed(breedId) {
    if (breedId !== "Choose a cat breed") {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedId}`);
        const data = await response.json();
        createSlideshow(data.map(image => image.url));
    }
}

function createSlideshow(images) {
    let currentPosition = 0;
    clearInterval(timer);
    clearTimeout(deleteFirstPhotoDelay);

    if (images.length > 1) {
        document.getElementById("slideshow").innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}');"></div>
            <div class="slide" style="background-image: url('${images[1]}');"></div>
        `;
        currentPosition += 2;
        if (images.length == 2) currentPosition = 0;
        timer = setInterval(nextSlide, 3000);
    } else {
        document.getElementById("slideshow").innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}');"></div>
            <div class="slide"></div>
        `;
    }

    function nextSlide() {
        document.getElementById("slideshow").insertAdjacentHTML("beforeend", `<div class="slide" style="background-image: url('${images[currentPosition]}');"></div>`);
        deleteFirstPhotoDelay = setTimeout(() => {
            document.querySelector(".slide").remove();
        }, 1000);
        
        if (currentPosition + 1 >= images.length) {
            currentPosition = 0;
        } else {
            currentPosition++;
        }
    }
}
