const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1'
const IMG_PATH = `https://image.tmdb.org/t/p/w1280`
const SEARCH_URL = 'http://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const form = document.getElementById('form');
const search = document.getElementById('search');
const cards = document.getElementById('cards');
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()

const getData = async(url) => {
    let response = await fetch(API_URL)
    let data = await response.json()
    let {results} = data
    console.log(results)
    return results
}

const showData = async(url) =>{
    let data = await getData(url)
    data.forEach(element => {
        const {title, vote_average, poster_path} = element
        templateCard.querySelector('img').setAttribute('src', IMG_PATH + poster_path)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}
document.addEventListener('DOMContentLoaded', showData)


let boton = document.getElementById('btnBuscar')

boton.addEventListener('click', async(e) =>{
    e.preventDefault()
    let texto = document.getElementById('search').value
    let data = await getData()
    let busqueda = data.filter(movie => movie.title.toLowerCase() == texto.toLowerCase())
    busqueda.forEach(element => {
        const {title, vote_average, poster_path} = element
        templateCard.querySelector('img').setAttribute('src', IMG_PATH + poster_path)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    
    cards.innerHTML = ''
    cards.appendChild(fragment)
})


