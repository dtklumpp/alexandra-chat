let biff = "boff";
console.log({biff});

let count = 0;
// export count;
// export default biff;
// module.exports = biff;

// FOR "FIRSTPAGE"

$('.butt').on('click', () => {
    count++;
    console.log('boo!-'+count); 
    $('.ghost').toggle();
})

$('.butt1').on('click', () => {
    count++;
    console.log('foo!-'+count);
    $('.page1').toggle();
})

$('.butt2').on('click', () => {
    count++;
    console.log('bar!-'+count);
    $('.page2').toggle();
})





// FOR INDEX PAGE

$('.button1').on('click', () => {
    $('.hideit').toggle();
})
$('.button2').on('click', () => {
    count++;
    console.log('countit!-'+count);
    $('.countit').text("countit!--"+count)
})

function showContent(){
    $('.hideit').toggle();
}

// $('.toggle-web-comps').on('click', function(){
//     $('.togglable').toggle();
// })





// MAKING NAVBAR WITH WEB COMPONENTS

class NavBar extends HTMLElement {
    // constructor(){
    //     super();
    //     // super.connectedCallback();
    // }
    connectedCallback() {
        // super();
        // super.connectedCallback();

        this.innerHTML = `
        <div class="header">
            <a href="./index.html"><button>index</button></a>
            <a href="./firstpage.html"><button>firstpage</button></a>
            <a href="./page3.html"><button>page3</button></a>
            <button>nada</button>
            <a href="./gridpage.html"><button>gridpage</button></a>
            <a href="./varspage.html"><button>css-vars</button></a>
        </div>
        `;

        // this.innerHTML = 
        // `
        //     <navbar>
        //     main nav content goes here via extension           
        //     </navbar>     
        // `;
    }
}
customElements.define('main-nav', NavBar);







//MAKING NAVBAR WITH JQUERY

const jqnav = $('#navbar-jq');
// jqnav.text('jqnav is here!');
// jqnav.css('color', 'red');
jqnav.addClass('header');
// console.log("jqnav didn't throw an error");

// jqnavs.eq(0)
// .html 
// .text
// .before()
// .after()
// .append()
// .prepend()
// .remove()
// $('img').attr('src')
// .toggleClass()

//effects
//stop event propagation
//target
//currentTarget

let links = [
    ['index', "./index.html"],
    ['firstpage', "./firstpage.html"],
    ['page3',"./page3.html"],
    ['nada', null],
    ['gridpage',"./gridpage.html"],
    ['css-vars',"./varspage.html"],
    ['fetch', "./fetch.html"],
    ['storage','./storage.html'],
    ['import', './import.html'],
    ['chat','./chat.html'],
]

for(let link of links){
    let title = link[0];
    let url = link[1];
    let newbutton = $('<button/>');
    let newanchor = $('<a/>');
    newbutton.text(title);
    if(url) newanchor.attr('href', url);
    newanchor.append(newbutton);
    jqnav.append(newanchor);
    jqnav.append(" ");
}

// newdiv = $('<div/>');
// newdiv.text('newdiv');
// jqnav.append(newdiv);






//FOR FETCH PAGE

// export default biff;