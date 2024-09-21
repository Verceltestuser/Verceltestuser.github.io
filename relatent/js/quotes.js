const quotes = [
    {
        author : "Thomas A. Edison",
        quote : "Many of life's failures are people who did not realize how close they were to success when they gave up."
    },
    {
        author : "Neil Armstrong",
        quote : "I believe every human has a finite number of heartbeats. I don't intend to waste any of mine"
    },
    {
        author : "Abraham Lincoln",
        quote : "The best way to predict your future is to create it."
    },
    {
        author : "Albert Einstein",
        quote : "If you want to live a happy life, tie it to a goal, not to people or things.",
    },
    {
        author : "Michael Jordan",
        quote : "You must expect great things of yourself before you can do them"
    },
    {
        author : "A.A. Mine, Winnie the Pooh",
        quote : "You're braver than you believe, and stronger than you seem, and smarter than you think."
    },
    {
        author : "Mother Teresa",
        quote : "Spread love everywhere you go. Let no one ever come without leaving happier."
    },
    {
        author : "R.J. Palacio, Wonder",
        quote : "When given the choice between being right or being kind choose kind."
    },
    {
        author : "Antoine de Saint-Exupéry, The Little Prince",
        quote : "It is only with the heart that one can see rightly; what is essential is invisible to the eye."
    },
    {
        author : "Victor Hugo, Les Misérables",
        quote : "It is nothing to die; it is dreadful not to live."
    },
    {
        author : "Helen Keller",
        quote : "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart."
    },
    {
        author : "Frank Herbert, Dune",
        quote : "Fear is the mind-killer."
    },
    {
        author : "George Orwell, Animal Farm",
        quote : "All animals are equal, but some animals are more equal than others."
    },
    {
        author : "Madeleine L'Engle, A Wrinkle in Time",
        quote : "Love is the only thing that matters."
    }
]

function paintQuote(quoteArr){
    const quote = document.querySelector('.qu')
    const author = document.querySelector('.au')
    quote.innerText = quoteArr.quote
    author.innerText = quoteArr.author;
}

const today = localStorage.getItem("dG9kYXlRdW90ZQ==")


if (today !== null){
    const Parsd = JSON.parse(today)
    if(Parsd.expireDate < Date.now()){
        getquote();
    }else{
        paintQuote(Parsd.answer)
    }
}else{
    getquote();
}

function getquote(){
    const todayQuote = {
        answer : quotes[Math.floor(Math.random()*quotes.length)],
        expireDate : Date.now() + 86400
    }
    localStorage.setItem("dG9kYXlRdW90ZQ==", JSON.stringify(todayQuote))
    paintQuote(todayQuote.answer)
}
